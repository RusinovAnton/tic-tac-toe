import {expect} from 'chai';

import allMaxBy from '../../app/utils/allMaxBy.util';

describe('allMaxBy()', ()=>{
   it('should take an array and key as parameters and return an array with all objects with max value from key', ()=>{

       const mockArray = [
           {a: true, b: 0},
           {a: true, b: 0},
           {a: false, b: -2},
           {a: 'test', b: -1},
           {a: null, c: 0},
           {a: true, b: 0}
       ];

       const testArray = allMaxBy(mockArray, 'b');

       expect(()=>{
           testArray.forEach((el)=>{
               if (el.a !== true) throw new Error('!');
           });
       }).to.not.throw(Error);

   });
});
