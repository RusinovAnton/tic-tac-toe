'use strict';

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

        let movePos = this.predictUserMove() ||
            this.possibleWinMove() ||
            {x: avaiableCell.x, y: avaiableCell.y};

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
                (_self._grid.isEmpty(
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

            let possibleWinMoves = [];

            userLanes.forEach((lane)=> {
                enemyLanes.forEach((enemyLane)=> {
                    possibleWinMoves = possibleWinMoves.concat(intersectionWith(lane, enemyLane, isEqual));
                });
            });

            return possibleWinMoves;
        }

        let winPos;
        let enemyWin = this.getWinLanes('enemy');
        let userWin = this.getWinLanes('player');

        if (enemyWin.lanes.length && userWin.lanes.length) {

            winPos = getIntersections(userWin.lanes, enemyWin.lanes);
            if (winPos.length) return winPos[0].pos;

            if (userWin.rate > enemyWin.rate) {
                winPos = this._grid.getAvaiableCells(userWin.lanes[0]);
                return winPos[0];
            } else {
                winPos = this._grid.getAvaiableCells(enemyWin.lanes[0]);
                return winPos[0];
            }
        }

        let possibleMoves = [];

        this._grid.getWinnableLanes('enemy').forEach((cell)=> {
            if (this._grid.isEmpty(cell)) possibleMoves.push(cell);
        });

        if (possibleMoves.length) {
            return possibleMoves[0].pos;
        }

        possibleMoves = [];

        this._grid.getWinnableLanes('player').forEach((cell)=> {
            if (this._grid.isEmpty(cell)) possibleMoves.push(cell);
        });

        if (possibleMoves.length) {
            return possibleMoves[0].pos;
        }

        return false;

    }

    getWinLanes(who) {

        let lanes = this._grid.getWinnableLanes(who);

        let chancesArray = [];

        lanes.forEach((lane)=> {

            let emptyCells = lane.filter((lane)=> {
                return lane.body === 'empty';
            });

            chancesArray.push((1 / (emptyCells.length / lane.length)).toFixed(2));

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

}
