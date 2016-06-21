import isUndefined from './isUndefined';

import {
    isArray,
    maxBy
} from 'lodash';

export default function allMaxBy(array, key) {

    if (!isArray(array)) throw new Error('First argument must be an array');

    const maxByElement = maxBy(array,key);
    if (isUndefined(maxByElement)) return false;
    const maxByValue = maxByElement[key];

    let allMaxByArray = [];

    array.forEach((el)=>{
        if (el[key] === maxByValue) allMaxByArray.push(el);
    });

    return allMaxByArray;

}
