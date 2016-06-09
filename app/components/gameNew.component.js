import gameNewController from '../controllers/gameNew.controller';

let gameNewComponent = {
    templateUrl: 'templates/gameNew.template.html',
    controller: ['$scope', gameNewController]
};

export default gameNewComponent;
