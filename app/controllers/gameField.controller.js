import Grid from '../Grid';

let PLAYER_SIGN = '';

export default class gameFieldController {
    constructor($scope, $routeParams) {

        console.log($routeParams.size);

        this.size = $routeParams.size || 3;
        this.gridLoaded = false;

        this.initGrid($scope);

        this.playerMove = true;

        this.gameStatus = 'WIN';
        this.gameEnded = false;
    }

    initGrid($scope) {
        var _self = this;
        return new Promise((resolve, reject)=> {
            resolve(new Grid(this.size));
            reject();
        }).then(function (grid) {
                console.log(grid);
                _self.grid = grid;
                _self.gridLoaded = true;
                $scope.$apply();
            })
            .catch((err)=> {
                console.log(err);
            });
    }

    makeMove(pos) {
        const sign = this.playerMove ?
            PLAYER_SIGN
            : ENEMY_SIGN;

        this.grid.cells[pos.y][pos.x] = sign;
    }
}
