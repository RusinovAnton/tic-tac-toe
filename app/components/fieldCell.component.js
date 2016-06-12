let fieldCellComponent = {
    templateUrl: 'templates/fieldCell.template.html',
    bindings: {
        x: '<',
        y: '<',
        sign: '<',
        highlighted: '<'
        onMove: '&'
    }
};

export default fieldCellComponent;
