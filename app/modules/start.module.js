import angular from 'angular';
import gameNewComponent from '../components/gameNew/gameNew.component';

angular
    .module('start', [])
    .component('gameNew', gameNewComponent);

export default angular.module('start');
