import fieldCellController from '../controllers/fieldCell.controller';

let fieldCellComponent = {
    templateUrl: 'templates/fieldCell.template.html',
    controller: ['$scope', fieldCellController],
    bindings: {
        x: '<',
        y: '<'
    }
};

export default fieldCellComponent;
