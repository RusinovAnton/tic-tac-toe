import angular                  from 'angular';
import fieldCellComponent       from '../components/fieldCell/fieldCell.component';

angular
    .module('cell', [])
    .component('fieldCell', fieldCellComponent);

export default angular.module('cell')
