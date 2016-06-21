import angular from 'angular';
import gameFieldComponent from '../components/gameField/gameField.component';

angular
    .module('field', ['info', 'cell'])
    .component('gameField', gameFieldComponent);

export default angular.module('field')
