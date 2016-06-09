import {isNumber} from 'angular';

export default class gameNewController {
    constructor($scope, $routeParams) {
        this.size = parseInt($routeParams.size) || 3;
    }
}
