import gameFieldController from '../controllers/gameField.controller';

let gameFieldComponent = {
    templateUrl: 'templates/gameField.template.html',
    controller: ['$scope', gameFieldController]
};

export default gameFieldComponent;
