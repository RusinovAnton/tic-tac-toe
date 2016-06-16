'use strict';

import {EmptySign} from '../Sign';

import {every, some, cloneDeep, isNumber, isArray, isObject, isUndefined} from 'lodash';

export default class Grid {

    constructor() {
        this.gridInited = false;
    }

    init(size, prevState) {

        if (!isNumber(size) && !prevState) throw new Error('Size must be a number');

        return new Promise((resolve, reject) => {
            try {
                if (prevState === null) {
                    this.size = size;
                    this.cells = this.empty(this.size);
                } else {
                    this.size = prevState.size;
                    this.prevState = prevState;
                    this.cells = this.fromState();
                }

                this.gridInited = true;
                resolve(true);

            } catch(err) {
                reject(err);
            }

        });
    }

    empty() {

        let cells = [];
        var i, j;
        for (i = 0; i < this.size; i++) {
            cells[i] = [];
            for (j = 0; j < this.size; j++) {
                // Empty cell
                cells[i][j] = new EmptySign({x:j, y:i});
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

    isEmpty(cell) {
        if (cell === void 0) {throw new Error('Argument is undefined');}
        return cell.body === 'empty';
    }

    setCell(pos, body) {

        if (pos.x >= this.size || pos.y >= this.size) throw new Error('Unavaiable position');

        if (!isObject(pos)) throw new Error('Expected pos to be an object');

        if (isUndefined(pos.x) && isUndefined(pos.y)) throw new Error('There is no coordinates in the pos obj');

        this.cells[pos.y][pos.x] = body;

        console.log(this.cells);

        return true;

    }

    getCell(pos) {
        return this.cells[pos.y][pos.x];
    }

    /**
     *   Returns array of objects with coordinates of avaiable cells
     *   e.g
     *   [{x:0,y:3},{x:3,y:0},{x:6, y:0}]
     */
    getAvaiableCells(lane) {

        let avaiableCells = [];

        if (isArray(lane)) {
                lane.forEach((_, j)=>{
                    if (this.isEmpty(cell)) {
                        avaiableCells.push(cell.pos);
                    }
                })
        } else {
            this.cells.forEach((row)=> {
                row.forEach((cell)=> {
                    if (this.isEmpty(cell)) avaiableCells.push(cell.pos);
                })
            });
        }
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

    /**
     * Iterates over both diagonales and applies given callback
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachDiagonal(cb) {
        for (var i = 0;i<2;i++){
            cb(this.getDiagonal(i), i, 'diagonal');
        }
    }

    /**
     * Iterates throw all grids' rows and applies given callback
     *
     * @param {Function} cb(lane, index, laneType)
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
     * @param {Function} cb(lane, index, laneType)
     */
    forEachColumn(cb) {
        let i = 0;
        for (i; i < this.size; i++) {
            cb(this.getColumn(i), i, 'column');
        }
    }

    /**
     * Iterates over each lane in grid applying provided callback function
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachLane(cb) {
        this.forEachDiagonal(cb);
        this.forEachRow(cb);
        this.forEachColumn(cb);
    }

    /**
     * Checks if there are lanes with all players' or all enemy's signs in it
     *
     * @returns {bool} true if there are a winning lane
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
        this.forEachLane((lane, index)=>{
            if (!(some(lane, {who: 'player'}) && some(lane, {who: 'enemy'}))) {
                lane.$index = index;
                possibleWinLanes.push(lane);
            }
        });
        return possibleWinLanes;
    }

    /**
     * returns true if there are lanes in array possible
     *
     * @returns {boolean}
     */
    isPossibleWin() {
        return this.getPossibleWinLanes().length !== 0;
    }

}


