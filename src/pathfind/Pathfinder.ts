import { Cell, CellType } from "./Cell";
import { Tile, ETile } from "../Tile";

/**
 * Class containing the logic behind A* Pathfinding
 */
export class Pathfinder {
    /**
     * Width of the grid
     */
    readonly width: number;
    /**
     * Height of the grid
     */
    readonly height: number;
    /**
     * Pathfinding grid
     */
    grid: Cell[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = this.generateGrid();
    }

    /**
     * Converts {@link Tile | Tiles} to valid {@link grid}
     * 
     * @param tiles Array of tiles to convert
     * @param sx Starting X position
     * @param sy Starting Y position
     * @param ex End X position
     * @param ey End Y position
     */
    private generateGridFromTiles(tiles: Tile[], sx: number, sy: number, ex: number, ey: number): Cell[][] {
        let arr = Array(this.height).fill(0).map((_, y) => Array(this.width).fill(0).map((_, x) => new Cell(x, y, tiles[y * this.width + x].type === ETile.EMPTY ? CellType.OPEN : CellType.WALL)));

        if (arr[sy][sx].type != CellType.WALL) {
            arr[sy][sx].updateType(CellType.START);
        }

        if (arr[ey][ex].type != CellType.WALL) {
            arr[ey][ex].updateType(CellType.END);
        }

        return arr;
    }

    /**
     * Generates grid based on {@link width} and {@link height}
     */
    private generateGrid(): Cell[][] {
        return Array(this.height).fill(0).map((_, y) => Array(this.width).fill(0).map((_, x) => new Cell(x, y, CellType.OPEN)));
    }

    /**
     * Calls the given function for every cell in the {@link grid}
     * 
     * @param callback Function to call
     */
    forEachCell(callback: (cell: Cell) => void): void {
        for (const arr of this.grid) {
            for (const cell of arr) {
                callback(cell);
            }
        }
    }

    /**
     * Filters {@link grid} based on given condition
     * 
     * @param predicate Condition
     */
    private filterCells(predicate: (cell: Cell) => boolean): Cell[] {
        return this.grid.reduce((acc, arr) => acc.concat(arr.filter(cell => predicate(cell))), []);
    }

    /**
     * Begins the pathfind and returns the valid path or null
     * 
     * @param tiles Array used to create valid pathfind grid
     * @param sx Starting X position
     * @param sy Starting Y position
     * @param ex End X position
     * @param ey End Y position
     */
    beginPathfind(tiles: Tile[], sx: number, sy: number, ex: number, ey: number): Cell[] | null {
        this.grid = this.generateGridFromTiles(tiles, sx, sy, ex, ey);

        let startCell = this.grid[sy][sx];
        let endCell = this.grid[ey][ex];

        let result = this.pathfind(startCell, endCell);

        if (result !== null) {
            let cellsPath: Cell[] = [];
            let currentCell: Cell = result;

            while (true) {
                let previousCell = currentCell.previousCell;

                if (previousCell === startCell || previousCell === null) {
                    break;
                }

                cellsPath.push(previousCell);
                currentCell = previousCell;
            }

            cellsPath.unshift(endCell);
            cellsPath.push(startCell);

            return cellsPath.reverse();
        } else {
            return null;
        }
    }

    /**
     * Evaluates single pathfind step
     * 
     * @param startCell Start of the path
     * @param endCell End of the path
     */
    private pathfind(startCell: Cell, endCell: Cell): Cell | null {
        let cellsToEvaluate: Cell[] = [];
        let currentCell: Cell = startCell;

        let step = () => {
            let newValidNeighbours = this.getValidNeighbours(currentCell);
            newValidNeighbours.forEach(cell => { if (cell.type === CellType.OPEN) { cell.updateType(CellType.DISCOVERED) }; cell.previousCell = currentCell });
            newValidNeighbours.forEach(cell => cell.updateCosts(cell.previousCell!, endCell));

            if (newValidNeighbours.some(cell => cell === endCell)) {
                return endCell;
            }

            cellsToEvaluate.push(...newValidNeighbours);

            if (currentCell.type !== CellType.START) {
                currentCell.updateType(CellType.CLOSED);
            }
            cellsToEvaluate = cellsToEvaluate.filter(cell => cell !== currentCell);
            currentCell = this.getCellMinScore(cellsToEvaluate);

            return null;
        }

        do {
            let result = step();

            if (result !== null) {
                return result;
            }
        } while (cellsToEvaluate.length > 0);

        return null;

    }

    /**
     * Returns surrounding cells of the given one
     * 
     * @param cell Cell to evaluate
     */
    private getNeighbours(cell: Cell): Cell[] {
        return this.filterCells(other => Math.abs(cell.distanceTo(other)) === 1);
    }

    /**
     * Returns surrounding cells considered valid in pathfinding
     * 
     * @param cell Cell to evaluate
     */
    private getValidNeighbours(cell: Cell): Cell[] {
        return this.getNeighbours(cell).filter(cell => cell.type === CellType.OPEN || cell.type === CellType.END);
    }

    /**
     * Returns cells with the lowest costs
     * 
     * @param cells Cells to evaluate
     */
    private getCellMinScore(cells: Cell[]): Cell {
        return cells.reduce((acc, cell) => {
            if (cell.f < acc.f) {
                return cell;
            } else if (cell.f === acc.f) {
                if (cell.h < acc.h) {
                    return cell;
                } else if (cell.h === acc.h) {
                    if (cell.x < acc.x || cell.x > acc.x) {
                        return cell;
                    } else {
                        return Math.random() < 0.5 ? cell : acc;
                    }
                }
            }

            return acc;
        }, cells[0]);
    }
}