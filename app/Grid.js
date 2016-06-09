class Grid {
    constructor(size, prevState) {
        this.size = size
        this.cells = []

        if (prevState === void 0) {
            this.empty();
        }
    }

    empty() {
        var i, j;
        for(i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for(j = 0;j < this.size; j++) {
                // Empty cell
                this.cells[i][j] = null;
            }
        }
    }

    fromState() {

    }
}

export default Grid
