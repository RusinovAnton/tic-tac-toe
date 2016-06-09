export default class GameStorage {
    constructor() {
        this.storage = window.localStorage || false;
    }

    set state(state) {
        this.storage.setItem('state', JSON.stringify(state));
    }

    get state() {
        return JSON.parse(this.storage.getItem('state'));
    }

    clearState() {
        this.storage.clear();
    }
}
