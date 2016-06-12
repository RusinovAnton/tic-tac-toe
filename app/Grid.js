'use strict';

import {every, some} from 'lodash';

class Grid {

    constructor(size, prevState) {
        this.size = size
        this.cells = []

        if (prevState === void 0) {
            this.empty();
        } else {
            this.fromState(prevState)
        }
    }

    empty() {
        var i, j;
        for(i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for(j = 0;j < this.size; j++) {
                // Empty cell
                this.cells[i][j] = null;
            }
        }
    }

    fromState(state) {}

    /**
    *   Returns Promise which resolves array of objects with coordinates of avaiable cells
    *   e.g
    *   [{x:0,y:3},{x:3,y:0},{x:6, y:0}]
    * @returns {Promise}
    */
    getAvaiableCells(){
        let avaiableCells = [];
        this.cells.forEach((row, i)=>{
            row.forEach((cell,j)=>{
                if (cell === null) {
                    avaiableCells.push({x:j,y:i});
                }
            })
        });
        return avaiableCells;
    }

    /**
    * True if there is avaiable cells
    * @returns {boolean}
    */
    cellsAvaiable() {
        return this.getAvaiableCells().length !== 0;
    }

    /**
     * [x, ., .]
     * [., x, .]
     * [., ., x]
     * @returns {Array} Array with elements from first diagonal
     */
    getFirstDiagonal() {
        let diagonal = [];

        let i = 0;
        for (i; i < this.size; i++) {
            diagonal.push(this.cells[i][i]);
        }
        return diagonal;
    }

    /**
     * [., ., x]
     * [., x, .]
     * [x, ., .]
     * @returns {Array} Array with elements from second diagonal
     */
    getSecondDiagonal() {
        let diagonal = [];
        let i = 0;
        let j = this.size - 1;
        while (i < this.size) {
            diagonal.push(this.cells[i][j]);
            i++;
            j--;
        }
        return diagonal;
    }

    forEachRow(cb) {
        return this.cells.forEach(cb);
    }

    forEachColumn(cb) {
        let i = 0;
        for (i;i<this.size;i++){
            let col = [];
            this.cells.forEach((row)=>{
                col.push(row[i]);
            });
            cb(col);
        }
    }

    /**
    * Returns true if there are a winning line
    * @returns {bool}
    */
    isDone() {
        let _self = this;

        /**
        * Take line array and returns true if all signs in line are the same
        * @param array
        * @returns {bool}
        */
        function checkLane(array){
          return every(array, {who:'player'}) || every(array, {who: 'enemy'});
        }

        function isDiagonalDone() {
          return checkLane(_self.getFirstDiagonal()) || checkLane(_self.getSecondDiagonal());
        }

        /**
         * checks every row for winning lane
         * @returns {boolean} true if there are winning lane
         */
        function isRowDone() {
          let isDone = false;

            this.forEachRow((row)=>{
                isDone = checkLane(row) || isDone;
            });

          return isDone;
      }.bind(this)

        /**
        * checks every column for winning lane
        * @returns {boolean} true if there are winning lane
        */
        function isColumnDone() {
          let isDone = false;

          this.forEachColumn((col)=>{
              isDone = checkLane(col) || isDone
          });

          return isDone;
      }.bind(this)

        return isDiagonalDone() || isRowDone() || isColumnDone();
    }

    possibleWin(turn) {
        let isPossible = true;


        return isPossible;
    }
}

export default Grid
