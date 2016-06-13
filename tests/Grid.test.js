'use strict';

import {assert, expect} from 'chai';
import {isArray} from 'lodash';

import Grid from '../app/Grid';

describe('Grid()', ()=>{

    it('should throw Error on invalid input', ()=>{

        expect(()=>{ new Grid(null, null).empty() }).to.throw(Error);
        expect(()=>{ new Grid('3', null).empty() }).to.throw(Error);
        expect(()=>{ new Grid(undefined, null).empty() }).to.throw(Error);
        expect(()=>{ new Grid(new Grid(), null).empty() }).to.throw(Error);

    });

    describe('empty()', ()=>{
        it('should create grid with empty cells', ()=>{
            let mockGrid = new Grid(3, null).empty();

            assert.equal(isArray(mockGrid), true);
            assert.equal(mockGrid.length, 3);
            assert.equal(mockGrid[0].length, 3);
            assert.equal(mockGrid[0][0], null);
            assert.equal(mockGrid[1][0], null);
            assert.equal(mockGrid[2][2], null);

        });
    });
    describe('fromState()', ()=>{
        it('should return grid from state', ()=>{

            let mockState = {
                size: 3,
                cells: new Grid(3, null).empty()
            };

            mockState.cells[0][2] = 'item';
            mockState.cells[1][1] = 'item';
            mockState.cells[2][0] = 'item';

            let mockGrid = new Grid(undefined, mockState).fromState();

            assert.equal(mockGrid[0][2], 'item');
            assert.equal(mockGrid[1][1], 'item');
            assert.equal(mockGrid[2][0], 'item');

        })
    });
});
