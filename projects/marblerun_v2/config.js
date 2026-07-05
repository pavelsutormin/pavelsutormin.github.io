const cell = 32;
const fw = 10;
const fh = 15;

const brickShapes = [
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.5, 0.5);
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    const vertices = [
      [-0.5, 0.5],
      [-0.5, -0.5],
      [0.5, 0.5]
    ];
    const [vecArr, destroyVecArr] = box2d.tuplesToVec2Array(vertices);
    shape.Set(vecArr, vertices.length);
    destroyVecArr();
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.5, 0.5);
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.5, 0.5);
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.3, 0.3);
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.4, 0.4);
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    const vertices = [
      [0.5, -0.5],
      [0.5, 0.5],
      [0.4375, 0.5],
      [0.4375, -0.5]
    ];
    const [vecArr, destroyVecArr] = box2d.tuplesToVec2Array(vertices);
    shape.Set(vecArr, vertices.length);
    destroyVecArr();
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.5, 0.5);
    return shape;
  },
  (box2d) => {
    const shape = new box2d.b2PolygonShape();
    shape.SetAsBox(0.5, 0.5);
    return shape;
  }
];

const brickTextures = [
  () => new PIXI.Graphics()
    .rect(-cell / 2, -cell / 2, cell, cell)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 }),

  () => new PIXI.Graphics()
    .poly([
      -cell / 2, -cell / 2,
      -cell / 2,  cell / 2,
       cell / 2,  cell / 2
    ])
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 }),

  () => new PIXI.Graphics()
    .moveTo(-cell / 2, -cell / 2)
    .bezierCurveTo(-cell / 2, 0.5, 0.5, cell / 2, cell / 2, cell / 2)
    .lineTo(cell / 2, cell / 2)
    .lineTo(-cell / 2, cell / 2)
    .lineTo(-cell / 2, -cell / 2)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 }),

  () => new PIXI.Graphics()
    .moveTo(-cell / 2, -cell / 2)
    .bezierCurveTo(0.5, -cell / 2, cell / 2, 0.5, cell / 2, cell / 2)
    .lineTo(-cell / 2, cell / 2)
    .lineTo(-cell / 2, -cell / 2)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 }),

  () => {
    const g = new PIXI.Graphics();
    const checkerBoardSize = 5;
    const checkerSize = cell / checkerBoardSize;
    let counter = 0;

    for (let i = 0; i < checkerBoardSize; i++) {
      for (let j = 0; j < checkerBoardSize; j++) {
        if (counter % 2 === 0) {
          g.rect(checkerSize * j - cell / 2, checkerSize * i - cell / 2, checkerSize, checkerSize)
           .fill(0x000000)
           .stroke({ color: 0xdddddd, width: 1 });
        }
        counter++;
      }
    }
    return g;
  },

  () => new PIXI.Graphics()
    .moveTo(cell / 7 - cell / 2, cell * 3 / 14 - cell / 2)
    .lineTo(cell * 2 / 7 - cell / 2, cell * 3 / 14 - cell / 2)
    .lineTo(cell * 4 / 7 - cell / 2, cell / 2 - cell / 2)
    .lineTo(cell * 2 / 7 - cell / 2, cell * 11 / 14 - cell / 2)
    .lineTo(cell / 7 - cell / 2, cell * 11 / 14 - cell / 2)
    .lineTo(cell * 3 / 7 - cell / 2, cell / 2 - cell / 2)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 })
    .moveTo(cell * 3 / 7 - cell / 2, cell * 3 / 14 - cell / 2)
    .lineTo(cell * 4 / 7 - cell / 2, cell * 3 / 14 - cell / 2)
    .lineTo(cell * 6 / 7 - cell / 2, cell / 2 - cell / 2)
    .lineTo(cell * 4 / 7 - cell / 2, cell * 11 / 14 - cell / 2)
    .lineTo(cell * 3 / 7 - cell / 2, cell * 11 / 14 - cell / 2)
    .lineTo(cell * 5 / 7 - cell / 2, cell / 2 - cell / 2)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 }),

  () => new PIXI.Graphics()
    .rect(-cell / 2, -cell / 2, cell, cell / 7)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 }),

  () => new PIXI.Graphics()
    .rect(-cell / 2, -cell / 2, cell, cell)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 })
    .moveTo(cell * 5 / 7 - cell / 2, cell * 5 / 14 - cell / 2)
    .lineTo(cell / 2 - cell / 2, cell * 9 / 14 - cell / 2)
    .lineTo(cell * 2 / 7 - cell / 2, cell * 5 / 14 - cell / 2)
    .closePath()
    .fill(0x800000)
    .stroke({ color: 0xdddddd, width: 1 }),

  () => new PIXI.Graphics()
    .rect(-cell / 2, -cell / 2, cell, cell)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 })
    .moveTo(cell * 5 / 7 - cell / 2, cell * 5 / 14 - cell / 2)
    .lineTo(cell / 2 - cell / 2, cell * 9 / 14 - cell / 2)
    .lineTo(cell * 2 / 7 - cell / 2, cell * 5 / 14 - cell / 2)
    .closePath()
    .fill(0x000080)
    .stroke({ color: 0xdddddd, width: 1 })
];

const baseTextStyle = new PIXI.TextStyle({
    fontFamily: 'monospace',
    fontSize: 16,
    fill: 0xffffff,
});

let h = window.innerHeight - document.getElementsByClassName("navbar")[0].scrollHeight;
let w = window.innerWidth;

const Game = {
  // game
  running: false,
  bricks: [
    {x: 0, y: fh - 1, id: 0},
    {x: 1, y: fh - 1, id: 1},
    {x: 2, y: fh - 1, id: 2},
    {x: 3, y: fh - 1, id: 3},
    {x: 4, y: fh - 1, id: 4},
    {x: 5, y: fh - 1, id: 5},
    {x: 6, y: fh - 1, id: 6},
    {x: 7, y: fh - 1, id: 7},
    {x: 8, y: fh - 1, id: 8},
  ],

  // graphics
  app: null,
  gameContainer: null,
  uiContainer: null,

  // physics
  box2d: null,
  world: null,
  objects: [],
};