function setupPhysicsWorld() {
  const {b2Vec2, b2World, wrapPointer, getPointer} = Game.box2d;

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
      const contact = wrapPointer(contactPtr, Game.box2d.b2Contact);
      const fixtureA = contact.GetFixtureA();
      const fixtureB = contact.GetFixtureB();
      const dataA = Game.userDataMap.get(getPointer(fixtureA));
      const dataB = Game.userDataMap.get(getPointer(fixtureB));
      const marbleFix = dataA?.id == -1 ? fixtureA : dataB?.id == -1 ? fixtureB : null;
      const tpBrickFix = dataA?.id == 8 ? fixtureA : dataB?.id == 8 ? fixtureB : null;
      const ballBrickFix = dataA?.id == 7 ? fixtureA : dataB?.id == 7 ? fixtureB : null;
      const boostBrickFix = dataA?.id == 5 ? fixtureA : dataB?.id == 5 ? fixtureB : null;
      const endBrickFix = dataA?.id == 4 ? fixtureA : dataB?.id == 4 ? fixtureB : null;
      const marble = marbleFix ? marbleFix.GetBody() : null;
      const tpBrick = tpBrickFix ? tpBrickFix.GetBody() : null;
      const ballBrick = ballBrickFix ? ballBrickFix.GetBody() : null;
      const boostBrick = boostBrickFix ? boostBrickFix.GetBody() : null;
      const endBrick = endBrickFix ? endBrickFix.GetBody() : null;
      if (marble != null && tpBrick != null) {
        Game.pendingActions.push(() => {
          const targetPosition = tpBrick.GetWorldPoint(new b2Vec2(0, 0.6));
          marble.SetTransform(targetPosition, marble.GetAngle());
          marble.ApplyLinearImpulse(tpBrick.GetWorldVector(new b2Vec2(0, 6)), marble.GetWorldCenter(), true);
          return true;
        });
      } else if (marble != null && ballBrick != null && Game.userDataMap.get(getPointer(ballBrickFix)).active) {
        Game.pendingActions.push(() => {
          const targetPosition = ballBrick.GetWorldPoint(new b2Vec2(0, 0.6));
          const newMarble = createMarble(targetPosition.x, targetPosition.y, 0.25);
          newMarble.ApplyLinearImpulseToCenter(ballBrick.GetWorldVector(new b2Vec2(0, 6)), true);
          Game.userDataMap.get(getPointer(ballBrickFix)).active = false;
          return true;
        });
      } else if (marble != null && boostBrick != null) {
        Game.userDataMap.get(getPointer(boostBrickFix)).active = true;
        const boostVector = new b2Vec2(.6, 0);
        const worldBoostVector = boostBrick.GetWorldVector(boostVector);
        Game.pendingActions.push(() => {
          marble.ApplyLinearImpulseToCenter(worldBoostVector, true);
          if (!Game.userDataMap.get(getPointer(boostBrickFix)).active) {
            Game.box2d.destroy(worldBoostVector);
            Game.box2d.destroy(boostVector);
            return true;
          }
          return false;
        });
      } else if (marble != null && endBrick != null) {
        Game.pendingActions.push(() => {
          Game.running = false;
          return true;
        });
      }
    },

    EndContact: (contactPtr) => {
      const contact = wrapPointer(contactPtr, Game.box2d.b2Contact);
      const fixtureA = contact.GetFixtureA();
      const fixtureB = contact.GetFixtureB();
      const dataA = Game.userDataMap.get(getPointer(fixtureA));
      const dataB = Game.userDataMap.get(getPointer(fixtureB));
      const marbleFix = dataA?.id == -1 ? fixtureA : dataB?.id == -1 ? fixtureB : null;
      const boostBrickFix = dataA?.id == 5 ? fixtureA : dataB?.id == 5 ? fixtureB : null;
      const marble = marbleFix ? marbleFix.GetBody() : null;
      const boostBrick = boostBrickFix ? boostBrickFix.GetBody() : null;
      if (marble != null && boostBrick != null) {
        Game.userDataMap.get(getPointer(boostBrickFix)).active = false;
      }
    },

    PreSolve: (contactPtr, oldManifoldPtr) => {
      const contact = wrapPointer(contactPtr, Game.box2d.b2Contact);
    },

    PostSolve: (contactPtr, impulsePtr) => {
      const contact = wrapPointer(contactPtr, Game.box2d.b2Contact);
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
  const {b2BodyDef, b2PolygonShape, b2FixtureDef, b2_staticBody, getPointer} = Game.box2d;

  const bodyDef = new b2BodyDef();
  bodyDef.type = b2_staticBody;
  bodyDef.position.Set(b.x + 0.5, b.y + 0.5);
  bodyDef.angle = b.rot; 
  const body = Game.world.CreateBody(bodyDef);

  const shapeResult = (brickShapes[b.id])(Game.box2d);
  const shapes = Array.isArray(shapeResult) ? shapeResult : [shapeResult];
  for (let i = 0; i < shapes.length; i++) {
    const fixtureDef = new b2FixtureDef();
    fixtureDef.shape = shapes[i];
    fixtureDef.density = 0.0;
    fixtureDef.friction = 0.9;
    fixtureDef.userData = {id: b.id};
    if (b.id == 4 || b.id == 5) fixtureDef.isSensor = true;
    const fixture = body.CreateFixture(fixtureDef);
    const userData = {id: b.id};
    if (b.id == 5 || b.id == 7 || b.id == 8) userData.active = true;
    Game.userDataMap.set(getPointer(fixture), userData);
  }

  const graphics = brickTextures[b.id]();
  graphics.x = (b.x + 0.5) * cell;
  graphics.y = (b.y + 0.5) * cell;
  graphics.rotation = b.rot;
  graphics.zIndex = 1;
  Game.app.stage.addChild(graphics);

  Game.objects.push({body, graphics});
  return body;
}

function createMarble(x, y, radius) {
  const {b2BodyDef, b2CircleShape, b2FixtureDef, b2_dynamicBody, getPointer} = Game.box2d;

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
  const fixture = body.CreateFixture(fixtureDef);
  Game.userDataMap.set(getPointer(fixture), {id: -1});

  const graphics = new PIXI.Graphics()
    .circle(0, 0, 0.25 * cell)
    .fill(0x800000);
  graphics.x = x * cell;
  graphics.y = y * cell;
  graphics.zIndex = 2;
  Game.app.stage.addChild(graphics);

  Game.objects.push({body, graphics});
  return body;
}

function update(dt) {
  if (!Game.running) return;
  Game.world.Step(0.02, 10, 10);
  Game.pendingActions = Game.pendingActions.filter((f) => !f());
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