'use strict';

import Grid from '../services/grid.service';

import {
    some,
    max,
    intersectionWith,
    isEqual
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

    predictUserMove() {
        let vector;
        let _self = this;

        let prevMove = this.userMoves[0];
        let lastMove = this.userMoves[1];

        function isVector(vector) {
            // Check if vector is valid. It can be -1, 0, 1
            return (vector.x >= -1 && vector.x <= 1) && (vector.y >= -1 && vector.y <= 1) &&
                // Check if cell choosen by vector is in the scope of _grid
                (lastMove.x + vector.x >= 0 && lastMove.x + vector.x < _self._grid.size) && (lastMove.y + vector.y >= 0 && lastMove.y + vector.y < _self._grid.size) &&
                // Check if cell is empty
                (Grid.isEmpty(
                        _self._grid.getCell(
                            {
                                x: lastMove.x + vector.x,
                                y: lastMove.y + vector.y
                            }
                        )
                    )
                );
        }

        if (this.userMoves.length >= 2) {
            vector = {
                x: lastMove.x - prevMove.x,
                y: lastMove.y - prevMove.y
            };
            if (isVector(vector)) {
                return {x: lastMove.x + vector.x, y: lastMove.y + vector.y}
            }
        }

        return false;
    }

    possibleWinMove() {

        function getIntersections(userLanes, enemyLanes) {

            let possibleWinLanes = [];

            userLanes.forEach((lane)=> {
                enemyLanes.forEach((enemyLane)=> {
                    let intersections = intersectionWith(lane, enemyLane, isEqual);
                    if (intersections.length) {
                        intersections.forEach((cell)=>{
                           cell.intersection = true;
                        });
                        possibleWinLanes.push(lane, enemyLane);
                    }
                });
            });

            return possibleWinLanes ;
        }

        function getMaxRateLanes(lanes) {

            let chancesArray = [];

            lanes.forEach((lane)=> {
                chancesArray.push(Grid.getLaneWinChance(lane));
            });

            let maximal = max(chancesArray);

            let winLanes = [];

            chancesArray.forEach((el, i)=> {
                if (el == maximal) winLanes.push(lanes[i]);
            });

            return {
                lanes: winLanes,
                rate: maximal
            };

        }

        // Take central cell if possible
        let centerCell = this._grid.getCenter();
        if (Grid.isEmpty(centerCell)) return centerCell.pos;

        this._grid.forEachLane((lane)=>{
            let winChance = Grid.getLaneWinChance(lane);
            lane.forEach((cell)=>{

                if(Grid.isEmpty(cell)) cell.winChance = cell.winChance > winChance ? cell.winChance : winChance;

            })
        });

        return false;

    }

}
