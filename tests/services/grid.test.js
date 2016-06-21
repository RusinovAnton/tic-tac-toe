'use strict';

import {assert, expect} from 'chai';
import {isArray} from 'lodash';

import Grid from '../../app/services/grid.service';
import {PlayerSign, EnemySign} from '../../app/base/Sign';

let mockGrid = new Grid();

const mockLanes = [
    [
        {"who": "player", "body": 0, "pos": {"x": 0, "y": 0}, "winChance": null},
        {"who": "nobody", "body": "empty", "pos": {"x": 1, "y": 0}, "winChance": 0.25},
        {"who": "enemy", "body": 1, "pos": {"x": 2, "y": 0}, "winChance": null},
        {"who": "nobody", "body": "empty", "pos": {"x": 3, "y": 0}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 4, "y": 0}, "winChance": 0.25}
    ],
    [
        {"who": "nobody", "body": "empty", "pos": {"x": 0, "y": 1}, "winChance": 0.25},
        {"who": "player", "body": 0, "pos": {"x": 1, "y": 1}, "winChance": null},
        {"who": "nobody", "body": "empty", "pos": {"x": 2, "y": 1}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 3, "y": 1}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 4, "y": 1}, "winChance": 0.2}
    ],
    [
        {"who": "nobody", "body": "empty", "pos": {"x": 0, "y": 3}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 1, "y": 3}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 2, "y": 3}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 3, "y": 3}, "winChance": 0.2},
        {"who": "nobody", "body": "empty", "pos": {"x": 4, "y": 3}, "winChance": 0.2}
    ],
    [
        {"who": "nobody", "body": "empty", "pos": {"x": 0, "y": 4}, "winChance": 0.25},
        {"who": "enemy", "body": 1, "pos": {"x": 1, "y": 4}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 2, "y": 4}, "winChance": 0.25},
        {"who": "nobody", "body": "empty", "pos": {"x": 3, "y": 4}, "winChance": 0.2},
        {"who": "nobody", "body": "empty", "pos": {"x": 4, "y": 4}, "winChance": 0.2}
    ]
];

describe('TicTacToeGrid()', ()=> {

    it('should throw Error on invalid input', ()=> {
        expect(()=> {
            mockGrid
                .init(null, null)
                .then((success)=> {
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
        expect(()=> {
            mockGrid
                .init('3', null)
                .then((success)=> {
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
        expect(()=> {
            mockGrid
                .init(undefined, null)
                .then((success)=> {
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
        expect(()=> {
            mockGrid
                .init(new Grid(), null)
                .then((success)=> {
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
    });

    describe('initEmpty()', ()=> {
        it('should create grid with initEmpty cells', function (done) {
            mockGrid
                .init(3, null)
                .then((success)=> {
                    try {
                        assert.equal(isArray(mockGrid.cells), true);
                        assert.equal(mockGrid.cells.length, 3);
                        assert.equal(mockGrid.cells[0].length, 3);
                        assert.equal(mockGrid.cells[0][0].body, 'empty');
                        assert.equal(mockGrid.cells[1][0].body, 'empty');
                        assert.equal(mockGrid.cells[2][2].body, 'empty');
                        done();
                    } catch (err) {
                        done(err);
                    }
                })
                .catch((err)=> {
                    done(err);
                });
        });
    });

    describe('initFromState()', ()=> {
        it('should return grid from state', function (done) {
            this.timeout(10000);

            let mockState = {
                size: 3,
                cells: [
                    [
                        {who: 'nobody', body: 'empty', pos: {}},
                        {who: 'nobody', body: 'empty', pos: {}},
                        {who: 'nobody', body: new PlayerSign(), pos: {}}
                    ],
                    [
                        {who: 'nobody', body: 'empty', pos: {}},
                        {who: 'nobody', body: new PlayerSign(), pos: {}},
                        {who: 'nobody', body: 'empty', pos: {}}
                    ],
                    [
                        {who: 'nobody', body: new PlayerSign(), pos: {}},
                        {who: 'nobody', body: 'empty', pos: {}},
                        {who: 'nobody', body: 'empty', pos: {}}
                    ]
                ]
            };

            mockGrid
                .init(3, mockState)
                .then((success)=> {
                    if (success) {
                        try {
                            assert.equal(Grid.isEmpty(mockGrid.cells[0][2]), false);
                            assert.equal(Grid.isEmpty(mockGrid.cells[1][1]), false);
                            assert.equal(Grid.isEmpty(mockGrid.cells[2][0]), false);
                            assert.equal(Grid.isEmpty(mockGrid.cells[0][0]), true);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    }
                })
                .catch((err)=> {
                    done(err);
                });

        })
    });

    describe('isEmpty(cell)', ()=> {
        it('should return true if cell is initEmpty', function (done) {
            mockGrid
                .init(3)
                .then((success)=> {

                    if (success) {
                        mockGrid.cells[0][1] = new EnemySign();
                        mockGrid.cells[0][2] = new PlayerSign();
                        try {
                            assert.equal(Grid.isEmpty(mockGrid.cells[0][1]), false);
                            assert.equal(Grid.isEmpty(mockGrid.cells[0][2]), false);
                            assert.equal(Grid.isEmpty(mockGrid.cells[1][2]), true);
                            done()
                        } catch (err) {
                            done(err);
                        }
                    }
                })
                .catch((err)=> {
                    done(err);
                });
        });
    });

    describe('isLaneWinnable()', ()=> {
        it('Returns true if lane is winnable', ()=> {
            assert.equal(Grid.isLaneWinnable(mockLanes[0]), false);
            assert.equal(Grid.isLaneWinnable(mockLanes[1]), true);
            assert.equal(Grid.isLaneWinnable(mockLanes[2]), true);
            assert.equal(Grid.isLaneWinnable(mockLanes[3]), true);
        });
    });

    describe('isLaneWinnableBy()', ()=> {
        it('Returns if lane is winnable by player or enemy', ()=> {

            assert.equal(Grid.isLaneWinnableBy('player', mockLanes[0]), false);
            assert.equal(Grid.isLaneWinnableBy('player', mockLanes[1]), true);
            assert.equal(Grid.isLaneWinnableBy('player', mockLanes[2]), true);
            assert.equal(Grid.isLaneWinnableBy('player', mockLanes[3]), false);

            assert.equal(Grid.isLaneWinnableBy('enemy', mockLanes[0]), false);
            assert.equal(Grid.isLaneWinnableBy('enemy', mockLanes[1]), false);
            assert.equal(Grid.isLaneWinnableBy('enemy', mockLanes[2]), true);
            assert.equal(Grid.isLaneWinnableBy('enemy', mockLanes[3]), true);

        });
    });

    describe('isEmpty()', ()=> {
        it('Returns true if given cell is empty', ()=> {
            assert.equal(Grid.isEmpty(mockLanes[0][0]), false);
            assert.equal(Grid.isEmpty(mockLanes[0][1]), true);
            assert.equal(Grid.isEmpty(mockLanes[0][2]), false);
            assert.equal(Grid.isEmpty(mockLanes[0][3]), true);
            assert.equal(Grid.isEmpty(mockLanes[0][4]), true);
        });
    });

    describe('getLaneWinChance()', ()=> {
        it('Returns winChance for given lane', ()=> {
            assert.equal(Grid.getLaneWinChance(mockLanes[1]), 0.25);
            assert.equal(Grid.getLaneWinChance(mockLanes[2]), 0.2);
            assert.equal(Grid.getLaneWinChance(mockLanes[3]), 0.25);
        })
    });

    describe('setCell()', ()=> {
        it('Sets body for needed cells', (done)=> {
            mockGrid
                .init(3, null)
                .then((success)=> {
                    mockGrid.setCell({x: 0, y: 0}, {
                        "who": "player",
                        "body": 0,
                        "pos": {"x": 1, "y": 1},
                        "winChance": null
                    });
                    try {
                        assert.equal(Grid.isEmpty(mockGrid.cells[0][0]), false);
                        assert.equal(Grid.isEmpty(mockGrid.cells[0][1]), true);
                        done();
                    } catch (err) {
                        done(err);
                    }
                })
                .catch((err)=> {
                    done(err);
                });
        });
    });

    describe('getAvaiableCells()', ()=> {
        it('should return array of empty cells', (done)=> {
            mockGrid
                .init(3, null)
                .then((success)=> {
                    mockGrid.setCell({x: 0, y: 0}, {
                        "who": "enemy",
                        "body": 1,
                        "pos": {"x": 1, "y": 4},
                        "winChance": 0.25
                    })
                    mockGrid.setCell({x: 0, y: 1}, {
                        "who": "enemy",
                        "body": 1,
                        "pos": {"x": 1, "y": 4},
                        "winChance": 0.25
                    })
                    mockGrid.setCell({x: 0, y: 2}, {
                        "who": "enemy",
                        "body": 1,
                        "pos": {"x": 1, "y": 4},
                        "winChance": 0.25
                    })
                    try {
                        assert.equal(mockGrid.getAvaiableCells().length, 6);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });
    });

    describe('isDone()', ()=> {
        it('returns false if grid isn\'t done yet', (done)=> {
            mockGrid
                .init(3, null)
                .then((success)=> {
                    try {
                        assert.equal(mockGrid.isDone(), false);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
        });
        it('should return doneState if game is won by player or enemy', (done)=> {
            mockGrid
                .init(3, null)
                .then((success)=> {
                    mockGrid.cells[0][0] = new PlayerSign({x: 0, y: 0});
                    mockGrid.cells[0][1] = new PlayerSign({x: 0, y: 1});
                    mockGrid.cells[0][2] = new PlayerSign({x: 0, y: 2});

                    try {
                        assert.equal(mockGrid.isDone().who, 'player');
                        assert.equal(isArray(mockGrid.isDone().lane), true);
                        assert.equal(mockGrid.isDone().lane.length, 3);
                        done();
                    } catch (err) {
                        done(err);
                    }

                });
        })
    });

    describe('getWinnableLanes()', ()=> {
        it('should return array with all winnable lanes', (done)=> {
            mockGrid
                .init(3, null)
                .then((success)=> {

                    mockGrid.setCell({x: 0, y: 0}, new PlayerSign({x: 0, y: 0}));
                    mockGrid.setCell({x: 1, y: 1}, new PlayerSign({x: 1, y: 1}));
                    mockGrid.setCell({x: 0, y: 2}, new PlayerSign({x: 0, y: 2}));
                    mockGrid.setCell({x: 2, y: 0}, new EnemySign({x: 2, y: 0}));
                    mockGrid.setCell({x: 1, y: 2}, new EnemySign({x: 1, y: 2}));
                    mockGrid.setCell({x: 2, y: 2}, new EnemySign({x: 2, y: 2}));

                    try {
                        assert.equal(mockGrid.getWinnableLanes().length, 3);
                        assert.equal(mockGrid.getWinnableLanes('enemy').length, 1);
                        assert.equal(mockGrid.getWinnableLanes('player').length, 2);
                        done();
                    } catch (err) {
                        done(err);
                    }

                })
                .catch((err)=> {
                    done(err);
                });
        });
    });

    describe('getUnwinnableLanes()', ()=> {
        it('returns array of lanes which is impossible to win', (done)=> {
            mockGrid
                .init(3, null)
                .then((success)=> {

                    mockGrid.setCell({x: 0, y: 0}, new PlayerSign({x: 0, y: 0}));
                    mockGrid.setCell({x: 1, y: 1}, new PlayerSign({x: 1, y: 1}));
                    mockGrid.setCell({x: 0, y: 2}, new EnemySign({x: 1, y: 2}));
                    mockGrid.setCell({x: 2, y: 2}, new EnemySign({x: 2, y: 2}));

                    try {
                        assert.equal(isArray(mockGrid.getUnwinnableLanes()), true);
                        assert.equal(mockGrid.getUnwinnableLanes().length, 3);
                        done();
                    } catch (err) {
                        done(err);
                    }

                })
                .catch((err)=> {
                    done(err);
                });
        });
    });

    describe('isWinnable()', ()=> {
        it('returns true if there are winnable lanes', (done)=> {
            mockGrid
                .init(3, null)
                .then((success)=> {

                    mockGrid.setCell({x: 0, y: 0}, new PlayerSign({x: 0, y: 0}));
                    mockGrid.setCell({x: 1, y: 1}, new PlayerSign({x: 1, y: 1}));
                    mockGrid.setCell({x: 0, y: 2}, new PlayerSign({x: 0, y: 2}));
                    mockGrid.setCell({x: 2, y: 0}, new EnemySign({x: 2, y: 0}));
                    mockGrid.setCell({x: 1, y: 2}, new EnemySign({x: 1, y: 2}));
                    mockGrid.setCell({x: 2, y: 2}, new EnemySign({x: 2, y: 2}));

                    try {
                        assert.equal(mockGrid.isWinnable(), true);

                        mockGrid.setCell({x: 0, y: 1}, new EnemySign({x: 0, y: 1}));
                        mockGrid.setCell({x: 2, y: 1}, new PlayerSign({x: 2, y: 1}));

                        assert.equal(mockGrid.isWinnable(), false);

                        done();
                    } catch (err) {
                        done(err);
                    }

                })
                .catch((err)=> {
                    done(err);
                });
        });
    });

});
