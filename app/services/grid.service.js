'use strict';

import {EmptySign} from '../Sign';

import isUndefined from '../utils/isUndefined';

import {
    flatten,
    every,
    some,
    cloneDeep,
    isNumber,
    isEqual,
    isArray,
    isObject,
    intersectionWith
} from 'lodash';

export default class Grid {

    constructor() {
        this.gridInit = false;
    }

    /**
     * Returns array of cells that happen in both given lane arrays
     * @param array1
     * @param array2
     * @returns {Array}
     */
    static getLanesIntersections(array1, array2) {

        if (!(isArray(array1) && isArray(array2))) {
            return void 0;
        }

        array1 = flatten(array1);
        array2 = flatten(array2);

        let intersections = intersectionWith(array1, array2, isEqual);

        return intersections.length ? intersections : void 0;
    }

    /**
     * Returns if lane is winnable by player or enemy
     * @param who {String} - 'player' or 'enemy' (default 'player')
     * @param lane
     * @returns {boolean}
     */
    static isLaneWinnableBy(who, lane) {

        who = who || 'player';
        let opposite = who === 'player' ?
            'enemy' :
            'player';

        // Every lane is empty or lane has some signs of same kind
        return every(lane, {body: 'empty'}) ||
            (some(lane, {who: who}) && !some(lane, {who: opposite}));

    }

    /**
     *
     * @param lane
     * @returns {boolean}
     */
    static isLaneWinnable(lane) {
        // Lane is empty or have signs of same kind
        return !(some(lane, {who: 'player'}) && some(lane, {who: 'enemy'}));
    }

    /**
     * Returns true if cell is empty
     * @param cell {Object}
     * @returns {boolean}
     */
    static isEmpty(cell) {
        if (cell === void 0) {
            throw new Error('Argument is undefined');
        }
        return cell.body === 'empty';
    }

    /**
     * Returns winChance for given lane
     * @param lane {Array}
     * @returns {Number}
     */
    static getLaneWinChance(lane) {

        if (!Grid.isLaneWinnable(lane)) return 0; // lane is unwinnable

        let emptyCells = 0;

        // Count lanes' empty cells
        lane.forEach((cell)=> {
            if (Grid.isEmpty(cell)) emptyCells++;
        });

        return (lane.length / emptyCells) / lane.length;
    }

    /**
     * Initialize cells' array with given size or from previous state if given
     * @param size
     * @param prevState
     * @returns {Promise}
     */
    init(size, prevState) {

        if (!isNumber(size) && !prevState) throw new Error('Size must be a number');

        return new Promise((resolve, reject) => {
            try {

                if (!prevState) {
                    this.size = size;
                    this.cells = this.initEmpty(this.size);
                } else {
                    this.size = prevState.size;
                    this.prevState = prevState;
                    this.cells = this.initFromState();
                }

                this.gridInit = true;
                // Return success if grid was initialized
                resolve(this.gridInit);

            } catch (err) {
                reject(err);
            }

        });
    }

    /**
     * Inits cells array with empty cells
     * @returns {Array}
     */
    initEmpty() {

        let cells = [];
        var i, j;
        for (i = 0; i < this.size; i++) {
            cells[i] = [];
            for (j = 0; j < this.size; j++) {
                // Empty cell
                cells[i][j] = new EmptySign({x: j, y: i});
            }
        }
        return cells;
    }

    /**
     * Inits cells array with cells from state
     * @returns {Array}
     */
    initFromState() {

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
     * Sets body for needed cells'
     * @param pos
     * @param body
     * @returns {boolean} true if set
     */
    setCell(pos, body) {

        if (pos.x >= this.size || pos.y >= this.size) throw new Error('Unavaiable position');

        if (!isObject(pos)) throw new Error('Expected pos to be an object');

        if (isUndefined(pos.x) && isUndefined(pos.y)) throw new Error('There is no coordinates in the pos obj');

        this.cells[pos.y][pos.x] = body;

        return true;

    }

    /**
     * Returns' cell by position
     * @param pos {Object} position object {x:, y:}
     * @returns {*}
     */
    getCell(pos) {
        return this.cells[pos.y][pos.x];
    }

    /**
     *  @param lane {Array} pass flat array lane to find initEmpty cells in it (optional)
     *  @returns {Array} of initEmpty cells
     */
    getAvaiableCells(lane) {

        let avaiableCells = [];

        if (isArray(lane)) {
            lane.forEach((cell)=> {
                if (Grid.isEmpty(cell)) {
                    avaiableCells.push(cell);
                }
            })
        } else {
            this.cells.forEach((row)=> {
                row.forEach((cell)=> {
                    if (Grid.isEmpty(cell)) avaiableCells.push(cell);
                })
            });
        }

        return avaiableCells;
    }

    /**
     * True if there are cells avaiable
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
     * Returns needed row from grid by its' index
     * @param index {Number}
     * @returns {Array}
     */
    getRow(index) {
        return this.cells[index];
    }

    /**
     * Returns' needed column from grid by its' index
     * @param index
     * @returns {Array}
     */
    getColumn(index) {

        let col = [];
        // Iterates throw each grids' row and compose column array
        this.forEachRow((row)=> {
            col.push(row[index]);
        });

        return col;
    }

    /**
     * Returns' central cell or false if impossible
     * @returns {Object || undefined}
     */
    getCenter() {

        if (this.size % 2 === 0) return void 0;
        return this.cells[(this.size - 1) / 2][(this.size - 1) / 2];

    }

    /**
     * Iterates over both diagonales and applies given callback
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachDiagonal(cb) {
        for (var i = 0; i < 2; i++) {
            cb([
                this.getFirstDiagonal(),
                this.getSecondDiagonal()
            ][i], i, 'diagonal');
        }
    }

    /**
     * Iterates throw all grids' rows and applies given callback
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachRow(cb) {
        let i = 0;
        for (i; i < this.size; i++) {
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
     * @returns {bool} true if there is a winning lane
     */
    isDone() {

        let doneState;

        this.forEachLane((lane) => {
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

    /**
     * returns array of lanes which is possible to win
     * @param who {String} - 'player' || 'enemy' (optional) - get winnable lane by player or enemy only
     * @returns {Array}
     */
    getWinnableLanes(who) {

        let possibleWinLanes = [];

        this.forEachLane((lane)=> {
            if (!isUndefined(who) && !Grid.isLaneWinnableBy(who, lane)) {
                return;
            } else if (!Grid.isLaneWinnable(lane)) {
                return;
            }
            possibleWinLanes.push(lane);
        });

        if (possibleWinLanes.length) {
            return possibleWinLanes
        }

    }

    /**
     * returns array of lanes which is possible to win
     * @returns {Array}
     */
    getUnwinnableLanes() {

        let impossibleWinLanes = [];

        this.forEachLane((lane)=> {

            if (!Grid.isLaneWinnable(lane)) {
                impossibleWinLanes.push(lane);
            }

        });

        return impossibleWinLanes;

    }

    /**
     * returns true if there are winnable lanes
     *
     * @returns {boolean}
     */
    isWinnable() {
        return this.getWinnableLanes() !== void 0;
    }

}
