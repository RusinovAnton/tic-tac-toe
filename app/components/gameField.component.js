import gameFieldController from '../controllers/gameField.controller';

let gameFieldComponent = {
    templateUrl: 'templates/gameField.template.html',
    controller: ['$scope', '$routeParams', gameFieldController]
};

export default gameFieldComponent;
