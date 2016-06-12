class Sign {
    constructor(who, body){
        this.who = who;
        this.body = body;
    }
}

class PlayerSign extends Sign {
    constructor(body){
        super('player', 0);
    }
}

class EnemySign extends Sign {
    constructor(body) {
        super('enemy', 1)
    }
}

export { Sign, PlayerSign, EnemySign }
