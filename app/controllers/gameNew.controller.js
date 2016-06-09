import {isNumber} from 'angular';

export default class gameNewController {
    constructor($scope, $routeParams) {
        this.size = parseInt($routeParams.size) || 3;
    }

    isValid() {
        const size = this.size;
        return isNumber(size) && (size < 3 || size > 100)
    }
}
