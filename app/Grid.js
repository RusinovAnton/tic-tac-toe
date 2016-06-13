'use strict';

import {every, some, cloneDeep, isNumber} from 'lodash';

class Grid {

    constructor(size, prevState) {

        if (!isNumber(size) && !!!prevState) throw new Error('Size must be a number');

        if (prevState === null) {
            this.size = size
            this.cells = this.empty(this.size);
        } else {
            this.size = prevState.size;
            this.prevState = prevState;
            this.cells = this.fromState();
        }
    }

    empty() {

        let cells = [];
        var i, j;
        for (i = 0; i < this.size; i++) {
            cells[i] = [];
            for (j = 0; j < this.size; j++) {
                // Empty cell
                cells[i][j] = null;
            }
        }
        return cells;
    }

    fromState() {

        let cells = [];

        var i, j;
        for (i = 0; i < this.prevState.size; i++) {
            cells[i] = [];
            for (j = 0; j < this.prevState.size; j++) {
                cells[i][j] = cloneDeep(this.prevState.cells[i][j]);
            }
        }

        return cells;
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

    getRow(index) {
        return this.cells[index];
    }

    getColumn(index) {
        let col = [];
        // Iterates throw each grids' row and compose column array
        this.forEachRow((row)=> {
            col.push(row[index]);
        });

        return col;
    }

    getDiagonal(index){
        return [
            this.getFirstDiagonal(),
            this.getSecondDiagonal()
        ][index];
    }

    forEachDiagonal(cb) {
        for (var i = 0;i<2;i++){
            cb(this.getDiagonal(i), i, 'diagonal');
        }
    }

    /**
     * Iterates throw all grids' rows and applies given callback
     *
     * @param {Function} cb - callback
     */
    forEachRow(cb) {
        let i = 0;
        for (i;i<this.size;i++){
            cb(this.getRow(i), i, 'row');
        }
    }

    /**
     * Iterates throw all grids' columns and applies given callback
     *
     * @param cb
     */
    forEachColumn(cb) {
        let i = 0;
        for (i; i < this.size; i++) {
            cb(this.getColumn(i), i, 'column');
        }
    }

    /**
    * Iterates over each lane in grid applying provided callback function
    * @param cb
    */
    forEachLane(cb) {
        this.forEachDiagonal(cb);
        this.forEachRow(cb);
        this.forEachColumn(cb);
    }

    /**
     * Checks if there are lanes with all players' or all enemy's signs in it
     * Returns true if there are a winning line
     *
     * @returns {bool}
     */
    isDone() {

        let doneState;

        this.forEachLane((lane, i, type) => {
            if (every(lane, {who: 'player'})) {
                doneState = {
                    who: 'player',
                    lane
                };
            } else if (every(lane, {who: 'enemy'})) {
                doneState = {
                    who: 'enemy',
                    lane
                }
            }
        });

        return doneState || false;
    }

    getPossibleWinLanes() {
        let possibleWinLanes = [];
        this.forEachLane((lane, i, type)=>{
            if (!(some(lane, {who: 'player'}) && some(lane, {who: 'enemy'}))) possibleWinLanes.push(lane);
        });
        return possibleWinLanes;
    }

    /**
     * Check if there are lanes which impossible to win because
     * there are both players' and enemys' signs on them
     * returns true if it is possible to win lane
     *
     * @returns {boolean}
     */
    isPossibleWin() {
        return this.getPossibleWinLanes().length !== 0;
    }

}

export default Grid
