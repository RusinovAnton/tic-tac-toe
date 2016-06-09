import Grid from '../Grid';

let PLAYER_SIGN = 'x';
let ENEMY_SIGN = '0';

export default class gameFieldController {
    constructor($scope, $routeParams) {

        this.size = $routeParams.size || 3;
        this.gridLoaded = false;

        this.initGrid($scope);

        this.playerMove = false;

        this.gameStatus = 'WIN';
        this.gameEnded = false;
    }

    handleMove(pos) {

        // Do nothing if choosen cell isn't empty already
        if (this.grid.cells[pos.y][pos.x] !== null) return;

        // Do nothing if game ended
        if (this.gameEnded) return;

        this.grid.cells[pos.y][pos.x] = this.playerMove ?
            PLAYER_SIGN
            : ENEMY_SIGN;

        console.log(this.grid.cells);

        // Change move turn
        this.playerMove = !this.playerMove;

    }

    initGrid($scope) {
        var _self = this;
        return new Promise((resolve, reject)=> {
            resolve(new Grid(this.size));
            reject();
        }).then(function (grid) {
                _self.grid = grid;
                _self.gridLoaded = true;
                $scope.$apply();
            })
            .catch((err)=> {
                console.log(err);
            });
    }
}
