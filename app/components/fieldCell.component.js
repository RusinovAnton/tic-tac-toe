import fieldCellController from '../controllers/fieldCell.controller';

let fieldCellComponent = {
    templateUrl: 'templates/fieldCell.template.html',
    controller: ['$scope', '$element', fieldCellController],
    bindings: {
        x: '<',
        y: '<',
        body: '<',
        onMove: '&'
    }
};

export default fieldCellComponent;
