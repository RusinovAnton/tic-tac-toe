import angular from 'angular';

var gameFieldModule = angular
    .module('gameFieldModule', [])
    .component('gameField', {
        templateUrl: 'templates/gameField.template.html',
        controller($scope) {
            console.log($scope);
        }
    });

export default gameFieldModule;
