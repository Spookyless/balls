import { Tile, ETile } from "./Tile";

/**
 * Describes behavious of memory, used to search for balls to destroy
 */
export interface ICheckNInARowMemory {
    /**
     * Minimum balls in a row which count as valid
     */
    n: number
    /**
     * Contains all {@link Tile | tiles} considered valid
     */
    toReturn: Tile[],
    /**
     * Current repeating tile's {@link ETile | type}
     */
    curType: ETile,
    /**
     * Temporary array containing {@link Tile | tiles} considered valid
     */
    curTiles: Tile[]
    /**
     * Performs soft-reset, resetting {@link curTiles} and {@link curType}
     */
    reset(): void
    /**
     * Performs hard-reset, resetting {@link curTiles}, {@link curType} and {@link toReturn}
     */
    hardReset(): void
    /**
     * Returns valid {@link Tile | tiles}
     * @returns {CheckNInARowMemoryResponse}
     */
    result(): CheckNInARowMemoryResponse
    /**
     * Performs carry over
     */
    carry(): void
}

/**
 * Describes the output of {@link ICheckNInARowMemory.result | memory result() method}
 */
export interface CheckNInARowMemoryResponse {
    /**
     * Whether response contains valid tiles or not
     */
    status: boolean,
    /**
     * Array containing valid {@link Tile | tiles}, might be empty
     */
    tiles: Tile[]
}


export interface ICheckNInARowEvaluate {
    /**
     * Function used to manage the {@link ICheckNInARowMemory} object
     */
    (tile: Tile, n: number, memory: ICheckNInARowMemory): void
}