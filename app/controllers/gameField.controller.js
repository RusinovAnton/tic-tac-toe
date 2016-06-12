import Grid from '../Grid';
import GameStorage from '../storage/game.storage';

//let PLAYER_SIGN = '<i class="fa fa-circle"></i>';
//let ENEMY_SIGN = '<i class="fa fa-times"></i>';

let PLAYER_SIGN = '0';
let ENEMY_SIGN = 'x';

export default class gameFieldController {
    constructor($scope, $routeParams) {

        this.signs = {
            player: PLAYER_SIGN,
            enemy: ENEMY_SIGN
        };

        this.playerMove = true;

        this.gridLoaded = false;
        this.gameStatus = 'WIN';
        this.gameEnded = false;

        this.store = new GameStorage();

        this.initGrid($routeParams.size || 3)
            .then(function(grid){
                this.grid = grid;
                this.gridLoaded = true;
                $scope.$apply();
            }.bind(this));
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
            {
                who: 'player',
                sign: PLAYER_SIGN
            }
            : {
                who: 'enemy',
                sign: ENEMY_SIGN
            };

        // End game if there is winning lane
        if (this.grid.isDone()){
            this.gameEnded = true;
            return;
        }

        // Draw if there is no more avaiable cells
        if (!this.grid.cellsAvaiable()) return;

        // Change move turn
        this.playerMove = !this.playerMove;

        this.store.state = {
            size: this.grid.size,
            grid: this.grid.cells
        }

    }

    endGame() {
        this.gameEnded = true;
    }
}
