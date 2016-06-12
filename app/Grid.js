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
        for (i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for (j = 0; j < this.size; j++) {
                // Empty cell
                this.cells[i][j] = null;
            }
        }
    }

    fromState(state) {
    }

    /**
     *   Returns array of objects with coordinates of avaiable cells
     *   e.g
     *   [{x:0,y:3},{x:3,y:0},{x:6, y:0}]
     */
    getAvaiableCells() {
        let avaiableCells = [];
        this.cells.forEach((row, i)=> {
            row.forEach((cell, j)=> {
                if (cell === null) {
                    avaiableCells.push({x: j, y: i});
                }
            })
        });
        return avaiableCells;
    }

    /**
     * True if there is avaiable cells
     *
     * @returns {boolean}
     */
    cellsAvaiable() {
        return this.getAvaiableCells().length !== 0;
    }

    /**
     * [x, ., .]
     * [., x, .]
     * [., ., x]
     *
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
     *
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

    /**
     * Iterates throw all grids' rows and applies given callback
     *
     * @param {Function} cb - callback
     */
    forEachRow(cb) {
        return this.cells.forEach(cb);
    }

    /**
     * Iterates throw all grids' columns and applies given callback
     *
     * @param cb
     */
    forEachColumn(cb) {
        let i = 0;
        for (i; i < this.size; i++) {
            let col = [];
            // Iterates throw each grids' row and compose column array
            this.forEachRow((row)=> {
                col.push(row[i]);
            });
            // Then pass column array to the given callback function
            cb(col);
        }
    }

    /**
     * This method takes checker function (checkLane)
     * and goes throw all grids' lanes (which are arrays from diagonales, rows, columns)
     * and returns true if there are at least one match for checker
     *
     * @param checkLane
     * @returns {boolean}
     */
    checkLanes(checkLane) {
        let isValid = false;

        // Check diagonals
        isValid = checkLane(this.getFirstDiagonal()) || checkLane(this.getSecondDiagonal()) || isValid;

        // Check rows
        this.forEachRow((row)=> {
            isValid = checkLane(row) || isValid;
        });

        // Check columns
        this.forEachColumn((col)=> {
            isValid = checkLane(col) || isValid
        });

        return isValid;
    }

    /**
     * Returns true if there are a winning line
     *
     * @returns {bool}
     */
    isDone() {
        return this.checkLanes((lane) => {
            // Checks if there are lanes with all players' or all enemy's signs in it
            return every(lane, {who: 'player'}) || every(lane, {who: 'enemy'});
        });
    }

    /**
     * Check if there are lanes which impossible to win because
     * there are both players' and enemys' signs on them
     * returns true if it is possible to win lane
     *
     * @returns {boolean}
     */
    possibleWin(turn) {
        return this.checkLanes((lane) => {
            return !(some(lane, {who: 'player'}) && some(lane, {who: 'enemy'}));
        });
    }
}

export default Grid
