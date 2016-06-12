import Grid from '../Grid';
import {randomInt} from '../utils/randomInt';
import { PlayerSign, EnemySign } from '../Sign';
import GameStorage from '../storage/game.storage';

export default class gameFieldController {
    constructor($scope, $routeParams) {

        this.$scope = $scope;

        this.size = $routeParams.size > 2 && $routeParams.size < 101 ? parseInt($routeParams.size) : 3;

        this.signs = {
            player: new PlayerSign(),
            enemy: new EnemySign()
        }

        this.store = new GameStorage();
        if (this.store.state) {
            this.playerMove = this.store.state.playerMove || true;
            this.moves = this.store.state.moves || [];
        } else {
            this.playerMove = true;
            this.moves = [];
        }


        this.newGame();
    }

    initGrid() {
        return new Promise((resolve, reject) => {
                resolve(new Grid(this.size, this.store.state));
                reject();
            });
    }

    storeMove(pos) {
        if (this.moves.length >= 2) {
            this.moves.shift();
        }
        this.moves.push(pos);
    }

    handleMove(pos) {

        this.storeMove(pos);
        // Do nothing if game ended
        if (this.gameEnded) return;

        // Do nothing if choosen cell isn't empty already
        if (this.grid.cells[pos.y][pos.x] !== null) return;

        if (!this.playerMove) return;

        this.grid.cells[pos.y][pos.x] = new PlayerSign();

        this.saveState();

        if (this.isGameEnded()) return;

        // Change move turn
        this.playerMove = !this.playerMove;
        this.computerMove();

    }

    predictUserMove() {
        let vector;

        function checkVector(vector){
            return (vector.x >= -1 && vector.x <= 1) && (vector.y >= -1 && vector.y <= 1)
        }

        if (this.moves.length >= 2) {
            vector = {
                x: this.moves[1].x - this.moves[0].x,
                y: this.moves[1].y - this.moves[0].y
            }
            if (checkVector(vector)) {
                return {x: this.moves[1].x + vector.x, y: this.moves[1].y + vector.y}
            }
        }

        return false;
    }

    computerMove() {

        // Do nothing if game ended
        if (this.gameEnded) return;

        var avaiableCell = this.grid.getAvaiableCells()[0];

        let nextMove = this.predictUserMove() || {x: avaiableCell.x, y: avaiableCell.y};

        setTimeout(()=>{
            this.$scope.$apply(()=> {
                this.grid.cells[nextMove.y][nextMove.x] = new EnemySign();
                this.saveState();
                this.isGameEnded();
                this.playerMove = !this.playerMove;
            });
        }, 500);

    }

    isGameEnded() {

        // Draw when there is no way to win
        if (!this.grid.possibleWin()) {
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

    gameEnd(isDoneObj) {
        this.store.clearState();
        // TODO: find out why it doesnt update view
        isDoneObj.lane.forEach((cell)=>{
            cell.highlighed = true;
        });
        this.grid = this.grid;
        this.gameEnded = true;
        if (isDoneObj.who === 'player') {
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

    restart() {
        this.store.clearState();
        this.grid = null;
        this.gridLoaded = false;
        this.moves = [];
        this.playerMove = true;
        this.newGame();
    }

    newGame() {
        this.gameStatus = '';
        this.gameEnded = false;
        this.initGrid()
            .then((grid)=>{
                this.grid = grid;
                this.gridLoaded = true;
                this.$scope.$apply();
            });
        if (!this.playerMove) {
            this.computerMove();
        }
    }
}
