function setupPhysicsWorld() {
  const {b2Vec2, b2World} = Game.box2d;

  for (const obj of Game.objects) {
    Game.gameContainer.removeChild(obj.graphics);
  }
  Game.objects.length = 0;
  
  if (Game.world) {
    Game.box2d.destroy(Game.world);
    Game.world = null;
  }

  const gravity = new b2Vec2(0, 9.81);
  Game.world = new b2World(gravity);
  Game.world.SetAllowSleeping(true);

  createWall(fw / 2, -0.5, fw, 1);
  createWall(fw / 2, fh + 0.5, fw, 1);
  createWall(-0.5, fh / 2, 1, fh);
  createWall(fw + 0.5, fh / 2, 1, fh);

  for (const b of Game.bricks) {
    createBrick(b.x, b.y, b.id);
  }
  createMarble(0.5, 0.5, 0.25);
}

function createWall(x, y, width, height) {
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
}

function createBrick(x, y, id) {
  const {b2BodyDef, b2PolygonShape, b2FixtureDef, b2_staticBody} = Game.box2d;

  const bodyDef = new b2BodyDef();
  bodyDef.type = b2_staticBody;
  bodyDef.position.Set(x + 0.5, y + 0.5);
  const body = Game.world.CreateBody(bodyDef);

  const shape = (brickShapes[id] || brickShapes[0])(Game.box2d);

  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = shape;
  fixtureDef.density = 0.0;
  fixtureDef.friction = 0.9;
  body.CreateFixture(fixtureDef);

  const graphics = brickTextures[id]();
  graphics.x = (x + 0.5) * cell;
  graphics.y = (y + 0.5) * cell;
  graphics.zIndex = 1;
  Game.gameContainer.addChild(graphics);

  Game.objects.push({body, graphics});
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
    .circle(0, 0, 0.25 * cell)
    .fill(0x800000);
  graphics.x = x * cell;
  graphics.y = y * cell;
  graphics.zIndex = 2;
  Game.gameContainer.addChild(graphics);

  Game.objects.push({body, graphics});
}

function update(dt) {
  if (!Game.running) return;
  Game.world.Step(dt, 10, 10);
  for (const obj of Game.objects) {
    const position = obj.body.GetPosition();
    const angle = obj.body.GetAngle();
    const screenX = position.x * cell;
    const screenY = position.y * cell;

    obj.graphics.x = screenX;
    obj.graphics.y = screenY;
    obj.graphics.rotation = angle;
  }
}