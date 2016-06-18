'use strict';

import {assert, expect} from 'chai';
import {isArray} from 'lodash';

import Grid from '../../app/services/grid.service';
import {PlayerSign, EnemySign} from '../../app/Sign';

let mockGrid = new Grid();

describe('Grid()', ()=> {

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

    describe('.empty()', ()=> {
        it('should create grid with empty cells', function (done) {
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

    describe('fromState()', ()=> {
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
        it('should return true if cell is empty', function(done) {
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
                .catch((err)=>{
                    done(err);
                });
        });
    });

});
