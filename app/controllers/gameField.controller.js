import Grid from '../Grid';
import {randomInt} from '../utils/randomInt';
import {PlayerSign, EnemySign} from '../Sign';
import GameStorage from '../storage/game.storage';

import {isUndefined} from 'lodash';

export default class gameFieldController {
    constructor($scope, $routeParams) {

        this.$scope = $scope;
        this.apply = $scope.apply;

        this.signs = {
            player: new PlayerSign(),
            enemy: new EnemySign()
        };

        this.initStore();

        this.size = this.setGridSize($routeParams.size, this.store.state);

        this.startGame()

    }

    initStore() {
        this.store = new GameStorage();
        if (this.store.state) {
            this.playerMove = this.store.state.playerMove;
            this.moves = this.store.state.moves || [];
        } else {
            this.playerMove = true;
            this.moves = [];
        }
    }

    setGridSize(routeSize, state) {

        if (!isUndefined(routeSize)) {
            routeSize = routeSize >= 3 && routeSize <= 100 ? parseInt(routeSize) : 3;
            if (state !== null) {
                if (state.size !== routeSize) this.store.clearState();
            }
            return routeSize;
        } else {
            if (state !== null) {
                return state.size;
            }
        }

    }

    initGrid() {
        return new Promise((resolve, reject) => {
            resolve(new Grid(this.size, this.store.state));
            reject();
        });
    }

    handleMove(pos) {

        this.storeMove(pos);
        // Do nothing if game ended
        if (this.gameEnded) return;

        // Do nothing if choosen cell isn't empty already
        if (this.grid.cells[pos.y][pos.x] !== null) return;

        if (!this.playerMove) return;

        this.grid.cells[pos.y][pos.x] = new PlayerSign();

        if (this.isGameEnded()) return;

        // Change move turn
        this.playerMove = !this.playerMove;

        this.computerMove();
        this.saveState();
    }

    storeMove(pos) {
        if (this.moves.length >= 2) {
            this.moves.shift();
        }
        this.moves.push(pos);
    }

    computerMove() {

        // Do nothing if game ended
        if (this.gameEnded) return;

        var avaiableCell = this.grid.getAvaiableCells()[0];

        let nextMove = this.predictUserMove() || {x: avaiableCell.x, y: avaiableCell.y};

        setTimeout(()=> {
            this.$scope.$apply(()=> {
                this.grid.cells[nextMove.y][nextMove.x] = new EnemySign();
                if (this.isGameEnded()) return;
                this.playerMove = !this.playerMove;
                this.saveState();
            });
        }, 500);

    }

    predictUserMove() {
        let vector;
        let _self = this;

        function checkVector(vector) {
            // Check if vector is valid. It can be -1, 0, 1
            return (vector.x >= -1 && vector.x <= 1) && (vector.y >= -1 && vector.y <= 1) &&
                // Check if cell choosen by vector is in the scope of grid
                (_self.moves[1].x + vector.x >= 0 && _self.moves[1].x + vector.x < _self.size) &&
                (_self.moves[1].y + vector.y >= 0 && _self.moves[1].y + vector.y < _self.size) &&
                // Check if cell is empty
                (_self.grid.cells[_self.moves[1].y + vector.y][_self.moves[1].x + vector.x] === null)
        }

        if (this.moves.length >= 2) {
            vector = {
                x: this.moves[1].x - this.moves[0].x,
                y: this.moves[1].y - this.moves[0].y
            };
            if (checkVector(vector)) {
                return {x: this.moves[1].x + vector.x, y: this.moves[1].y + vector.y}
            }
        }

        return false;
    }

    /**
     * Save game's state into localstorage
     */
    saveState() {
        this.store.state = {
            size: this.grid.size,
            cells: this.grid.cells,
            moves: this.moves,
            playerMove: this.playerMove
        }
    }

    startGame() {
        this.gameStatus = '';
        this.gameEnded = false;
        this.initGrid()
            .then((grid)=> {
                this.$scope.$apply(()=> {
                        this.grid = grid;
                        this.gridLoaded = true;
                        if (!this.playerMove) {
                            this.computerMove();
                        }
                    }
                )
            });
    }

    restart() {
        this.store.clearState();
        this.grid = null;
        this.gridLoaded = false;
        this.moves = [];
        this.playerMove = true;
        this.startGame();
    }


    isGameEnded() {

        // Draw when there is no way to win
        if (!this.grid.isPossibleWin()) {
            this.gameDraw();
            return true;
        }

        // End game if there is winning lane
        let isDone = this.grid.isDone();
        if (isDone) {
            this.gameEnd(isDone);
            return true;
        }

        // Draw if there is no more avaiable cells
        if (!this.grid.cellsAvaiable()) {
            this.gameDraw();
            return true;
        }

        return false;
    }

    gameEnd(doneState) {

        this.store.clearState();

        // TODO: find out why it doesnt update view
        doneState.lane.forEach((cell)=> {
            cell.highlighed = true;
        });

        this.gameEnded = true;

        if (doneState.who === 'player') {
            this.gameStatus = 'You win! Yay';
        } else {
            this.gameStatus = 'You lose :(';
        }

    }

    gameDraw() {
        this.store.clearState();
        this.gameEnded = true;
        this.gameStatus = 'Draw';
    }
}
