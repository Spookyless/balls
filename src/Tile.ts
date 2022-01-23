/**
 * Valid colors
 */
export enum ETile {
    EMPTY = "EMPTY",
    RED = "RED",
    ORANGE = "ORANGE",
    YELLOW = "YELLOW",
    GREEN = "GREEN",
    BLUE = "BLUE",
    PURPLE = "PURPLE",
    WHITE = "WHITE",
}

/**
 * Interface describing {@link Tile}
 */
export interface ITile {
    /**
     * X position
     */
    x: number
    /**
     * Y position
     */
    y: number
    /**
     * Current color
     */
    type: ETile
    /**
     * HTMLDivElement displaying tile state
     */
    element: HTMLDivElement
    /**
     * Whether the tile is selected
     */
    selected: boolean
    /**
     * Whether the tile is highlighted with {@link highlightColor} color
     */
    highlighted: boolean
    /**
     * Color of the {@link highlighted | highlight}
     */
    highlightColor: ETile;

    /**
     * Creates HTMLDivElement
     */
    createElement(): HTMLDivElement
    /**
     * Updates {@link element}
     */
    updateElement(): void
    /**
     * Changes {@link type} to given one
     * 
     * @param type New color
     */
    changeType(type: ETile): void
    /**
     * Sets wherther the tile is {@link selected}
     */
    setSelected(bool: boolean): void
    /**
     * Sets wherther the tile is {@link highlighted} and it's {@link ETile | color}
     */
    setHighlight(bool: boolean, color: ETile): void
}

export class Tile implements ITile {
    x: number;
    y: number;
    type: ETile;
    element: HTMLDivElement;
    selected: boolean;
    highlighted: boolean;
    highlightColor: ETile;

    constructor(x: number = 0, y: number = 0, type: ETile = ETile.EMPTY) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.selected = false;
        this.highlighted = false;
        this.highlightColor = ETile.EMPTY;

        this.element = this.createElement();
        this.updateElement();
    }

    createElement(): HTMLDivElement {
        let element = document.createElement("div");
        element.className = "tile";

        return element;
    }

    updateElement() {
        if (this.type === ETile.EMPTY) {
            this.element.removeAttribute("data-color");
        } else {
            this.element.setAttribute("data-color", this.type);
        }

        if (this.selected) {
            this.element.classList.add("selected");
        } else {
            this.element.classList.remove("selected");
        }

        if (this.highlighted) {
            this.element.classList.add("highlight");
        } else {
            this.element.classList.remove("highlight");
        }

        if (this.highlightColor === ETile.EMPTY) {
            this.element.removeAttribute("data-highlight");
        } else {
            this.element.setAttribute("data-highlight", this.highlightColor);
        }
    }

    changeType(type: ETile): void {
        this.type = type;

        this.updateElement();
    }

    setSelected(bool: boolean): void {
        this.selected = bool;

        this.updateElement();
    }

    setHighlight(bool: boolean, color: ETile = ETile.EMPTY): void {
        this.highlighted = bool;
        this.highlightColor = color;

        this.updateElement();
    }
}