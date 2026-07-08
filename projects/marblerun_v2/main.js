async function init() {
  Game.app = new PIXI.Application();
  await Game.app.init({
    width: w,
    height: h,
    backgroundColor: 0x242424,
    antialias: true,
  });
  document.body.appendChild(Game.app.canvas);
  Game.app.canvas.style.display = "block";
  Game.app.canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  }, false);
  Game.app.stage.position.set(0.5, 0.5);

  window.__PIXI_DEVTOOLS__ = {
    app: Game.app
  };

  Game.uiContainer = new PIXI.Container();
  Game.uiContainer.addChild(createPixiButton("Run", 0, 0, 110, 35, () => {
    if (!Game.box2d) return;
    setupPhysicsWorld();
    Game.running = true;
  }));
  Game.uiContainer.addChild(createPixiButton("Reset", 125, 0, 110, 35, () => {
    if (!Game.box2d) return;
    Game.running = false;
    setupPhysicsWorld();
  }));
  Game.uiContainer.addChild(createPixiButton("Clear", 250, 0, 110, 35, () => {
    if (!Game.box2d) return;
    Game.running = false;
    Game.bricks.length = 0;
    setupPhysicsWorld();
  }));
  Game.uiContainer.addChild(createPixiButton("Save", 0, 50, 110, 35, () => {
    localStorage.setItem("track", JSON.stringify(Game.bricks));
  }));
  Game.uiContainer.addChild(createPixiButton("Load", 125, 50, 110, 35, () => {
    Game.running = false;
    if (localStorage.getItem("track") != null) Game.bricks = JSON.parse(localStorage.getItem("track"));
    Game.bricks.forEach((b) => {
      if (b.id == null && b.type != null) {
        b.id = b.type;
        delete b.type;
      }
      if (b.rot == null && b.rad != null) {
        b.rot = b.rad;
        delete b.rad;
      }
    });
    setupPhysicsWorld();
  }));

  let selectedBrick = 0;
  let currIndex = 0;
  let gridX, gridY;
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((id) => {
    const brickSrc = brickTextures[id]();
    brickSrc.x = (cell / 2) * 1.5 + cell * 1.5 * currIndex;
    brickSrc.y = 97 + (cell / 2) * 1.5;
    brickSrc.scale = 1.5;
    brickSrc.eventMode = "static";
    brickSrc.cursor = "pointer";
    brickSrc.on("pointerdown", (e) => {
      selectedBrick = id;
    });
    Game.uiContainer.addChild(brickSrc);
    currIndex++;
  });

  Game.gameContainer = new PIXI.Container();

  const gridHighlight = new PIXI.Graphics()
    .rect(-0.5, -0.5, cell + 1, cell + 1)
    .fill({color: 0x000000, alpha: 0.5});
  gridHighlight.zIndex = 1;
  Game.gameContainer.addChild(gridHighlight);

  Game.gameContainer.eventMode = "static";
  Game.gameContainer.on("pointermove", (e) => {
    const localGamePos = Game.gameContainer.toLocal(e.global);
    gridX = Math.floor(localGamePos.x / cell);
    gridY = Math.floor(localGamePos.y / cell);
    if (gridX < 0 || gridX >= fw || gridY < 0 || gridY >= fh) {
      gridX = null;
      gridY = null;
    } else {
      gridHighlight.x = gridX * cell;
      gridHighlight.y = gridY * cell;
    }
  });

  Game.gameContainer.on("pointerdown", (e) => {
    if (selectedBrick == null || gridX == null || gridY == null) return;
    Game.running = false;
    Game.bricks.push({x: gridX, y: gridY, id: selectedBrick, rot: 0});
    setupPhysicsWorld();
  });

  Game.uiContainer.x = w / 2 + 15;
  Game.uiContainer.y = h / 2 - Game.uiContainer.height / 2;
  Game.uiContainer.zIndex = 0;
  Game.app.stage.addChild(Game.uiContainer);

  const bg = new PIXI.Graphics()
    .rect(-2, -2, fw * cell + 4, fh * cell + 4)
    .fill(0xf4e004)
    .stroke({width: 3, color: 0x555555});
  bg.zIndex = 0;

  if (fw > 1 && fh > 1) {
    for (let i = 0; i < fw - 1; i++) {
        const x = (i + 1) * cell;
        graphicsDashedLine(bg, x, 0, x, fh * cell, 3, 3);
    }
    for (let j = 0; j < fh - 1; j++) {
        const y = (j + 1) * cell;
        graphicsDashedLine(bg, 0, y, fw * cell, y, 3, 3);
    }
    bg.stroke({width: 1, color: 0x000000, alpha: 0.5});
  }
  Game.gameContainer.addChild(bg);

  Game.gameContainer.x = w / 2 - (fw * cell) - 15;
  Game.gameContainer.y = h / 2 - (fh * cell) / 2;
  Game.gameContainer.hitArea = new PIXI.Rectangle(0, 0, fw * cell, fh * cell);
  Game.gameContainer.eventMode = "static";
  Game.gameContainer.on("pointertap", (e) => {
    if (!Game.running || !Game.world) return;
    const localPos = Game.gameContainer.toLocal(e.global);
    if (e.pointerType === 'mouse' && e.button === 2) {
      for (let i = 0; i < 100; i++) {
        createMarble(localPos.x / cell, localPos.y / cell, 0.25);
      }
    } else {
      createMarble(localPos.x / cell, localPos.y / cell, 0.25);
    }
  });
  Game.gameContainer.zIndex = 0;
  Game.app.stage.addChild(Game.gameContainer);

  Game.box2d = await Box2D();
  setupPhysicsWorld();
  Game.app.ticker.add((ticker) => update(ticker.deltaTime / 60));
}

window.addEventListener("resize", (e) => {
  w = window.innerWidth;
  h = window.innerHeight - document.getElementsByClassName("navbar")[0].scrollHeight;
  Game.gameContainer.x = w / 2 - (fw * cell) - 15;
  Game.gameContainer.y = h / 2 - (fh * cell) / 2;
  Game.uiContainer.x = w / 2 + 15;
  Game.uiContainer.y = h / 2 - Game.uiContainer.height / 2;
  Game.app.renderer.resize(w, h);
});

init().then(() => {
  loadFromMarblerunAt(4676595).then((track) => {
    Game.bricks = track;
    Game.running = false;
    setupPhysicsWorld();
  });
});