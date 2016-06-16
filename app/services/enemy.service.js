import {some} from 'lodash';

export default class Enemy {
    constructor() {
        this._grid = null;
        this.userMoves = [];
    }

    set grid(grid) {
        this._grid = grid;
    }

    move() {

        var avaiableCell = this._grid.getAvaiableCells()[0];

        let movePos = this.predictUserMove() ||
            this.possibleWinMove() ||
            {x: avaiableCell.x, y: avaiableCell.y};

        return new Promise((resolve, reject)=> {
            // Setting timeout to mock enemys' thinking time
            setTimeout(()=> {
                resolve(movePos);
            }, 500);
        });

    }

    storeUserMove(pos) {
        if (this.userMoves.length >= 2) {
            this.userMoves.shift();
        }
        this.userMoves.push(pos);
    }

    predictUserMove() {
        let vector;
        let _self = this;

        let prevMove = this.userMoves[0];
        let lastMove = this.userMoves[1];

        function isVector(vector) {
            // Check if vector is valid. It can be -1, 0, 1
            return (vector.x >= -1 && vector.x <= 1) && (vector.y >= -1 && vector.y <= 1) &&
                // Check if cell choosen by vector is in the scope of _grid
                (lastMove.x + vector.x >= 0 && lastMove.x + vector.x < _self._grid.size) && (lastMove.y + vector.y >= 0 && lastMove.y + vector.y < _self._grid.size) &&
                // Check if cell is empty
                (_self._grid.isEmpty(
                        _self._grid.getCell(
                            {
                                x: lastMove.x + vector.x,
                                y: lastMove.y + vector.y
                            }
                        )
                    )
                );
        }

        if (this.userMoves.length >= 2) {
            vector = {
                x: lastMove.x - prevMove.x,
                y: lastMove.y - prevMove.y
            };
            console.log(isVector(vector));
            if (isVector(vector)) {
                return {x: lastMove.x + vector.x, y: lastMove.y + vector.y}
            }
        }

        return false;
    }

    possibleWinMove() {

        let possibleWinLanes = this._grid.getWinnableLanes().filter((lane)=> {
            return !some(lane, {who: 'player'});
        });


        if (!possibleWinLanes.length) {
            return false;
        }

        return false;
    }
}
