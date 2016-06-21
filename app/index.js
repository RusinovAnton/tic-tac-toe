import angular                  from 'angular';
import ngRoute                  from 'angular-route';

import start from './modules/start.module';
import field from './modules/field.module';
import info from './modules/info.module';
import cell from './modules/cell.module';

angular
    .module('ticTacToe', [
        'ngRoute',
        'start',
        'field'
    ])
    .config(['$locationProvider', '$routeProvider',
        ($locationProvider, $routeProvider) => {
            $locationProvider.hashPrefix('!');
            $routeProvider
                .when('/new', {
                    template: '<game-new></game-new>'
                })
                .when('/play', {
                    template: '<game-field></game-field>'
                })
                .otherwise('/new');
        }
    ]);
