'use strict';

import Grid from '../base/Grid';
import {EmptySign} from '../base/Sign';

import isUndefined from '../utils/isUndefined';

import {
    flatten,
    every,
    some,
    cloneDeep,
    isNumber,
    isArray,
    isObject
} from 'lodash';

export default class TicTacToeGrid extends Grid {

    constructor() {
        super();
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

        if (!TicTacToeGrid.isLaneWinnable(lane)) return 0; // lane is unwinnable

        let emptyCells = 0;

        // Count lanes' empty cells
        lane.forEach((cell)=> {
            if (TicTacToeGrid.isEmpty(cell)) emptyCells++;
        });

        return (lane.length / emptyCells) / lane.length;
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
     *  @param lane {Array} (optional) lane array or array of lane arrays to find empty cells in it
     *  @returns {Array} of initEmpty cells
     */
    getAvaiableCells(lane) {

        let avaiableCells = [];

        if (isArray(lane)) {
            lane = flatten(lane);
            lane.forEach((cell)=> {
                if (TicTacToeGrid.isEmpty(cell)) {
                    avaiableCells.push(cell);
                }
            })
        } else {
            this.cells.forEach((row)=> {
                row.forEach((cell)=> {
                    if (TicTacToeGrid.isEmpty(cell)) avaiableCells.push(cell);
                })
            });
        }

        return avaiableCells;
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
        if (!isUndefined(who)) {
            this.forEachLane((lane)=> {
                if (TicTacToeGrid.isLaneWinnableBy(who, lane)) {
                    possibleWinLanes.push(lane);
                }
            });
        } else {
            this.forEachLane((lane)=> {
                if (TicTacToeGrid.isLaneWinnable(lane)) {
                    possibleWinLanes.push(lane);
                }
            });
        }
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

            if (!TicTacToeGrid.isLaneWinnable(lane)) {
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
