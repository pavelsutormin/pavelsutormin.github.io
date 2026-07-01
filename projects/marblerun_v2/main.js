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

  Game.fpsText = new PIXI.Text({text: "FPS: -1", style: baseTextStyle});
  Game.fpsText.x = 0;
  Game.fpsText.y = 0;
  Game.fpsText.zIndex = 1;
  Game.app.stage.addChild(Game.fpsText);

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
    showToast("Saving...");
  }));
  Game.uiContainer.addChild(createPixiButton("Load", 125, 50, 110, 35, () => {
    showToast("Loading...");
  }));

  let draggingBrick = null;

  const brickSrc0 = brickTextures[0]();
  brickSrc0.x = (cell / 2) * 1.5;
  brickSrc0.y = 97 + (cell / 2) * 1.5;
  brickSrc0.scale = 1.5;
  brickSrc0.eventMode = "static";
  brickSrc0.cursor = "pointer";
  brickSrc0.on("pointerdown", (e) => {
    draggingBrick = {id: 0, brick: brickTextures[0]()};
    draggingBrick.brick.alpha = 0.85;
    Game.app.stage.addChild(draggingBrick.brick);

    draggingBrick.brick.x = e.global.x - cell / 2;
    draggingBrick.brick.y = e.global.y - cell / 2;
  });
  Game.uiContainer.addChild(brickSrc0);

  const brickSrc1 = brickTextures[1]();
  brickSrc1.x = cell * 1.5 + 10 + (cell / 2) * 1.5;
  brickSrc1.y = 97 + (cell / 2) * 1.5;
  brickSrc1.scale = 1.5;
  brickSrc1.eventMode = "static";
  brickSrc1.cursor = "pointer";
  brickSrc1.on("pointerdown", (e) => {
    draggingBrick = {id: 1, brick: brickTextures[1]()};
    draggingBrick.brick.alpha = 0.85;
    Game.app.stage.addChild(draggingBrick.brick);

    draggingBrick.brick.x = e.global.x - cell / 2;
    draggingBrick.brick.y = e.global.y - cell / 2;
  });
  Game.uiContainer.addChild(brickSrc1);

  Game.app.stage.eventMode = "static";

  Game.app.stage.on("pointermove", (e) => {
    const localGamePos = Game.gameContainer.toLocal(e.global);
    gridX = Math.floor(localGamePos.x / cell);
    gridY = Math.floor(localGamePos.y / cell);
    if (gridX < 0 || gridX >= fw || gridY < 0 || gridY >= fh) {
      gridX = null;
      gridY = null;
    }

    if (draggingBrick) {
      draggingBrick.brick.x = e.global.x;
      draggingBrick.brick.y = e.global.y;
    }
  });

  Game.app.stage.on("pointerup", (e) => {
    if (!draggingBrick) return;
    if (gridX >= 0 && gridX < fw && gridY >= 0 && gridY < fh) {
      const alreadyExists = Game.bricks.find(b => b.x === gridX && b.y === gridY);
      const index = Game.bricks.indexOf(alreadyExists);
      if (alreadyExists && index > -1) {
        Game.gameContainer.removeChild(alreadyExists.graphics);
        Game.gameContainer.removeChild(alreadyExists.debugGraphics);
        Game.bricks.splice(index, 1);
      }
      Game.bricks.push({x: gridX, y: gridY, id: draggingBrick.id});
      createBrick(gridX, gridY, draggingBrick.id);
    }

    Game.app.stage.removeChild(draggingBrick.brick);
    draggingBrick.brick.destroy();
    draggingBrick = null;
  });

  Game.app.stage.on("pointerupoutside", () => {
    if (!draggingBrick) return;
    Game.app.stage.removeChild(draggingBrick.brick);
    draggingBrick.brick.destroy();
    draggingBrick = null;
  });

  Game.uiContainer.x = w / 2 + 15;
  Game.uiContainer.y = h / 2 - Game.uiContainer.height / 2;
  Game.uiContainer.zIndex = 0;
  Game.app.stage.addChild(Game.uiContainer);

  Game.gameContainer = new PIXI.Container();

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

init();