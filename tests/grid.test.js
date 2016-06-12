import {assert} from 'chai';
import Grid from '../app/Grid';
import {isEqual} from 'lodash';

const equal = assert.equal;

describe('Grid', ()=>{
    describe('avaiableCells', ()=>{
        it('should return array with coordinates of empty cells', ()=>{

            let grid = new Grid(4);

            grid.cells[0][0] = 'not empty';
            grid.cells[0][1] = 'not empty';
            grid.cells[0][2] = 'not empty';
            grid.cells[0][3] = 'not empty';
            grid.cells[1][0] = 'not empty';
            grid.cells[1][1] = 'not empty';
            grid.cells[1][2] = 'not empty';
            grid.cells[1][3] = 'not empty';
            grid.cells[3][0] = 'not empty';
            grid.cells[3][1] = 'not empty';
            grid.cells[3][2] = 'not empty';
            grid.cells[3][3] = 'not empty';

            grid.getAvaiableCells().then((avaiableCells)=>{
                equal(isEqual(avaiableCells, [{x:0, y:2},{x:1, y:2},{x:2, y:2},{x:3, y:2}]), true);
            });

        });
    })
});
