function setupPhysicsWorld() {
  const {b2Vec2, b2World} = Game.box2d;

  for (const obj of Game.objects) {
    Game.app.stage.removeChild(obj.graphics);
  }
  Game.objects.length = 0;
  
  if (Game.world) {
    Game.box2d.destroy(Game.world);
    Game.world = null;
  }

  const gravity = new b2Vec2(0, 9.81);
  Game.world = new b2World(gravity);
  Game.world.SetAllowSleeping(true);

  const listener = Object.assign(new Game.box2d.JSContactListener(), {
    BeginContact: (contactPtr) => {
      const contact = Game.box2d.wrapPointer(contactPtr, Game.box2d.b2Contact);
      const fixtureA = contact.GetFixtureA();
      const fixtureB = contact.GetFixtureB();

      const dataA = fixtureB.GetUserData();
      const dataB = fixtureB.GetUserData();
      console.log(dataA, dataB)
      console.log("BeginContact", contact);
    },

    EndContact: (contactPtr) => {
      const contact = Game.box2d.wrapPointer(contactPtr, Game.box2d.b2Contact);
      console.log("EndContact", contact);
    },

    PreSolve: (contactPtr, oldManifoldPtr) => {
      const contact = Game.box2d.wrapPointer(contactPtr, Game.box2d.b2Contact);
      console.log("PreSolve", contact);
    },

    PostSolve: (contactPtr, impulsePtr) => {
      const contact = Game.box2d.wrapPointer(contactPtr, Game.box2d.b2Contact);
      console.log("PostSolve", contact);
    }
  });

  Game.world.SetContactListener(listener);

  createWall(fw / 2, -0.5, fw, 1);
  createWall(fw / 2, fh + 0.5, fw, 1);
  createWall(-0.5, fh / 2, 1, fh);
  createWall(fw + 0.5, fh / 2, 1, fh);

  for (const b of Game.bricks) {
    createBrick(b);
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

function createBrick(b) {
  const {b2BodyDef, b2PolygonShape, b2FixtureDef, b2_staticBody} = Game.box2d;

  const bodyDef = new b2BodyDef();
  bodyDef.type = b2_staticBody;
  bodyDef.position.Set(b.x + 0.5, b.y + 0.5);
  bodyDef.angle = b.rot; 
  const body = Game.world.CreateBody(bodyDef);

  const shape = (brickShapes[b.id])(Game.box2d);

  const fixtureDef = new b2FixtureDef();
  fixtureDef.shape = shape;
  fixtureDef.density = 0.0;
  fixtureDef.friction = 0.9;
  fixtureDef.userData = {id: b.id};
  const fix = body.CreateFixture(fixtureDef);

  const graphics = brickTextures[b.id]();
  graphics.x = (b.x + 0.5) * cell;
  graphics.y = (b.y + 0.5) * cell;
  graphics.rotation = b.rot;
  graphics.zIndex = 1;
  Game.app.stage.addChild(graphics);

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
  fixtureDef.userData = {id: -1};
  const fix = body.CreateFixture(fixtureDef);

  const graphics = new PIXI.Graphics()
    .circle(0, 0, 0.25 * cell)
    .fill(0x800000);
  graphics.x = x * cell;
  graphics.y = y * cell;
  graphics.zIndex = 2;
  Game.app.stage.addChild(graphics);

  Game.objects.push({body, graphics});
}

function update(dt) {
  if (!Game.running) return;
  Game.world.Step(0.04, 10, 10);
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