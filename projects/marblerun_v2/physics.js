function setupPhysicsWorld() {
  const {b2Vec2, b2World} = Game.box2d;
  
  if (Game.world) {
    Game.box2d.destroy(Game.world);
    Game.world = null;
  }

  for (const obj of Game.physicsObjects) {
    if (obj.graphics) {
      Game.gameContainer.removeChild(obj.graphics);
      obj.graphics.destroy();
    }
  }
  
  Game.physicsObjects.length = 0; 

  const gravity = new b2Vec2(0, 9.81);
  Game.world = new b2World(gravity);
  Game.world.SetAllowSleeping(true);

  // top and bottom
  createStatic(fw / 2, -0.5, fw, 1);
  createStatic(fw / 2, fh + 0.5, fw, 1);

  // left and right
  createStatic(-0.5, fh / 2, 1, fh);
  createStatic(fw + 0.5, fh / 2, 1, fh);

  for (const b of Game.bricks) {
    createBrick(b.x, b.y, b.id)
  }

  createMarble(0.5, 0.5, 0.25);
}

function createStatic(x, y, width, height) {
  const {b2BodyDef, b2PolygonShape, b2FixtureDef, b2_staticBody} = Game.box2d;

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
  const body = createStatic(x + 0.5, y + 0.5, 1, 1);

  const graphics = brickTextures[id]();
  graphics.zIndex = 1;

  graphics.x = x * cell;
  graphics.y = y * cell;
  Game.gameContainer.addChild(graphics);

  Game.physicsObjects.push({id, body, graphics});
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

  Game.physicsObjects.push({id: -1, body, graphics});
}

function update(dt) {
  if (!Game.running) return;
  Game.world.Step(dt, 10, 10);
  for (const obj of Game.physicsObjects) {
    if (obj.id == -1) {
      const position = obj.body.GetPosition();
      obj.graphics.x = position.x * cell;
      obj.graphics.y = position.y * cell;
      obj.graphics.rotation = obj.body.GetAngle();
    }
  }
}