'use strict';

import Grid from '../services/grid.service';

import allMaxBy from '../utils/allMaxBy.util';

import {
    some,
    max,
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

        var avaiableCell = this._grid.getAvaiableCells()[0];

        let movePos = this.possibleWinMove() || {x: avaiableCell.pos.x, y: avaiableCell.pos.y};

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
   * @returns {pos, false} position object ({x: , y: }) or false if there is no possible moves
   */
  possibleWinMove() {

        // Take central cell if possible
        let centerCell = this._grid.getCenter();
        if (Grid.isEmpty(centerCell)) return centerCell.pos;

        this.setChances();

        let maxChanceCells = this.getMaxChanceCells();

        if (!maxChanceCells || !maxChanceCells.length) return false;
        else if (maxChanceCells.length === 1) return maxChanceCells[0].pos;

    }

    setChances() {

        let winnableLanes = this._grid.getWinnableLanes();
        let unwinnableLanes = this._grid.getUnwinnableLanes();
        let intersectedLanes = intersection(winnableLanes, unwinnableLanes);

        winnableLanes.forEach((lane)=>{

            let winChance = Grid.getLaneWinChance(lane);

            lane.forEach((cell)=> {

                if (Grid.isEmpty(cell)) cell.winChance = cell.winChance > winChance ? cell.winChance : winChance;

            });

        });

    }

    getMaxChanceCells() {

        let flattenGrid = flatten(this._grid.cells);
        return allMaxBy(flattenGrid, 'winChance');

    }
}
