class Marble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.graphics = null;
    this.body = null;
  }

  initBody() {
    if (!Game.box2d || !Game.world) return;
    if (this.body) {
      Game.world.destroyBody(this.body);
    }
    const bodyDef = new Game.box2d.b2BodyDef();
    bodyDef.type = Game.box2d.b2_staticBody;
    bodyDef.position.Set(x + 0.5, y + 0.5);
    this.body = Game.world.CreateBody(bodyDef);

    const shape = new Game.box2d.b2PolygonShape();
    shape.SetAsBox(width / 2, height / 2);

    const fixtureDef = new Game.box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.density = 0.0;
    fixtureDef.friction = 0.9;
    this.body.CreateFixture(fixtureDef);
  }

  initGraphics() {
    if (this.graphics) {
      Game.gameContainer.removeChild(this.graphics);
      this.graphics.destroy();
    }
    this.graphics = brickTextures[0]();
    this.graphics.zIndex = 1;
    this.graphics.x = (x + 0.5) * cell;
    this.graphics.y = (y + 0.5) * cell;
    Game.gameContainer.addChild(this.graphics);
  }

  updateGraphics() {
    const position = this.body.GetPosition();
    const angle = this.body.GetAngle();
    const screenX = position.x * cell;
    const screenY = position.y * cell;

    this.graphics.x = screenX;
    this.graphics.y = screenY;
    this.graphics.rotation = angle;
  }

  destroy() {
    if (!Game.box2d || !Game.world) return;
    if (this.body) {
      Game.world.destroyBody(this.body);
      this.body = null;
    }
    if (this.graphics) {
      Game.gameContainer.removeChild(this.graphics);
      this.graphics.destroy();
      this.graphics = null;
    }
  }
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.graphics = null;
    this.body = null;
  }

  initBody() {
    if (!Game.box2d || !Game.world) return;
    if (this.body) {
      Game.world.destroyBody(this.body);
    }
    const bodyDef = new Game.box2d.b2BodyDef();
    bodyDef.type = Game.box2d.b2_staticBody;
    bodyDef.position.Set(x + 0.5, y + 0.5);
    this.body = Game.world.CreateBody(bodyDef);

    const shape = new Game.box2d.b2PolygonShape();
    shape.SetAsBox(width / 2, height / 2);

    const fixtureDef = new Game.box2d.b2FixtureDef();
    fixtureDef.shape = shape;
    fixtureDef.density = 0.0;
    fixtureDef.friction = 0.9;
    this.body.CreateFixture(fixtureDef);
  }

  initGraphics() {
    if (this.graphics) {
      Game.gameContainer.removeChild(this.graphics);
      this.graphics.destroy();
    }
    this.graphics = brickTextures[0]();
    this.graphics.zIndex = 1;
    this.graphics.x = (x + 0.5) * cell;
    this.graphics.y = (y + 0.5) * cell;
    Game.gameContainer.addChild(this.graphics);
  }

  updateGraphics() {
    const position = this.body.GetPosition();
    const angle = this.body.GetAngle();
    const screenX = position.x * cell;
    const screenY = position.y * cell;

    this.graphics.x = screenX;
    this.graphics.y = screenY;
    this.graphics.rotation = angle;
  }

  destroy() {
    if (!Game.box2d || !Game.world) return;
    if (this.body) {
      Game.world.destroyBody(this.body);
      this.body = null;
    }
    if (this.graphics) {
      Game.gameContainer.removeChild(this.graphics);
      this.graphics.destroy();
      this.graphics = null;
    }
  }
}