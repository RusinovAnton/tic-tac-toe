import {every} from 'lodash';

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
        return new Promise((resolve, reject)=>{
                let avaiableCells = [];
                this.cells.forEach((row, i)=>{
                    row.forEach((cell,j)=>{
                          if (cell === null) {
                              avaiableCells.push({x:j,y:i});
                          }
                    })
                });
                resolve(avaiableCells);
            })
    }

    /**
    * True if there is avaiable cells
    * @returns {boolean}
    */
    cellsAvaiable() {
        return this.getAvaiableCells().length !== 0;
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
        function checkLine(array){
          return every(array, {who:'player'}) || every(array, {who: 'enemy'});
        }

        function isDiagonalDone() {

          /**
           * [x, ., .]
           * [., x, .]
           * [., ., x]
           * @returns {Array} Array with elements from first diagonal
           */
          function getFirstDiagonal() {
              let diagonal = [];

              let i = 0;
              for (i; i < _self.size; i++) {
                  diagonal.push(_self.cells[i][i]);
              }
              return diagonal;
          }

          /**
           * [., ., x]
           * [., x, .]
           * [x, ., .]
           * @returns {Array} Array with elements from second diagonal
           */
          function getSecondDiagonal() {
              let diagonal = [];
              let i = 0;
              let j = _self.size - 1;
              while (i < _self.size) {
                  diagonal.push(_self.cells[i][j]);
                  i++;
                  j--;
              }
              return diagonal;
          }

          return checkLine(getFirstDiagonal()) || checkLine(getSecondDiagonal());
      }

        /**
         * checks every horizontal for winning lane
         * @returns {boolean} true if there are winning lane
         */
        function isHorizontalDone() {
          let isDone = false;

          _self.cells.forEach((row)=>{
              isDone = checkLine(row) || isDone;
          });

          return isDone;
      }

        /**
        * checks every vertical for winning lane
        * @returns {boolean} true if there are winning lane
        */
        function isVerticalDone() {
          let isDone = false;
          let i = 0;
          for (i;i<_self.size;i++){
              let col = [];
              _self.cells.forEach((row)=>{
                  col.push(row[i]);
          });
              isDone = checkLine(col) || isDone;
          }

          return isDone;
      }

        return isDiagonalDone() || isHorizontalDone() || isVerticalDone();
    }
}

export default Grid
