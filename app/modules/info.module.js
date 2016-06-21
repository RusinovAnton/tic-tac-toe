import angular                  from 'angular';
import gameInfoComponent        from '../components/gameInfo/gameInfo.component';

angular
    .module('info', [])
    .component('gameInfo', gameInfoComponent);

export default angular.module('info')
