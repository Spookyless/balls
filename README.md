# Balls

Logic game written in TypeScript.

## Table of Contents
- [Introduction](#introduction)
- [Installation and setup](#installation-and-setup)
- [Features](#features)
- [Future Development](#future-development)

## Introduction
The project was created as a school assignment.

Rules are simple:
- You can select and move 1 ball each turn
- After every turn 3 new balls will appear on random spots
- Stack 5 or more balls of the same color next to each other to gain points and a bonus turn
- Game ends when there is no room for new balls to appear

## Installation and setup
- Clone or download the repository
- `npm i` to install dependencies
- `npm run build` to build the project

This will create a `\build` directory with all the necessary files; `index.html` is the entry point.

## Features
- Scoring system based on number of different factors (total balls stacked, different directions, orientation etc.)
- Can be played on mobile
- Pathfinding algoritm (balls need to slide on the board, cannot jump over other balls)
- Documentation, which can be generated using `npm run doc`

## Future Development
There are no plans regarding future development of this project.