let gameInfoComponent = {
    templateUrl: 'templates/gameInfo.template.html',
    bindings: {
        gameEnded: '<',
        gameStatus: '<',
        playerMove: '<',
        playerSign: '<',
        enemySign: '<'
    }
};

export default gameInfoComponent;
