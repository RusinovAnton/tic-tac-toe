'use strict';

import Grid from '../../services/grid.service';
import GameStorage from '../../services/gameStorage.service';
import Enemy from '../../services/enemy.service';
import {PlayerSign, EnemySign} from '../../Sign';

import {isUndefined} from 'lodash';

function playersMove() {
    // return Math.random() >= 0.5;
    return true;
}

export default class gameFieldController {

    constructor($scope, $routeParams) {

        this.$scope = $scope;
        this.apply = $scope.apply;

        this.signs = {
            player: new PlayerSign(),
            enemy: new EnemySign()
        };

        this.enemy = new Enemy();

        this.initStore();

        this.setGridSize($routeParams.size, this.store.state);

        this.gridLoaded = false;
        this.initGrid();

        this.startGame();

    }

    initStore() {
        this.store = new GameStorage();
        if (this.store.state) {
            this.playerMove = this.store.state.playerMove;
            this.enemy.userMoves = this.store.state.moves || [];
        } else {
            this.playerMove = playersMove();
            this.moves = [];
        }
    }

    setGridSize(routeSize, state) {
        if (!isUndefined(routeSize)) {
            routeSize = routeSize >= 3 && routeSize <= 100 ? parseInt(routeSize) : 3;
            if (state !== null) {
                if (state.size !== routeSize) this.store.clearState();
            }
            this.size = routeSize;
        } else {
            if (state !== null) {
                this.size = state.size;
            }
        }
    }

    initGrid() {

        this.grid = new Grid();
        this.enemy.grid = this.grid;

        this.grid.init(this.size, this.store.state)
            .then((success) => {
                if (success) {
                    this.$scope.$apply(()=> {
                        this.gridLoaded = true;
                    });
                }
            });
    }

    handleMove(pos) {

        // Do nothing if its not users' turn now
        if (!this.playerMove) return;

        // Do nothing if game ended
        if (this.gameEnded) return;

        // Do nothing if choosen cell isn't empty already
        if (!Grid.isEmpty(this.grid.getCell(pos))) return;

        this.grid.setCell(pos, new PlayerSign(pos));

        if (this.isGameEnded()) return;

        // Change move turn
        this.playerMove = !this.playerMove;

        this.saveState();

        this.enemyMove();

    }

    enemyMove() {
        // Get enemys' move position, then apply it for view
        this.enemy.move()
            .then((pos)=>{
                this.$scope.$apply(()=> {
                    this.grid.setCell(pos, new EnemySign(pos));
                    if (this.isGameEnded()) return;
                    this.playerMove = !this.playerMove;
                    this.saveState();
                });
            });
    }

    /**
     * Save game's state into localStorage
     */
    saveState() {
        this.store.state = {
            size: this.grid.size,
            cells: this.grid.cells,
            moves: this.enemy.userMoves,
            playerMove: this.playerMove
        }
    }

    startGame() {
        this.gameStatus = '';
        this.gameEnded = false;
        if (!this.playerMove) {
            this.enemyMove();
        }
    }

    endGame(doneState) {
        this.store.clearState();
        this.gameEnded = true;

        this.highlightLane(doneState.lane);

        if (doneState.who === 'player') {
            this.gameStatus = 'You win! Yay';
        } else {
            this.gameStatus = 'You lose :(';
        }
    }

    restartGame() {

        this.store.clearState();

        this.grid = null;
        this.gridLoaded = false;

        this.enemy.userMoves = [];

        this.playerMove = playersMove();
        this.initGrid();
        this.startGame();
    }

    drawGame() {
        this.store.clearState();
        this.gameEnded = true;
        this.gameStatus = 'Draw';
    }

    isGameEnded() {

        // Draw when there is no way to win
        // TODO: cache winnable lanes for user/enemy turns' cycle step
        if (!this.grid.isWinnable()) {
            this.drawGame();
            return true;
        }

        // End game if there is winning lane
        let isDone = this.grid.isDone();
        if (isDone) {
            this.endGame(isDone);
            return true;
        }

        // Draw if there is no more avaiable cells
        if (!this.grid.cellsAvaiable()) {
            this.drawGame();
            return true;
        }

        return false;
    }

    highlightLane(lane) {
        lane.forEach((cell) => {
            cell.highlighted = true;
        });
    }

}
