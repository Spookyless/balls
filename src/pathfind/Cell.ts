/**
 * Describes valid {@link Cell} types
 */
export enum CellType {
    OPEN = "O",
    DISCOVERED = "D",
    CLOSED = "C",
    WALL = "X",
    START = "S",
    END = "E",
    PATH = "P"
}

/**
 * Unit containing information needed for A* Pathfinding
 */
export class Cell {
    /**
     * X position
     */
    readonly x: number;
    /**
     * Y position
     */
    readonly y: number;
    /**
     * Current cell type
     */
    type: CellType = CellType.OPEN;
    /**
     * Sum of {@link g} and {@link h} costs
     */
    f: number = 0;
    /**
     * Cost from the beggining of the path
     */
    g: number = 0;
    /**
     * Estimatet cost to the end of the path
     */
    h: number = 0;
    /**
     * Surrounding cell with the lowest {@link g} cost
     */
    previousCell: Cell | null = null;

    constructor(x: number, y: number, type: CellType) {
        this.x = x;
        this.y = y;
        this.updateType(type);
    }

    /**
     * Calculates {@link https://en.wikipedia.org/wiki/Taxicab_geometry | Manhattan Distance} between this and other {@link Cell}
     * 
     * @param other Other cell
     */
    distanceTo(other: Cell): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }

    /**
     * Updates the {@link type} to given
     * 
     * @param newType New type
     */
    updateType(newType: CellType): void {
        this.type = newType;
    }

    /**
     * Updates the {@link f}, {@link g} and {@link h} costs
     * 
     * @param fromCell Beginning of the path
     * @param endCell End of the path
     */
    updateCosts(fromCell: Cell, endCell: Cell): void {
        this.g = fromCell.g + this.distanceTo(fromCell);
        this.h = this.distanceTo(endCell);
        this.f = this.g + this.h;
    }
}