'use strict';

import Grid from '../services/grid.service';

import isUndefined from '../utils/isUndefined';
import allMaxBy from '../utils/allMaxBy.util';

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
        this.userMoves = [];
    }

    set grid(grid) {
        this._grid = grid;
    }

    move() {

        let movePos = this.possibleWinMove();

        return new Promise((resolve, reject)=> {

            if (!movePos) {
                reject(new Error('Pha!'));
            }
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

    /**
     *
     * @returns {pos || false} position object ({x: , y: }) or false if there is no possible moves
     */
    possibleWinMove() {

        // Take central cell if possible
        let centerCell = this._grid.getCenter();
        if (Grid.isEmpty(centerCell)) return centerCell.pos;

        this.setCellChances();

        return this.getMaxChancePosition() || this.getIntersectionPosition() || this.getWinnablePosition();

    }

    getMaxChancePosition() {
        this.maxChanceCells = this.getMaxChanceCells();

        if (!this.maxChanceCells || !this.maxChanceCells.length) return false;

        else if (this.maxChanceCells.length === 1) return this.maxChanceCells[0].pos;

        else if (this.getMaxChance() === 1) {

            let enemyMaxChanceLanes = this.getMaxChanceLanes('enemy');
            let playerMaxChanceLanes = this.getMaxChanceLanes('player');

            if (!isUndefined(enemyMaxChanceLanes)) {
                return this._grid.getAvaiableCells(enemyMaxChanceLanes[0])[0].pos;
            } else if (!isUndefined(playerMaxChanceLanes)) {
                return this._grid.getAvaiableCells(playerMaxChanceLanes[0])[0].pos;
            }
        }
    }

    getWinnablePosition() {
        let winnableLanes = this._grid.getWinnableLanes('enemy') || this._grid.getWinnableLanes();
        let maxChanceCells = allMaxBy(this._grid.getAvaiableCells(flatten(winnableLanes), 'winChance'));

        if (maxChanceCells.length === 1) return maxChanceCells[0].pos;
    }

    getIntersectionPosition() {
        let playerWinnableLanes = this._grid.getWinnableLanes('player');
        let enemyWinnableLanes = this._grid.getWinnableLanes('enemy');

        let playerMaxChanceLanes = this.getMaxChanceLanes(playerWinnableLanes);
        let enemyMaxChanceLanes = this.getMaxChanceLanes(enemyWinnableLanes);

        let intersections;

        if (playerMaxChanceLanes && enemyMaxChanceLanes) {
            intersections = Grid.getLanesIntersections(playerMaxChanceLanes, enemyMaxChanceLanes)
        } else if (playerMaxChanceLanes && enemyWinnableLanes) {
            intersections = Grid.getLanesIntersections(playerMaxChanceLanes, enemyWinnableLanes)
        } else if ( playerWinnableLanes && enemyWinnableLanes) {
            intersections = Grid.getLanesIntersections(playerWinnableLanes, enemyWinnableLanes)
        } else {
            throw new Error('Panic!');
        }

        console.log(intersections);

    }

    setCellChances() {

        // Clear winChances
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

    getMaxChance() {

        let maxChanceCells = this.maxChanceCells || this.getMaxChanceCells();
        return maxBy(maxChanceCells, 'winChance')['winChance'];

    }

    getMaxChanceCells() {

        let flattenGrid = flatten(this._grid.cells);
        return allMaxBy(flattenGrid, 'winChance');

    }

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
