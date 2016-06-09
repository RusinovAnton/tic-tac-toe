import Grid from '../Grid';
export default class gameFieldController {
    constructor($scope) {
        this.grid = new Grid(3);
        this.gameStatus = 'WIN';
        this.gameEnded = true;
    }
}
