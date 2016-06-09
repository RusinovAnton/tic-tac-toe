let fieldCellComponent = {
    templateUrl: 'templates/fieldCell.template.html',
    bindings: {
        x: '<',
        y: '<',
        body: '<',
        onMove: '&'
    }
};

export default fieldCellComponent;
