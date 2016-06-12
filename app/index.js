import angular                  from 'angular';
import ngRoute                  from 'angular-route';

import gameNewComponent         from './components/gameNew.component';
import gameInfoComponent        from './components/gameInfo.component';
import gameFieldComponent       from './components/gameField.component';
import fieldCellComponent       from './components/fieldCell.component';

angular
    .module('ticTacToe', [
        'ngRoute',
        'start',
        'field'
    ]);

angular
    .module('ticTacToe')
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

angular
    .module('start', [])
    .component('gameNew', gameNewComponent);

angular
    .module('field', ['info', 'cell'])
    .component('gameField', gameFieldComponent);

angular
    .module('info', [])
    .component('gameInfo', gameInfoComponent);

angular
    .module('cell', [])
    .component('fieldCell', fieldCellComponent);
