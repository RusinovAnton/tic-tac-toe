'use strict';

import Grid from '../Grid';
import {randomInt} from '../utils/randomInt';
import {PlayerSign, EnemySign} from '../Sign';
import GameStorage from '../storage/game.storage';

import {isUndefined, some} from 'lodash';

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
        if (!this.grid.isEmpty(this.grid.getCell(pos))) return;

        if (!this.playerMove) return;

        this.grid.setCell(pos,new PlayerSign(pos));

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

        let nextMove = this.predictUserMove() ||
            this.possibleWinMove() ||
            {x: avaiableCell.x, y: avaiableCell.y};

        setTimeout(()=> {
            this.$scope.$apply(()=> {
                this.grid.setCell(nextMove, new EnemySign(nextMove));
                if (this.isGameEnded()) return;
                this.playerMove = !this.playerMove;
                this.saveState();
            });
        }, 500);
    }

    predictUserMove() {
        let vector;
        let _self = this;

        let prevMove = this.moves[0]
        let lastMove = this.moves[1];

        function checkVector(vector) {
            // Check if vector is valid. It can be -1, 0, 1
            return (vector.x >= -1 && vector.x <= 1) && (vector.y >= -1 && vector.y <= 1) &&
                // Check if cell choosen by vector is in the scope of grid
                (lastMove.x + vector.x >= 0 && lastMove.x + vector.x < _self.size) &&
                (lastMove.y + vector.y >= 0 && lastMove.y + vector.y < _self.size) &&
                // Check if cell is empty
                (_self.grid.isEmpty(_self.grid.cells[lastMove.y + vector.y][lastMove.x + vector.x]))
        }

        if (this.moves.length >= 2) {
            vector = {
                x: lastMove.x - prevMove.x,
                y: lastMove.y - prevMove.y
            };
            if (checkVector(vector)) {
                return {x: lastMove.x + vector.x, y: lastMove.y + vector.y}
            }
        }

        return false;
    }

    possibleWinMove() {

        let possibleWinLanes = this.grid.getPossibleWinLanes().filter((lane)=>{
            return !some(lane, {who: 'player'});
        });


        if (!possibleWinLanes.length) {
            return false;
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

    highlightLane(lane) {
        lane.forEach((cell) => {
           cell.highlighted = true;
        });
    }

    gameEnd(doneState) {
        this.store.clearState();
        this.gameEnded = true;

        this.highlightLane(doneState.lane);

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
