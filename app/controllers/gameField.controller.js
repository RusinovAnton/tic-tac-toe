import Grid from '../Grid';
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

        this.gridLoaded = false;

        this.newGame();
    }

    initGrid(size) {
        return new Promise((resolve, reject) => {
                resolve(new Grid(size));
                reject();
            });
    }

    handleMove(pos) {

        // Do nothing if game ended
        if (this.gameEnded) return;

        // Do nothing if choosen cell isn't empty already
        if (this.grid.cells[pos.y][pos.x] !== null) return;

        this.grid.cells[pos.y][pos.x] = this.playerMove ?
            new PlayerSign()
            : new EnemySign();

        this.saveState();

        if (this.isGameEnded()) return;

        // Change move turn
        this.playerMove = !this.playerMove;

    }

    isGameEnded() {
        // End game if there is winning lane
        if (this.grid.isDone()) {
            this.gameEnd('player');
            return true;
        }

        let turn = this.playerMove ? 'player' : 'enemy';

        if (!this.grid.possibleWin(turn)) {
            this.gameDraw();
            return true;
        }

        // Draw if there is no more avaiable cells
        if (!this.grid.cellsAvaiable()) {
            console.log('draw');
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
            grid: this.grid.cells
        }
    }

    gameEnd(winner, winLane) {
        this.gameEnded = true;
        if (winner === 'player') {
            this.gameStatus = 'You win! Yay';
        } else {
            this.gameStatus = 'You lose :(';
        }
    }

    gameDraw() {
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
                console.log(this);
                this.grid = grid;
                this.gridLoaded = true;
                this.$scope.$apply();
            });
    }
}
