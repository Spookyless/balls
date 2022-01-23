import "./ArrayPrototype";
import { GameBoard } from "./GameBoard";
import "./style.css";

let root = document.getElementById("root");

if (root === null) {
    throw new Error("Root element does not exist on the document.");
}

let boardWidth = 9;
let boardHeight = 9;
let padding = 20;
// let width, height, smallerDimension, oneTileSize;

let resizeApp = () => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let desiredWidth = boardWidth;
    let desiredHeight = boardHeight + 3;
    let oneTileSize = Math.floor(Math.min((windowWidth - 2 * padding) / desiredWidth, (windowHeight - 2 * padding) / desiredHeight));

    document.documentElement.style.setProperty("--size", `${oneTileSize}px`);
}

window.addEventListener("resize", resizeApp);

resizeApp();

new GameBoard(root, boardWidth, boardHeight);

// console.log("%cTODO:", "font-size: 24px; color: orange;");
// console.log("1. Ekran przegranej zamiast błędu w konsoli");
