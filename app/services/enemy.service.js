'use strict';

import Grid from '../services/grid.service';

import isUndefined from '../utils/isUndefined';
import allMaxBy from '../utils/allMaxBy.util';
import randomInt from '../utils/randomInt';

import {isArray} from 'lodash';

import {
    some,
    max,
    maxBy,
    flatten,
    intersection
} from 'lodash';

export default class Enemy {

    constructor() {
        this._grid = null;
    }

    set grid(grid) {
        this._grid = grid;
    }

    move() {

        let movePos = this.possibleWinMove();

        return new Promise((resolve, reject)=> {

            if (!movePos) {
                reject(new Error('There is no move position object'));
            }

            // Setting timeout to mock enemys' thinking time
            setTimeout(()=> {
                resolve(movePos);
            }, 500);

        });

    }

    /**
     * @returns {pos || false} position object ({x: , y: }) or false if there is no possible moves
     */
    possibleWinMove() {

        // Take central cell if possible
        let centerCell = this._grid.getCenter();
        if (centerCell && Grid.isEmpty(centerCell)) return centerCell.pos;

        this.setCellChances();

        return this.getMaxChancePosition() || this.getIntersectionPosition() || this.getWinnablePosition();

    }

    getMaxChancePosition() {

        this.maxChanceCells = this.getMaxChanceCells();

        if (!this.maxChanceCells || !this.maxChanceCells.length) return false;

        // if there is only one cell with max winChance
        else if (this.maxChanceCells.length === 1) return this.maxChanceCells[0].pos;

        // if there are cells which win game on next turn
        else if (this.getMaxChance() === 1) {

            let enemyMaxChanceLanes = this.getMaxChanceLanes('enemy');
            let playerMaxChanceLanes = this.getMaxChanceLanes('player');

            if (!isUndefined(enemyMaxChanceLanes)) {
                // take Enemys' win cell - win!
                return this._grid.getAvaiableCells(enemyMaxChanceLanes[0])[0].pos;
            } else if (!isUndefined(playerMaxChanceLanes)) {
                // Take Players win cell to prevent player from win
                return this._grid.getAvaiableCells(playerMaxChanceLanes[0])[0].pos;
            }
        }
    }

    /**
     * Returns position which is intersection of winnable lanes for enemy and player with maximum winChance if possible
     * @returns {Object} position
     */
    getIntersectionPosition() {

        let playerWinnableLanes = this._grid.getWinnableLanes('player');
        let enemyWinnableLanes = this._grid.getWinnableLanes('enemy');

        let playerMaxChanceLanes = playerWinnableLanes ? this.getMaxChanceLanes(playerWinnableLanes) : void 0;
        let enemyMaxChanceLanes = enemyWinnableLanes ? this.getMaxChanceLanes(enemyWinnableLanes) : void 0;

        let intersections = Grid.getLanesIntersections(playerMaxChanceLanes, enemyMaxChanceLanes) ||
            Grid.getLanesIntersections(playerMaxChanceLanes, enemyWinnableLanes) ||
            Grid.getLanesIntersections(playerWinnableLanes, enemyWinnableLanes);

        if (intersections && intersections.length) return intersections[randomInt(0, intersections.length)].pos;
    }

    /**
     * Returns position of avaiable winning cell, enemy's preferable
     * @returns {Object} position
     */
    getWinnablePosition() {

        let winnableLanes = this._grid.getWinnableLanes('enemy') || this._grid.getWinnableLanes();
        let avaiableCells = this._grid.getAvaiableCells(winnableLanes);

        let maxChanceCells = allMaxBy(avaiableCells, 'winChance');

        if (maxChanceCells.length) {
            return maxChanceCells[randomInt(0, maxChanceCells.length)].pos;
        } else {
            return avaiableCells[randomInt(0, avaiableCells.length)].pos;
        }

    }

    /**
     *  Sets winChance for each cell in the winnable lanes
     */
    setCellChances() {

        // Clear previous winChances
        this._grid.cells.forEach((lane)=> {
            lane.forEach((cell)=> {
                cell.winChance = null;
            });
        });

        this._grid.getWinnableLanes().forEach((lane)=> {
            let winChance = Grid.getLaneWinChance(lane);
            lane.forEach((cell)=> {
                if (Grid.isEmpty(cell)) cell.winChance = cell.winChance > winChance ? cell.winChance : winChance;
            });
        });

    }

    /**
     *  Returns maximal winChance value
     *  @returns {Number}
     */
    getMaxChance() {

        let maxChanceCells = this.maxChanceCells || this.getMaxChanceCells();
        return maxBy(maxChanceCells, 'winChance')['winChance'];

    }

    /**
     * Returns array with cells that have max winChance
     * @returns {Array}
     */
    getMaxChanceCells() {

        let flattenGrid = flatten(this._grid.cells);
        return allMaxBy(flattenGrid, 'winChance');

    }

    /**
     * Returns array with lanes which have maximal winChance
     * @param lanes {Array} (optional) array from which to find max winChance lanes
     * @returns {Array}
     */
    getMaxChanceLanes(lanes) {

        let maxChance = this.getMaxChance();
        let maxChanceLanes = [];

        lanes = isArray(lanes) ? lanes : this._grid.getWinnableLanes(lanes);
        let chances = [];

        lanes.forEach((lane)=> {
            chances.push(Grid.getLaneWinChance(lane));
        });

        if (chances.indexOf(maxChance) !== -1) {
            chances.forEach((chance, i) => {
                if (chance === maxChance) maxChanceLanes.push(lanes[i]);
            });
        } else {
            return void 0;
        }

        return maxChanceLanes;
    }

}
