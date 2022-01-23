import { Tile, ETile } from "./Tile";

/**
 * Interface describing {@link Preview} class
 */
export interface IPreview {
    /**
     * HTMLElement considered root
     */
    root: HTMLElement
    /**
     * Array of {@link Tile | Tiles} with information about balls that will appear on the board next
     */
    preview: Tile[]
    /**
     * Appended to {@link root}, container for all information
     */
    element: HTMLDivElement | null
    /**
     * Container, displays information about the score
     */
    scoreDisplayElement: HTMLElement
    /**
     * Displays current {@link IGameBoard.score | score}
     */
    scoreElement: HTMLElement
    /**
     * Displays current {@link IGameBoard.comboMultiplier | comboMultiplier}
     */
    comboElement: HTMLElement
    /**
     * Container, displays the information about the next balls
     */
    nextBallsElement: HTMLElement
    /**
     * Randomizes the {@link ETile | colors} of {@link preview | balls} 
     */
    randomize(): void
    /**
     * Creates the DOM structure
     */
    createElements(): void
    /**
     * Updates {@link scoreElement} to display new {@link IGameBoard.score | score}
     * 
     * @param score New score
     */
    updateScore(score: number): void
    /**
     * Updates {@link comboElement} to display new {@link IGameBoard.comboMultiplier | comboMultiplier}
     *
     * @param score New {@link IGameBoard.comboMultiplier | comboMultiplier}
     */
    updateCombo(combo: number): void
}

export class Preview implements IPreview {
    root: HTMLElement;
    preview: Tile[];
    element: HTMLDivElement;
    nextBallsElement: HTMLDivElement;
    scoreDisplayElement: HTMLDivElement
    scoreElement: HTMLElement
    comboElement: HTMLElement

    constructor(root: HTMLElement) {
        this.root = root;
        this.preview = [new Tile(), new Tile(), new Tile()];

        this.element = document.createElement("div");
        this.nextBallsElement = document.createElement("div");
        this.scoreDisplayElement = document.createElement("div");
        this.scoreElement = document.createElement("div");
        this.comboElement = document.createElement("div");

        this.createElements();
        this.randomize();
    }

    createElements(): void {
        this.element.id = "preview";
        this.nextBallsElement.id = "balls";
        this.scoreDisplayElement.id = "score-display";
        this.scoreElement.id = "score";
        this.comboElement.id = "combo";

        let nextBallsSpan = document.createElement("span");
        nextBallsSpan.innerText = "Next balls:";

        this.nextBallsElement.append(nextBallsSpan);
        this.scoreDisplayElement.append(this.scoreElement, this.comboElement);
        this.element.append(this.nextBallsElement, this.scoreDisplayElement);
        this.root.prepend(this.element);

        this.preview.forEach(tile => {
            tile.element.classList.add("preview");
            this.nextBallsElement.append(tile.element);
        });
    }

    randomize(): void {
        this.preview.forEach(tile => {
            tile.changeType(this.getRandomColor());
        });
    }

    getRandomColor(): ETile {
        return Object.keys(ETile).filter(type => type !== ETile.EMPTY).random() as ETile;
    }

    updateScore(score: number): void {
        this.scoreElement.innerText = `Score: ${score}`;
    }

    updateCombo(combo: number): void {
        this.comboElement.innerText = `x${combo}`;

        if (combo > 1) {
            this.comboElement.classList.add("active");
        } else {
            this.comboElement.classList.remove("active");
        }
    }
}