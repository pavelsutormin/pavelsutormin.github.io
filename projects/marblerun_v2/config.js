const urlParams = new URLSearchParams(window.location.search);
const cell = urlParams.get("cell") != null ? parseInt(urlParams.get("cell"), 10) : 32;
const fw = urlParams.get("fw") != null ? parseInt(urlParams.get("fw"), 10) : 10;
const fh = urlParams.get("fh") != null ? parseInt(urlParams.get("fh"), 10) : 15;

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
    const numberOfSegments = 6;
    const angle = Math.PI / 2 / numberOfSegments;
    let circleVector = { x: -Math.cos(angle), y: Math.sin(angle) };
    let lineVector = { x: -1.0, y: Math.tan(angle) };
    
    const shapes = []; // We will store our Box2D shapes here

    for (let i = 0; i < numberOfSegments; i++) {
      let vertices = [];

      if (i === 0) {
        vertices.push([-0.5, -0.5]);
        vertices.push([circleVector.x + 0.5, circleVector.y - 0.5]);
        vertices.push([lineVector.x + 0.5, lineVector.y - 0.5]);
      } else if (i === numberOfSegments - 1) {
        vertices.push([0.5, 0.5]);
        vertices.push([lineVector.x + 0.5, lineVector.y - 0.5]);
        vertices.push([circleVector.x + 0.5, circleVector.y - 0.5]);
      } else {
        let newCircleVector = { x: -Math.cos((i + 1) * angle), y: Math.sin((i + 1) * angle) };
        let newLineVector;

        if (i >= numberOfSegments / 2) {
          let n = numberOfSegments - i - 1;
          newLineVector = { x: -Math.tan(n * angle), y: 1.0 };
        } else {
          newLineVector = { x: -1.0, y: Math.tan((i + 1) * angle) };
        }

        vertices.push([circleVector.x + 0.5, circleVector.y - 0.5]);
        vertices.push([newCircleVector.x + 0.5, newCircleVector.y - 0.5]);
        vertices.push([newLineVector.x + 0.5, newLineVector.y - 0.5]);
        vertices.push([lineVector.x + 0.5, lineVector.y - 0.5]);

        circleVector = newCircleVector;
        lineVector = newLineVector;
      }

      // Create the Box2D shape for this segment
      const shape = new box2d.b2PolygonShape();
      const [vecArr, destroyVecArr] = box2d.tuplesToVec2Array(vertices);
      shape.Set(vecArr, vertices.length);
      destroyVecArr();
      
      shapes.push(shape);
    }

    return shapes; // Directly return the array of created shapes
  },
  // 3: Curve Out (Convex) - Returns a single shape
  (box2d) => {
    const numberOfSegments = 6;
    const angleStep = Math.PI / 2 / numberOfSegments;
    const vertices = [[-0.5, 0.5]];

    for (let i = numberOfSegments; i >= 0; i--) {
      const x = Math.cos(angleStep * i) - 0.5;
      const y = -Math.sin(angleStep * i) + 0.5;
      vertices.push([x, y]);
    }

    // Creates an 8-sided polygon
    const shape = new box2d.b2PolygonShape();
    const [vecArr, destroyVecArr] = box2d.tuplesToVec2Array(vertices);
    shape.Set(vecArr, vertices.length);
    destroyVecArr();
    
    return shape; // Returns a single shape
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
      [-0.5, -0.5],
      [0.5, -0.5],
      [0.5, -0.357],
      [-0.5, -0.357]
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
    shape.SetAsBox(0.5, 0.5);
    return shape;
  },
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
    .closePath()
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 })
    .moveTo(cell * 3 / 7 - cell / 2, cell * 3 / 14 - cell / 2)
    .lineTo(cell * 4 / 7 - cell / 2, cell * 3 / 14 - cell / 2)
    .lineTo(cell * 6 / 7 - cell / 2, cell / 2 - cell / 2)
    .lineTo(cell * 4 / 7 - cell / 2, cell * 11 / 14 - cell / 2)
    .lineTo(cell * 3 / 7 - cell / 2, cell * 11 / 14 - cell / 2)
    .lineTo(cell * 5 / 7 - cell / 2, cell / 2 - cell / 2)
    .closePath()
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
    .stroke({ color: 0xdddddd, width: 1 }),

  () => new PIXI.Graphics()
    .rect(-cell / 2, -cell / 2, cell, cell)
    .fill(0x000000)
    .stroke({ color: 0xdddddd, width: 1 })
    .rect(-cell / 6 - cell / 6, cell / 3, cell / 3)
    .fill(0x19ff00)
    .stroke({ color: 0xdddddd, width: 1 }),
];

const Game = {
  // game
  running: false,
  bricks: [],

  // graphics
  app: null,

  // physics
  box2d: null,
  world: null,
  objects: [],
  userDataMap: new Map(),
  pendingActions: [],
};