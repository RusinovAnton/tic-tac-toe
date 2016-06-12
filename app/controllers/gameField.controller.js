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
        this.state = this.store.state || null;
        // Clear state if its size value is different from routeParams.size
        // (suppose it was changed via new game form or manually from url)
        if (this.state !== null && this.state.size !== this.size) this.store.clearState();

        this.gridLoaded = false;

        this.newGame();
    }

    initGrid(size) {
        return new Promise((resolve, reject) => {
                resolve(new Grid(size, this.store.state));
                reject();
            });
    }

    handleMove(pos) {

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

    computerMove() {

        // Do nothing if game ended
        if (this.gameEnded) return;

        this.playerMove = !this.playerMove;
        var avaiableCell = this.grid.getAvaiableCells()[0];

        setTimeout(()=>{
            this.$scope.$apply(()=>{
                this.grid.cells[avaiableCell.y][avaiableCell.x] = new EnemySign();
            });
            this.saveState();
            this.$scope.$apply(()=>{
                this.isGameEnded()
            })

        }, 500);

    }

    isGameEnded() {

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

        //let turn = this.playerMove ? 'player' : 'enemy';

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
            cells: this.grid.cells
        }
    }

    gameEnd(isDoneObj) {
        this.store.clearState();
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
        this.newGame();
    }

    newGame() {
        this.playerMove = true;
        this.gameStatus = '';
        this.gameEnded = false;
        this.initGrid(this.size)
            .then((grid)=>{
                this.grid = grid;
                this.gridLoaded = true;
                this.$scope.$apply();
            });
    }
}
