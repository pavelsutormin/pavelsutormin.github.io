async function init() {
  Game.app = new PIXI.Application();
  await Game.app.init({
    width: fw * cell,
    height: fh * cell,
    backgroundColor: 0x242424,
    antialias: true,
    view: document.getElementById("game-canvas"),
  });
  Game.app.canvas.style.display = "block";
  Game.app.canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  }, false);
  Game.app.stage.position.set(-0.5, -0.5);

  window.__PIXI_DEVTOOLS__ = {
    app: Game.app
  };

  const bg = new PIXI.Graphics()
    .rect(0, 0, fw * cell, fh * cell)
    .fill(0xf4e004);
  if (fw > 1 && fh > 1) {
    for (let i = 0; i < fw - 1; i++) {
      const x = (i + 1) * cell;
      drawDashedLine(bg, x, 0, x, fh * cell, 3, 3);
    }
    for (let j = 0; j < fh - 1; j++) {
      const y = (j + 1) * cell;
      drawDashedLine(bg, 0, y, fw * cell, y, 3, 3);
    }
    bg.stroke({width: 1, color: 0x000000, alpha: 0.5});
  }
  bg.zIndex = 0;
  Game.app.stage.addChild(bg);

  document.getElementById("run-button").addEventListener("click", (e) => {
    if (!Game.box2d) return;
    setupPhysicsWorld();
    Game.running = true;
  });
  document.getElementById("reset-button").addEventListener("click", (e) => {
    if (!Game.box2d) return;
    Game.running = false;
    setupPhysicsWorld();
  });
  document.getElementById("clear-button").addEventListener("click", (e) => {
    if (!Game.box2d) return;
    Game.running = false;
    Game.bricks.length = 0;
    setupPhysicsWorld();
  });
  document.getElementById("save-button").addEventListener("click", (e) => {
    localStorage.setItem("track", JSON.stringify(Game.bricks));
  });
  document.getElementById("load-button").addEventListener("click", (e) => {
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
  });
  document.getElementById("marblerunat-button").addEventListener("click", (e) => {
    const trackId = document.getElementById("trackid-input").value;
    loadFromMarblerunAt(trackId).then((track) => {
      Game.bricks = track;
      Game.running = false;
      setupPhysicsWorld();
    });
  });

  let selected = null;
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((id, index) => {
    const canvas = document.getElementById("brick-" + id);
    if (canvas == null) return;
    canvas.width = cell * 2;
    canvas.height = cell * 2;
    const ctx = canvas.getContext('2d');
    const g = brickTextures[id]();
    const texture = Game.app.renderer.generateTexture({
      target: g,
      frame: new PIXI.Rectangle(-cell / 2, -cell / 2, cell, cell),
      resolution: 2
    });
    const sourceCanvas = Game.app.renderer.extract.canvas(texture);
    ctx.drawImage(sourceCanvas, 0, 0, cell * 2, cell * 2);
    texture.destroy(true);
    g.destroy();
    canvas.addEventListener("pointerdown", (e) => {
      selected = id;
      [...document.getElementsByClassName("brick")].forEach((b) => b.style.borderColor = null);
      canvas.style.borderColor = "blue";
    });
  });

  Game.app.canvas.addEventListener("pointerdown", (e) => {
    const rect = Game.app.canvas.getBoundingClientRect();
    const gridX = Math.floor((e.clientX - rect.left) / cell);
    const gridY = Math.floor((e.clientY - rect.top) / cell);
    if (!(gridX >= 0 && gridX < fw && gridY >= 0 && gridY < fh)) return;
    if (e.button == 0) {
      if (selected == null) return;
      Game.running = false;
      Game.bricks = Game.bricks.filter(block => block.x !== gridX || block.y !== gridY);
      Game.bricks.push({x: gridX, y: gridY, id: selected, rot: 0});
      setupPhysicsWorld();
    } else if (e.button == 2) {
      Game.running = false;
      Game.bricks.filter(b => b.x === gridX && b.y === gridY).forEach((b) => b.rot += Math.PI / 2);
      setupPhysicsWorld();
    }
  });

  Game.box2d = await Box2D();
  setupPhysicsWorld();
  Game.app.ticker.add((ticker) => update(ticker.deltaTime / 60));
}

init();