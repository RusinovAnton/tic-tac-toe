let fieldCellComponent = {
    templateUrl: 'templates/fieldCell.template.html',
    bindings: {
        x: '<',
        y: '<',
        sign: '<',
        onMove: '&'
    }
};

export default fieldCellComponent;
