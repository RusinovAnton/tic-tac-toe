import Grid from '../Grid';
import GameStorage from '../storage/game.storage';

let PLAYER_SIGN = '<i class="fa fa-circle"></i>';
let ENEMY_SIGN = '<i class="fa fa-times"></i>';

export default class gameFieldController {
    constructor($scope, $routeParams) {

        this._scope = $scope;
        this.params = $routeParams;
        this.store = new GameStorage();
        this.gridLoaded = false;

        this.initGrid($scope);

        this.signs = {
            player: PLAYER_SIGN,
            enemy: ENEMY_SIGN
        };

        this.playerMove = true;
        this.gameStatus = 'WIN';
        this.gameEnded = false;

        console.log(this);
    }

    initGrid($scope) {
        var _self = this;

        var prevState = this.store.state;

        if (this.params.size !== prevState.size) this.store.clearState();

        this.size = this.params.size || 3;

        return new Promise((resolve, reject)=> {
            resolve(new Grid(this.size));
            reject();
        }).then(function (grid) {
                _self.grid = grid;
                _self.gridLoaded = true;
                _self._scope.$apply();
            })
            .catch((err)=> {
                console.log(err);
            });
    }

    handleMove(pos) {

        // Do nothing if choosen cell isn't empty already
        if (this.grid.cells[pos.y][pos.x] !== null) return;

        // Do nothing if game ended
        if (this.gameEnded) return;

        this.grid.cells[pos.y][pos.x] = this.playerMove ?
            PLAYER_SIGN
            : ENEMY_SIGN;

        // Change move turn
        this.playerMove = !this.playerMove;

        this.store.state = {
            size: this.size,
            grid: this.grid.cells
        }

    }

    endGame(){
        this.gameEnded = true;
    }
}
