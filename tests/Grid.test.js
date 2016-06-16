'use strict';

import {assert, expect} from 'chai';
import {isArray} from 'lodash';

import Grid from '../app/services/grid.service';

describe('Grid()', ()=>{

    it('should throw Error on invalid input', ()=>{
        var mockGrid =  new Grid();
        expect(()=>{
            mockGrid
                .init(null, null)
                .then((success)=>{
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
        expect(()=>{
            mockGrid
                .init('3', null)
                .then((success)=>{
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
        expect(()=>{
            mockGrid
                .init(undefined, null)
                .then((success)=>{
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
        expect(()=>{
            mockGrid
                .init(new Grid(), null)
                .then((success)=>{
                    if (!success) {
                        throw new Error(' no success sorry ');
                    }
                })
        }).to.throw(Error);
    });

    describe('empty()', ()=>{
        it('should create grid with empty cells', ()=>{
            let cells;
            let mockGrid = new Grid()
                .init(3, null)
                .then((success)=>{
                    if (success) {
                        assert.equal(isArray(mockGrid), true);
                        assert.equal(mockGrid.cells.length, 3);
                        assert.equal(mockGrid.cells[0].length, 3);
                        assert.equal(mockGrid.cells[0][0], null);
                        assert.equal(mockGrid.cells[1][0], null);
                        assert.equal(mockGrid.cells[2][2], null);
                    }
                });
            // done();
        });
    });
    describe('fromState()', ()=>{
        it('should return grid from state', ()=>{

            let mockStateGrid = new Grid()
                .init(3, null)
                .then((success)=>{

                    let mockState = {
                        size: 3,
                        grid: void 0
                    };

                    if (success) {
                        mockStateGrid.grid.cells[0][2] = 'item';
                        mockStateGrid.grid.cells[1][1] = 'item';
                        mockStateGrid.grid.cells[2][0] = 'item';
                        mockState.grid = mockStateGrid;
                    }

                    return mockState;

                })
                .then((mockState)=>{
                    let mockGrid = new Grid()
                        .init(3, mockState)
                        .then((success)=>{
                            if (success) {
                                assert.equal(mockGrid.cells[0][2], 'item');
                                assert.equal(mockGrid.cells[1][1], 'item');
                                assert.equal(mockGrid.cells[2][0], 'item');
                            }
                        });
                });
        })
    });
    describe('isEmpty(cell)', ()=>{
        it('should return true if cell is empty', ()=>{
            let mockGrid = new Grid()
                .init(3)
                .then((success)=>{
                    if (success) {
                        
                    }
                });
        });
    });

});
