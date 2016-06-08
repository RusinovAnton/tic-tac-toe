import angular from 'angular';
import router from 'angular-route';
import gameFieldModule from './gameField/gameField';

angular
    .module('ticTacToe', [
        'gameFieldModule',
        'ngRoute'
    ])
    .controller('gameController', function gameController($scope) {
        console.log($scope);
    })
    .config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/play', {
                template: '<game-field></game-field>'
            }).when('/new', {
                template: '<start-game></start-game>'
            }).when('/end', {
                template: '<game-over></game-over>'
            });
        }
    ]);
