import angular                  from 'angular';
import ngRoute                  from 'angular-route';

import gameController           from './controllers/game.controller';

import gameNewComponent         from './components/gameNew.component';
import gameFieldComponent       from './components/gameField.component';
import fieldCellComponent       from './components/fieldCell.component';


angular
    .module('ticTacToe', [
        'ngRoute',
        'start',
        'field'
    ])
    .controller('gameController', gameController);

angular
    .module('ticTacToe')
    .config(['$locationProvider' ,'$routeProvider',
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

angular
    .module('start', [])
    .component('gameNew', gameNewComponent);

angular
    .module('field', ['cell'])
    .component('gameField', gameFieldComponent);

angular
    .module('cell', [])
    .component('fieldCell', fieldCellComponent);
