const cell = 32;
const fw = 10;
const fh = 15;

const brickTextures = [
  () => new PIXI.Graphics()
    .rect(0, 0, cell, cell)
    .fill(0x000000)
    .stroke({color: 0xdddddd, width: 1})
];

const baseTextStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fontSize: 16,
    fill: 0xffffff,
});

let h = window.innerHeight - document.getElementsByClassName("navbar")[0].scrollHeight;
let w = window.innerWidth;

let gridX = 0;
let gridY = 0;

const Game = {
    app: null,
    world: null,
    box2d: null,
    gameContainer: null,
    uiContainer: null,
    physicsObjects: [],
    bricks: [],
    running: false,
};