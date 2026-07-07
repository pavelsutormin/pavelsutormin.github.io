let world = null;
let runFrame = null;
let simStopped = true;

let ballPositions = [];
let timeStart;

function drawBalls(ctx) {
  if (!world) return;
  for (let body = world.getBodyList(); body; body = body.getNext()) {
    if (body.getFixtureList().getUserData()?.type === -1) {
      const p = body.getPosition();
      const x = p.x * cellSize;
      const y = (fieldHeight - p.y) * cellSize;

      ctx.beginPath();
      ctx.arc(x, y, PHYSICS.ballRadius * cellSize, 0, Math.PI * 2);
      ctx.fillStyle = "#800000";
      ctx.fill();
    }
  }
}

function cellCenterSim(col, row) {
  return pl.Vec2(col + 0.5, fieldHeight - row - 0.5);
}

function addBrickBodies(w, bricks) {
  const h = 0.5;
  const mat = {friction: PHYSICS.staticFriction, restitution: PHYSICS.staticRestitution};

  for (let i = 0; i < bricks.length; i++) {
    const b = bricks[i];
    const body = w.createBody({type: "static", position: cellCenterSim(b.x, b.y)});
    if (b.type === 0) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Box(0.5, 0.5);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    } else if (b.type === 1) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Polygon([
        pl.Vec2(-0.5, -0.5),
        pl.Vec2(-0.5, 0.5),
        pl.Vec2(0.5, 0.5),
      ]);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    } else if (b.type === 2) {
      body.setAngle(Math.PI / 2 - b.rad);
      addCurveInFixtures(body, mat);
      for (let f = body.getFixtureList(); f; f = f.getNext()) {
        f.setUserData({type: b.type});
      }
    } else if (b.type === 3) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = createCurveOutShape();
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    } else if (b.type === 4) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Box(0.3, 0.3);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    } else if (b.type === 5) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Box(0.4, 0.4);
      const fix = body.createFixture({
        shape: shape,
        isSensor: true
      });
      fix.setUserData({type: b.type, dir: pl.Vec2(
        Math.cos(b.rad) * .3,
        -Math.sin(b.rad) * .3
      )});
    } else if (b.type === 6) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Polygon([
        pl.Vec2(0.5, -0.5),
        pl.Vec2(0.5, 0.5),
        pl.Vec2(0.4375, 0.5),
        pl.Vec2(0.4375, -0.5)
      ]);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    } else if (b.type === 7) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Box(0.5, 0.5);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type, active: true});
    } else if (b.type === 8) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Box(0.5, 0.5);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    } else if (b.type === 9) {
      body.setAngle(Math.PI / 2 - b.rad + Math.PI / 2);
      const shape = pl.Polygon([
        pl.Vec2(-0.5, 0.5),
        pl.Vec2(0.5, 0.5),
        pl.Vec2(0, -0.5),
      ]);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    } else if (b.type === 10) {
      body.setAngle(Math.PI / 2 - b.rad);
      const shape = pl.Polygon([
        pl.Vec2(-0.5, -1.5),
        pl.Vec2(-0.5, 0.5),
        pl.Vec2(0.5, 0.5),
      ]);
      const fix = body.createFixture(shape, mat);
      fix.setUserData({type: b.type});
    }
  }
}

function addWalls(w) {
  const e = 0.25;
  const fw = fieldWidth;
  const fh = fieldHeight;
  
  w.setGravity(pl.Vec2(0, -PHYSICS.gravity));
  w.setAllowSleeping(false);
  
  const wall = {
    friction: PHYSICS.staticFriction, 
    restitution: PHYSICS.staticRestitution
  };

  // Bottom wall
  const bottom = w.createBody({ type: "static", position: pl.Vec2(fw / 2, -e / 2) });
  bottom.createFixture(pl.Box(fw / 2 + e, e / 2), wall);

  // Top wall
  const top = w.createBody({ type: "static", position: pl.Vec2(fw / 2, fh + e / 2) });
  top.createFixture(pl.Box(fw / 2 + e, e / 2), wall);

  // Left wall
  const left = w.createBody({ type: "static", position: pl.Vec2(-e / 2, fh / 2) });
  left.createFixture(pl.Box(e / 2, fh / 2 + e), wall);

  // Right wall
  const right = w.createBody({ type: "static", position: pl.Vec2(fw + e / 2, fh / 2) });
  right.createFixture(pl.Box(e / 2, fh / 2 + e), wall);
}

function initPlanck() {
  simStopped = true;
  world = new pl.World(pl.Vec2(0, 0));
  addWalls(world);
  addBrickBodies(world, bricks);
  world.createDynamicBody({
    position: pl.Vec2(0.5, fieldHeight - 0.5),
    bullet: true
  }).createFixture(pl.Circle(PHYSICS.ballRadius), {
    density: PHYSICS.ballDensity,
    friction: PHYSICS.ballFriction,
    restitution: PHYSICS.ballRestitution,
  }).setUserData({type: -1});
}

function startRun(bricks) {
  timeStart = performance.now();
  if (runFrame != null) cancelAnimationFrame(runFrame);
  runFrame = null;
  simStopped = false;
  let activeBoosts = [];
  let pendingSpawns = [];
  let pendingTps = [];
  world.on("begin-contact", (contact) => {
    const fixA = contact.getFixtureA();
    const fixB = contact.getFixtureB();
    const a = fixA.getUserData();
    const b = fixB.getUserData();

    if ((a?.type === -1 && b?.type === 4) || (a?.type === 4 && b?.type === -1)) {
      simStopped = true;
    }

    const ballFix = (a?.type === -1) ? fixA : (b?.type === -1 ? fixB : null);
    const boostFix = (a?.type === 5) ? fixA : (b?.type === 5 ? fixB : null);
    const ballBoxFix = (a?.type === 7) ? fixA : (b?.type === 7 ? fixB : null);
    const tpBoxFix = (a?.type === 8) ? fixA : (b?.type === 8 ? fixB : null);
    const spikeFix = (a?.type === 9) ? fixA : (b?.type === 9 ? fixB : null);

    if (ballFix && boostFix) {
      activeBoosts.push([ballFix, boostFix]);
    }
    if (ballFix && ballBoxFix && ballBoxFix.getUserData().active) {
      const boxBody = ballBoxFix.getBody();
      const localOffset = pl.Vec2(-0.6, 0);
      const worldDirection = boxBody.getWorldVector(pl.Vec2(-6, 0));
      pendingSpawns.push([
        boxBody.getWorldPoint(localOffset),
        worldDirection,
        ballBoxFix
      ]);
    }
    if (ballFix && tpBoxFix) {
      const tpBoxBody = tpBoxFix.getBody();
      const localOffset = pl.Vec2(-0.6, 0);
      const worldDirection = tpBoxBody.getWorldVector(pl.Vec2(-6, 0));
      pendingTps.push([
        tpBoxBody.getWorldPoint(localOffset),
        worldDirection,
        ballFix.getBody()
      ]);
    }
    if (ballFix && spikeFix) {
      initPlanck();
    }
  });
  world.on("end-contact", (contact) => {
    const fixA = contact.getFixtureA();
    const fixB = contact.getFixtureB();
    const a = fixA.getUserData();
    const b = fixB.getUserData();

    const ballFix = (a?.type === -1) ? fixA : (b?.type === -1 ? fixB : null);
    const boostFix = (a?.type === 5) ? fixA : (b?.type === 5 ? fixB : null);

    if (ballFix && boostFix) {
      activeBoosts = activeBoosts.filter(pair => pair[1] !== boostFix);
    }
  });
  let prevT = performance.now();
  let accReal = 0;
  const physicsPeriod = 1 / PHYSICS.physicsHz;
  const step = () => {
    const now = performance.now();
    let dtReal = (now - prevT) / 1000;
    prevT = now;
    if (dtReal > PHYSICS.maxPhysicsCatchUpSec) dtReal = PHYSICS.maxPhysicsCatchUpSec;
    accReal += dtReal;
    let guard = 0;
    const maxSteps = Math.ceil(PHYSICS.maxPhysicsCatchUpSec / physicsPeriod) + 2;
    while (accReal >= physicsPeriod && !simStopped && guard < maxSteps) {
      if (activeBoosts.length > 0) {
        for (const fixGroup of activeBoosts) {
          fixGroup[0].getBody().applyLinearImpulse(fixGroup[1].getUserData().dir, fixGroup[0].getBody().getWorldCenter(), true);
        }
      }
      if (pendingSpawns.length > 0) {
        for (const spawnGroup of pendingSpawns) {
          const spawnPos = spawnGroup[0];
          const spawnImpulse = spawnGroup[1];
          const spawnBallBoxFix = spawnGroup[2];
          const newBallBody = world.createDynamicBody({
            position: spawnPos,
          });
          const newBallFix = newBallBody.createFixture(pl.Circle(PHYSICS.ballRadius), {
            density: PHYSICS.ballDensity,
            friction: PHYSICS.ballFriction,
            restitution: PHYSICS.ballRestitution,
          });
          newBallBody.applyLinearImpulse(spawnImpulse, newBallBody.getWorldCenter(), true);
          newBallFix.setUserData({type: -1});
          spawnBallBoxFix.getUserData().active = false;
        }
        pendingSpawns = [];
      }
      if (pendingTps.length > 0) {
        for (const tpGroup of pendingTps) {
          const tpPos = tpGroup[0];
          const tpImpulse = tpGroup[1];
          const tpBallBody = tpGroup[2];
          tpBallBody.setPosition(tpPos);
          tpBallBody.applyLinearImpulse(tpImpulse, tpBallBody.getWorldCenter(), true);
        }
        pendingTps = [];
      }
      world.step(
        PHYSICS.physicsPeriod,
        PHYSICS.stepVelocityIterations,
        PHYSICS.stepPositionIterations
      );
      if (timeStart) document.getElementById("totalTime").innerHTML = ((performance.now() - timeStart) / 1000).toFixed(2);
      accReal -= physicsPeriod;
      guard++;
    }
    draw();
    if (simStopped) {
      runFrame = null;
      return;
    }
    runFrame = requestAnimationFrame(step);
  };
  runFrame = requestAnimationFrame(step);
}
