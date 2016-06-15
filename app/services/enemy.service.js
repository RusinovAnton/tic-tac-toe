import {some} from 'lodash';

export default class Enemy {
    constructor(grid) {
        this.grid = grid;
        this.userMoves = [];
    }

    move() {
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

        function checkVector(vector) {
            // Check if vector is valid. It can be -1, 0, 1
            return (vector.x >= -1 && vector.x <= 1) && (vector.y >= -1 && vector.y <= 1) &&
                // Check if cell choosen by vector is in the scope of grid
                (lastMove.x + vector.x >= 0 && lastMove.x + vector.x < _self.size) &&
                (lastMove.y + vector.y >= 0 && lastMove.y + vector.y < _self.size) &&
                // Check if cell is empty
                (_self.grid.isEmpty(_self.grid.cells[lastMove.y + vector.y][lastMove.x + vector.x]))
        }

        if (this.userMoves.length >= 2) {
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
}
