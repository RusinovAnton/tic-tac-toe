import {
    flatten,
    isNumber,
    isEqual,
    isArray,
    intersectionWith
} from 'lodash';

export default class Grid {
    constructor() {
        this.gridInit = false;
    }

    /**
     * Returns true if cell is empty
     * @param pos {Object} cells' position
     * @returns {boolean}
     */
    static isEmpty(pos) {
        return cells[pos.y][pos.x] === void 0;
    }

    /**
     * Returns array of cells that happen in both given lane arrays
     * @param array1
     * @param array2
     * @returns {Array}
     */
    static getLanesIntersections(array1, array2) {

        if (!(isArray(array1) && isArray(array2))) {
            return void 0;
        }

        array1 = flatten(array1);
        array2 = flatten(array2);

        let intersections = intersectionWith(array1, array2, isEqual);

        return intersections.length ? intersections : void 0;
    }


    /**
     * Initialize cells' array with given size or from previous state if given
     * @param size
     * @returns {Promise}
     */
    init(size) {

        if (!isNumber(size) && !prevState) throw new Error('Size must be a number');

        return new Promise((resolve, reject) => {
            try {

                this.size = size;
                this.cells = this.initEmpty(this.size);

                this.gridInit = true;

                // Return success if grid was initialized
                resolve(this.gridInit);

            } catch (err) {
                reject(err);
            }

        });
    }

    /**
     * Inits cells array with empty cells
     * @returns {Array}
     */
    initEmpty() {

        let cells = [];
        var i, j;
        for (i = 0; i < this.size; i++) {
            cells[i] = [];
            for (j = 0; j < this.size; j++) {
                // Empty cell
                cells[i][j] = null;
            }
        }
        return cells;
    }

    /**
     * Returns' cell by position
     * @param pos {Object} position object {x:, y:}
     * @returns {*}
     */
    getCell(pos) {
        return this.cells[pos.y][pos.x];
    }

    /**
     * Sets body for needed cells'
     * @param pos
     * @param body
     * @returns {boolean} true if set
     */
    setCell(pos, body) {

        if (pos.x >= this.size || pos.y >= this.size) throw new Error('Unavaiable position');

        this.cells[pos.y][pos.x] = body;

        return true;

    }

    /**
     *  @param lane {Array} (optional) lane array or array of lane arrays to find empty cells in it
     *  @returns {Array} of initEmpty cells
     */
    getAvaiableCells(lane) {

        let avaiableCells = [];

        if (isArray(lane)) {
            lane = flatten(lane);
            lane.forEach((cell)=> {
                if (Grid.isEmpty(cell)) {
                    avaiableCells.push(cell);
                }
            })
        } else {
            this.cells.forEach((row)=> {
                row.forEach((cell)=> {
                    if (Grid.isEmpty(cell)) avaiableCells.push(cell);
                })
            });
        }

        return avaiableCells;
    }

    /**
     * True if there are cells avaiable
     *
     * @returns {boolean}
     */
    cellsAvaiable() {
        return this.getAvaiableCells().length !== 0;
    }

    /**
     * [x, ., .]
     * [., x, .]
     * [., ., x]
     *
     * @returns {Array} Array with elements from first diagonal
     */
    getFirstDiagonal() {
        let diagonal = [];

        let i = 0;
        for (i; i < this.size; i++) {
            diagonal.push(this.cells[i][i]);
        }
        return diagonal;
    }

    /**
     * [., ., x]
     * [., x, .]
     * [x, ., .]
     *
     * @returns {Array} Array with elements from second diagonal
     */
    getSecondDiagonal() {
        let diagonal = [];
        let i = 0;
        let j = this.size - 1;
        while (i < this.size) {
            diagonal.push(this.cells[i][j]);
            i++;
            j--;
        }
        return diagonal;
    }

    /**
     * Returns needed row from grid by its' index
     * @param index {Number}
     * @returns {Array}
     */
    getRow(index) {
        return this.cells[index];
    }

    /**
     * Returns' needed column from grid by its' index
     * @param index
     * @returns {Array}
     */
    getColumn(index) {

        let col = [];
        // Iterates throw each grids' row and compose column array
        this.forEachRow((row)=> {
            col.push(row[index]);
        });

        return col;
    }

    /**
     * Returns' central cell or false if impossible
     * @returns {Object || undefined}
     */
    getCenter() {

        if (this.size % 2 === 0) return void 0;
        return this.cells[(this.size - 1) / 2][(this.size - 1) / 2];

    }

    /**
     * Iterates over both diagonales and applies given callback
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachDiagonal(cb) {
        for (var i = 0; i < 2; i++) {
            cb([
                this.getFirstDiagonal(),
                this.getSecondDiagonal()
            ][i], i, 'diagonal');
        }
    }

    /**
     * Iterates throw all grids' rows and applies given callback
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachRow(cb) {
        let i = 0;
        for (i; i < this.size; i++) {
            cb(this.getRow(i), i, 'row');
        }
    }

    /**
     * Iterates throw all grids' columns and applies given callback
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachColumn(cb) {
        let i = 0;
        for (i; i < this.size; i++) {
            cb(this.getColumn(i), i, 'column');
        }
    }

    /**
     * Iterates over each lane in grid applying provided callback function
     *
     * @param {Function} cb(lane, index, laneType)
     */
    forEachLane(cb) {
        this.forEachDiagonal(cb);
        this.forEachRow(cb);
        this.forEachColumn(cb);
    }

}
