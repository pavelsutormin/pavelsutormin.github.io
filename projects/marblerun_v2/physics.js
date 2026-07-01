function setupPhysicsWorld() {
  const {b2Vec2, b2World} = Game.box2d;
  
  if (Game.world) {
    Game.box2d.destroy(Game.world);
    Game.world = null;
  }

  const gravity = new b2Vec2(0, 9.81);
  Game.world = new b2World(gravity);
  Game.world.SetAllowSleeping(true);

  // top and bottom
  createStatic(fw / 2, -0.5, fw, 1, 0);
  createStatic(fw / 2, fh + 0.5, fw, 1, 0);

  // left and right
  createStatic(-0.5, fh / 2, 1, fh, 0);
  createStatic(fw + 0.5, fh / 2, 1, fh, 0);

  for (const b of Game.bricks) {
    b.initBody();
    b.initGraphics();
  }

  createMarble(0.5, 0.5, 0.25);
}

function createStatic(x, y, width, height, id) {
  const {b2BodyDef, b2PolygonShape, b2FixtureDef, b2Vec2, b2_staticBody} = Game.box2d;

  const bodyDef = new b2BodyDef();
  bodyDef.type = b2_staticBody;
  bodyDef.position.Set(x, y);
  const body = Game.world.CreateBody(bodyDef);

  const shape = new b2PolygonShape();
  shape.SetAsBox(width / 2, height / 2);

  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = shape;
  fixtureDef.density = 0.0;
  fixtureDef.friction = 0.9;
  body.CreateFixture(fixtureDef);

  return body;
}

function createBrick(x, y, id) {
  const body = createStatic(x + 0.5, y + 0.5, 1, 1, id);

  const graphics = brickTextures[id]();
  graphics.zIndex = 1;
  graphics.x = (x + 0.5) * cell;
  graphics.y = (y + 0.5) * cell;
  Game.gameContainer.addChild(graphics);

  const debugGraphics = debugTextures[id]();
  debugGraphics.zIndex = 3;
  debugGraphics.x = (x + 0.5) * cell;
  debugGraphics.y = (y + 0.5) * cell;
  Game.gameContainer.addChild(debugGraphics);

  Game.physicsObjects.push({id, body, graphics, debugGraphics});
}

function createMarble(x, y, radius) {
  const {b2BodyDef, b2CircleShape, b2FixtureDef, b2_dynamicBody} = Game.box2d;

  const bodyDef = new b2BodyDef();
  bodyDef.type = b2_dynamicBody;
  bodyDef.position.Set(x, y);
  const body = Game.world.CreateBody(bodyDef);

  const shape = new b2CircleShape();
  shape.m_radius = radius;

  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = shape;
  fixtureDef.density = 2;
  fixtureDef.friction = 0.9;
  body.CreateFixture(fixtureDef);

  const graphics = new PIXI.Graphics()
    .circle(0, 0, radius * cell)
    .fill(0x800000);
  graphics.zIndex = 2;
  graphics.x = x * cell;
  graphics.y = y * cell;
  Game.gameContainer.addChild(graphics);

  const debugGraphics = new PIXI.Graphics()
    .circle(0, 0, radius * cell)
    .stroke({color: 0xff0000, pixelLine: true})
    .moveTo(0, 0)
    .lineTo(0, -cell / 2)
    .stroke({color: 0xff0000, pixelLine: true});
  debugGraphics.zIndex = 3;
  debugGraphics.x = x * cell;
  debugGraphics.y = y * cell;
  Game.gameContainer.addChild(debugGraphics);

  Game.physicsObjects.push({id: -1, body, graphics, debugGraphics});
}

function update(dt) {
  Game.secondCounter += dt;
  if (Game.secondCounter > 0.25) {
    Game.fpsText.text = "FPS: " + (1 / dt).toFixed(2);
    Game.secondCounter = 0;
  }
  if (!Game.running) return;
  Game.world.Step(dt, 10, 10);
  for (const m of Game.marbles) {
    m.updateGraphics();
  }
  for (const b of Game.bricks) {
    b.updateGraphics();
  }
}