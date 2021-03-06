class Sign {
    constructor(who, body, pos){
        this.who = who;
        this.body = body;
        this.pos = pos;
        this.winChance = null;
    }
}

class PlayerSign extends Sign {
    constructor(pos){
        super('player', 0, pos);
    }
}

class EnemySign extends Sign {
    constructor(pos) {
        super('enemy', 1, pos)
    }
}

class EmptySign extends Sign {
    constructor(pos) {
        super('nobody', 'empty', pos)
    }
}

export { Sign, PlayerSign, EnemySign, EmptySign }
