import { Tile, ETile } from "./Tile";
import { Cell } from "./pathfind/Cell";
import { Pathfinder } from "./pathfind/Pathfinder";
import { Preview } from "./Preview";
import { ICheckNInARowMemory, CheckNInARowMemoryResponse, ICheckNInARowEvaluate } from "./Memory";
import { minBallsInARow } from "./decorators";

/**
 * Interface describing the {@link GameBoard} class
 */
export interface IGameBoard {
    /**
     * HTMLElement which is used as a root for the {@link GameBoard}
     */
    DOMRoot: HTMLElement
    /**
     * Width (in game cells) of the board
     */
    width: number
    /**
     * Height (in game cells) of the board
     */
    height: number
    /**
     * {@link Tile | Tiles} storing the game information / state
     */
    tiles: Tile[]
    /**
     * Currently selected {@link Tile} to move
     */
    selectedTile: Tile | null
    /**
     * Instance of {@link Pathfinder} class
     */
    pathfinder: Pathfinder
    /**
     * Instance of {@link Preview} class
     */
    preview: Preview
    /**
     * Whether the interaction with the board is blocked or not
     */
    locked: boolean
    /**
     * How long until the {@link locked | lock} is released
     */
    lockDuration: number
    /**
     * Minimum number of balls in a row required to be destroyed
     */
    minBallsInARow: number
    /**
     * Current game score
     */
    score: number
    /**
     * Current combo multiplier
     */
    comboMultiplier: number
    /**
     * Current count of destroyed balls
     */
    destroyedBalls: number
    /**
     * Timestamp at which the game started
     */
    gameStartedAt: number | null
    /**
     * Timestamp at which the game ended
     */
    gameEndedAt: number | null

    /**
     * Converts {@link Cell | Cells} array to {@link Tile | Tile} array
     * 
     * @param { Cell[] } cell Array of {@link Cell | Cells} to convert to {@link Tile | Tile} array 
     */
    cellsToTiles(cell: Cell[]): Tile[]
    /**
     * Returns random non-empty {@link ETile | color}
     */
    getRandomColor(): ETile
    /**
     * Attaches {@link Tile.element | Tiles' elements} to the {@link DOMRoot} 
     */
    attachElements(): void
    /**
     * Attaches listeners to the Window object
     */
    attachEvents(): void
    /**
     * Generates {@link Tile} array based on {@link width} and {@link height}
     */
    generateBoard(): Tile[]
    /**
     * Returns the {@link Tile} to which given element is attached
     * 
     * @param element Elements which owner should be returned 
     */
    getTileFromElement(element: HTMLElement): Tile | null;
    /**
     * Advance board
     */
    takeTurn(): void
    /**
     * Handles board click events
     * 
     * @param event MouseEvent captured by Window
     */
    handleBoardClick(event: MouseEvent): void
    /**
     * Handles board mouseover events
     *
     * @param event MouseEvent captured by Window
     */
    handleBoardMouseover(event: MouseEvent): void
    /**
     * Whether given {@link Tile} is surrounded from every side
     * 
     * @param tile Tile to check
     */
    isSurrounded(tile: Tile): boolean
    /**
     * Clears the {@link Tile.highlighted | highlight} from every {@link Tile} in {@link tiles}
     */
    clearHighlight(): void
    /**
     * Applies {@link Tile.highlighted | highlight} for every {@link Tile} in given array, with given color
     * 
     * @param tiles Tiles to which highlight will be applied
     * @param color Color of the highlight
     */
    applyHighlight(tiles: Tile[], color: ETile): void
    /**
     * Check whether the {@link tiles} contain at least {@link minBallsInARow} in any direction
     * If there are none, returns null
     * 
     * @param n Minimum number of balls in a row
     */
    checkNInRow(n: number): CheckNInARowMemoryResponse[] | null
    /**
     * Destroys the balls, calculates and increases {@link score}
     * 
     * @param data Results of {@link checkNInRow}
     * @param n {@link minBallsInARow}
     * @param combo {@link comboMultiplier}
     */
    destroyBallsIncreaseScore(data: CheckNInARowMemoryResponse[], n: number, combo: number): void
    /**
     * Increases {@link comboMultiplier}
     */
    increaseCombo(): void
    /**
     * Resets {@link comboMultiplier}
     */
    resetCombo(): void
    /**
     * Handles game over
     */
    onGameOver(): void
}

@minBallsInARow(5)
/**
 * Class containing and managing game logic
 */
export class GameBoard implements IGameBoard {
    readonly DOMRoot: HTMLElement;
    readonly width: number;
    readonly height: number;
    readonly tiles: Tile[];
    selectedTile: Tile | null;
    readonly pathfinder: Pathfinder;
    readonly preview: Preview;
    locked: boolean
    readonly lockDuration: number;
    readonly minBallsInARow: number;
    score: number;
    comboMultiplier: number;
    destroyedBalls: number;
    gameStartedAt: number | null;
    gameEndedAt: number | null;

    constructor(DOMRoot: HTMLElement, width: number, height: number) {
        this.DOMRoot = DOMRoot;
        this.width = width;
        this.height = height;
        this.selectedTile = null;
        this.pathfinder = new Pathfinder(width, height);
        this.locked = false;
        this.lockDuration = 800;
        this.minBallsInARow = 5;
        this.score = 0;
        this.comboMultiplier = 1;
        this.destroyedBalls = 0;
        this.gameStartedAt = null;
        this.gameEndedAt = null;

        document.documentElement.style.setProperty("--width", `${width}`);
        document.documentElement.style.setProperty("--height", `${height}`);

        this.tiles = this.generateBoard();

        // this.tiles[36 + 1].changeType(ETile.RED);
        // this.tiles[36 + 2].changeType(ETile.ORANGE);
        // this.tiles[36 + 3].changeType(ETile.YELLOW);
        // this.tiles[36 + 4].changeType(ETile.GREEN);
        // this.tiles[36 + 5].changeType(ETile.BLUE);
        // this.tiles[36 + 6].changeType(ETile.PURPLE);
        // this.tiles[36 + 7].changeType(ETile.WHITE);

        this.attachElements();
        this.attachEvents();

        this.preview = new Preview(this.DOMRoot.parentElement!);
        this.preview.updateScore(this.score);
        this.preview.updateCombo(this.comboMultiplier);

        this.takeTurn();
    }

    /**
     * {@link takeTurn} decorator which randomly inverts colors of the playfield
     * 
     * @param enable Enable or disable
     */
    private static sfx(enable: boolean): MethodDecorator {
        if (enable === false) {
            return () => { };
        }

        return function <T>(target: Object, name: string | symbol, descriptor: TypedPropertyDescriptor<T>): void {
            let orig = descriptor.value as unknown as Function;

            document.documentElement.classList.add("invertable");

            //@ts-ignore
            descriptor.value = function (...args: any[]) {
                let rand = Math.random();
                let result;

                if (rand <= 0.5) {
                    result = rand ** 2;
                } else {
                    // result = -((rand - 1) ** 2) + 1;
                    result = 0.8;
                }

                document.documentElement.style.setProperty("--invert-value", result.toString());
                return orig.apply(this, args);
            }
        }
    }

    cellsToTiles(cells: Cell[]): Tile[] {
        let out: Tile[] = [];

        cells.forEach(cell => {
            out.push(this.tiles[cell.y * this.width + cell.x]);
        });

        return out;
    }

    isSurrounded(tile: Tile): boolean {
        let surrounding = this.tiles.filter(t => Math.abs(tile.x - t.x) + Math.abs(tile.y - t.y) === 1);

        return surrounding.every(t => t.type !== ETile.EMPTY);
    }

    getRandomColor(): ETile {
        return Object.keys(ETile).filter(type => type !== ETile.EMPTY).random() as ETile;
    }

    getTileFromElement(element: HTMLElement): Tile | null {
        let output = null;

        this.tiles.forEach(tile => {
            if (element === tile.element) {
                output = tile;
            }
        });

        return output;
    }

    generateBoard(): Tile[] {
        return Array(this.width * this.height).fill(0).map((_, i) => new Tile(i % this.width, Math.floor(i / this.width)));
    }

    attachElements(): void {
        this.tiles.forEach(tile => {
            this.DOMRoot.append(tile.element);
        });
    }

    attachEvents(): void {
        this.DOMRoot.addEventListener("click", this.handleBoardClick.bind(this));
        this.DOMRoot.addEventListener("mouseover", this.handleBoardMouseover.bind(this));
        this.DOMRoot.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; })
    }

    handleBoardMouseover(event: MouseEvent): void {
        if (
            this.locked === true ||
            event.target === event.currentTarget ||
            this.selectedTile === null
        ) {
            return;
        }


        let endTile = this.getTileFromElement(event.target as HTMLElement);

        if (endTile !== null) {
            this.clearHighlight();

            let result = this.pathfinder.beginPathfind(this.tiles, this.selectedTile.x, this.selectedTile.y, endTile.x, endTile.y);

            if (result !== null) {
                let parsedResult = this.cellsToTiles(result);

                this.applyHighlight(parsedResult, this.selectedTile.type);
            }
        }

    }

    handleBoardClick(event: MouseEvent): void {
        if (
            this.locked === true ||
            event.target === event.currentTarget
        ) {
            return;
        }

        let targetTile = this.getTileFromElement(event.target as HTMLElement);

        if (targetTile !== null) {
            if (targetTile.type === ETile.EMPTY) { // kliknięcie pustego pola
                if (this.selectedTile !== null) { // pathfind
                    let result = this.pathfinder.beginPathfind(this.tiles, this.selectedTile.x, this.selectedTile.y, targetTile.x, targetTile.y);

                    if (result !== null) { // przesunięcie kulki
                        let type = this.selectedTile.type;

                        this.selectedTile.setSelected(false);
                        this.selectedTile.changeType(ETile.EMPTY);
                        targetTile.changeType(type);
                        this.selectedTile = null;

                        this.locked = true;

                        setTimeout(() => {
                            this.locked = false;
                            this.clearHighlight();

                            //! check for balls to destroy, if there are none take the turn

                            let result = this.checkNInRow(this.minBallsInARow);
                            if (result !== null) {
                                this.destroyBallsIncreaseScore(result, this.minBallsInARow, this.comboMultiplier);
                                this.increaseCombo();
                            } else {
                                this.takeTurn();
                                this.resetCombo();
                            }
                        }, this.lockDuration);
                    }
                }
            } else { // kliknięcie kulki
                if (this.isSurrounded(targetTile) === false) { // jeśli jest miejsce na około
                    if (this.selectedTile === null) { // nie ma zaznaczonej kulki
                        targetTile.setSelected(true);
                        this.selectedTile = targetTile;
                    } else { // jest zaznaczona kulka
                        if (this.selectedTile === targetTile) { // ta sama kulka
                            this.selectedTile.setSelected(false);
                            this.selectedTile = null;
                        } else { // różne kulki
                            this.selectedTile.setSelected(false);
                            targetTile.setSelected(true);
                            this.selectedTile = targetTile;
                        }
                    }
                }
            }
        }
    }

    @GameBoard.sfx(false)
    takeTurn() {
        let candidates = this.tiles.filter(tile => tile.type === ETile.EMPTY);

        if (candidates.length <= 3) {
            this.onGameOver();
        } else {
            let randomTiles = candidates.randomN(3);

            randomTiles.forEach((tile, i) => {
                tile.changeType(this.preview.preview[i].type);
            });

            this.preview.randomize();

            if (this.gameStartedAt === null) {
                this.gameStartedAt = Date.now();
            }
        }
    }

    clearHighlight(): void {
        this.tiles.forEach(tile => tile.setHighlight(false));
    }

    applyHighlight(tiles: Tile[], color: ETile): void {
        tiles.forEach(tile => tile.setHighlight(true, color));
    }

    checkNInRow(n: number): CheckNInARowMemoryResponse[] | null {
        let memory: ICheckNInARowMemory = {
            n: n,
            toReturn: [],
            curType: ETile.EMPTY,
            curTiles: [],
            reset: function () {
                this.curType = ETile.EMPTY;
                this.curTiles = [];
            },
            hardReset: function () {
                this.toReturn = [];
                this.reset();
            },
            result: function () {
                return {
                    status: this.toReturn.length !== 0,
                    tiles: this.toReturn
                };
            },
            carry: function () {
                if (this.curTiles.length >= this.n) {
                    this.toReturn.push(...this.curTiles);
                }
            }
        }

        let next = () => {
            results.push(memory.result());
            memory.hardReset();
        }

        let results: CheckNInARowMemoryResponse[] = [];

        //! HORIZONTAL
        for (let y = 0; y < this.height; y++) {
            memory.reset();

            for (let x = 0; x < this.height; x++) {
                let tile = this.getTile(x, y);
                this.CheckNInRowEvaluate(tile, n, memory);
            }

            memory.carry();
        }
        next();

        //! VERTICAL
        for (let x = 0; x < this.height; x++) {
            memory.reset();

            for (let y = 0; y < this.height; y++) {
                let tile = this.getTile(x, y);
                this.CheckNInRowEvaluate(tile, n, memory);
            }

            memory.carry();
        }
        next();

        //! DIAGONAL DOWN
        for (let startY = this.height - n; startY >= 0; startY--) {
            memory.reset();

            for (let x = 0; startY + x < this.height; x++) {
                let y = startY + x;
                let tile = this.getTile(x, y);
                this.CheckNInRowEvaluate(tile, n, memory);
            }

            memory.carry();
        }
        for (let startX = 1; startX <= this.width - n; startX++) {
            memory.reset();

            for (let y = 0; startX + y < this.width; y++) {
                let x = startX + y;
                let tile = this.getTile(x, y);
                this.CheckNInRowEvaluate(tile, n, memory);
            }

            memory.carry();
        }
        next();

        //! DIAGONAL UP
        for (let startY = n - 1; startY < this.height; startY++) {
            memory.reset();

            for (let x = 0; startY - x >= 0; x++) {
                let y = startY - x;
                let tile = this.getTile(x, y);
                this.CheckNInRowEvaluate(tile, n, memory);
            }

            memory.carry();
        }
        for (let startX = 1; startX <= this.width - n; startX++) {
            memory.reset();

            for (let y = this.height - 1; startX + (this.height - 1 - y) < this.width; y--) {
                let x = startX + (this.height - 1 - y);
                let tile = this.getTile(x, y);
                this.CheckNInRowEvaluate(tile, n, memory);
            }

            memory.carry();
        }
        next();

        return results.some(a => a.status === true) ? results : null;
    };

    destroyBallsIncreaseScore(data: CheckNInARowMemoryResponse[], n: number, combo: number): void {
        let score = this.CalculateScore(data, n, combo);

        data.forEach(arr => {
            arr.tiles.forEach(tile => {
                if (tile.type != ETile.EMPTY) {
                    this.DestroyTile(tile);
                    this.destroyedBalls += 1;
                }
            });
        });

        this.score += score;
        this.preview.updateScore(this.score);
    }

    increaseCombo() {
        this.comboMultiplier = parseFloat((this.comboMultiplier * 1.5).toFixed(2));
        this.preview.updateCombo(this.comboMultiplier);
    }

    resetCombo() {
        this.comboMultiplier = 1;
        this.preview.updateCombo(this.comboMultiplier);
    }

    onGameOver() {
        if (this.gameStartedAt !== null && this.gameEndedAt === null) {
            this.locked = true;
            this.gameEndedAt = Date.now();

            let delta = this.gameEndedAt - this.gameStartedAt;
            let gameTimeString = new Date(delta).toUTCString().split(" ")[4];

            let SPB = this.destroyedBalls != 0 ? (this.score / this.destroyedBalls).toFixed(3) : "0";

            let gameoverOverlay = document.createElement("div");
            let gameoverScore = document.createElement("div");
            let gameoverTitle = document.createElement("h2");
            let gameTime = document.createElement("p");
            let text = document.createElement("p");

            gameoverScore.id = "gameover-score";
            gameoverOverlay.id = "gameover-overlay";

            gameoverTitle.innerText = "Game Over";
            gameTime.innerText = `Game time: ${gameTimeString}`;
            text.innerText = `You achieved score of ${this.score} by destroying ${this.destroyedBalls} balls in total (that's ${SPB} SPB)`;

            gameoverScore.append(gameoverTitle, gameTime, text);
            gameoverOverlay.append(gameoverScore);
            document.body.append(gameoverOverlay);
        }
    }

    /**
     * Evaluates single {@link Tile}
     * 
     * @param tile Current tile
     * @param _n {@link minBallsInARow}
     * @param memory Memory object used to store the result of the operations
     */
    private CheckNInRowEvaluate: ICheckNInARowEvaluate = (tile: Tile, _n: number, memory: ICheckNInARowMemory) => {
        if (tile.type === ETile.EMPTY) {
            memory.carry();
            memory.reset();
        } else { // tile.type != ETile.EMPTY
            if (tile.type === memory.curType) {
                memory.curTiles.push(tile);
            } else {
                memory.curType = tile.type;
                memory.carry();
                memory.curTiles = [tile];
            }
        }
    }

    /**
     * Returns {@link Tile} with x and y positions
     * 
     * @param x X position
     * @param y Y position
     * @returns {Tile}
     */
    private getTile(x: number, y: number): Tile {
        return this.tiles[y * this.width + x];
    }

    /**
     * Calculates score earned based on {@link comboMultiplier}, amount of destroyed balls and amount of different directions
     * 
     * @param data Results of {@link checkNInRow}
     * @param n {@link minBallsInARow}
     * @param combo {@link comboMultiplier}
     * @returns {number} Score earned
     */
    private CalculateScore(data: CheckNInARowMemoryResponse[], n: number, combo: number): number {
        let dirCountMultipliers = {
            0: 0,
            1: 1,
            2: 1.5,
            3: 2.5,
            4: 69
        };

        let scoreComponents: number[] = [];
        let dirCount: 0 | 1 | 2 | 3 | 4 = 0;

        data.forEach(dir => {
            if (dir.status === true) {
                dirCount++;

                let length = dir.tiles.length;

                let lengthScoreMultiplier = 1 + Math.floor((length - n) / 2) * 0.5;
                scoreComponents.push(length * lengthScoreMultiplier);
            }
        });

        let dirCountMultiplier = dirCountMultipliers[dirCount];

        let partialScore = scoreComponents.reduce((acc, v) => acc + v, 0);
        let fullScore = Math.floor(partialScore * dirCountMultiplier * combo);

        return fullScore;
    }

    /**
     * Destroy's the {@link Tile}
     * 
     * @param tile Tile to destroy
     */
    private DestroyTile(tile: Tile) {
        tile.changeType(ETile.EMPTY);
    }
}