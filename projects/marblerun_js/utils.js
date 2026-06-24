const cellSize = 32;
const fieldWidth = 10;
const fieldHeight = 15;

const urlParams = new URLSearchParams(window.location.search);

const pl = planck;

let PHYSICS;

/*if (urlParams.has("oldphysics")) {
  PHYSICS = { // As close to the original as possible
    gravity: 9.81,
    physicsHz: 120,
    physicsPeriod: 0.02,
    stepVelocityIterations: 20,
    stepPositionIterations: 0,
    maxPhysicsCatchUpSec: 0.25,
    ballRadius: 0.25,
    ballDensity: 2,
    ballFriction: 0.9,
    ballRestitution: 0,
    staticFriction: 0.9,
    staticRestitution: 0,
  };
} else {
  PHYSICS = { // My custom values
    gravity: 20.0,
    physicsHz: 120,
    physicsPeriod: 1 / 120,
    stepVelocityIterations: 20,
    stepPositionIterations: 20,
    maxPhysicsCatchUpSec: 0.25,
    ballRadius: 0.25,
    ballDensity: 1.0,
    ballFriction: 0.3,
    ballRestitution: 0.2,
    staticFriction: 0.1, 
    staticRestitution: 0.1
  };
}*/
PHYSICS = { // As close to the original as possible
  gravity: 9.81,
  physicsHz: 120,
  physicsPeriod: 0.02,
  stepVelocityIterations: 20,
  stepPositionIterations: 0,
  maxPhysicsCatchUpSec: 0.25,
  ballRadius: 0.25,
  ballDensity: 2,
  ballFriction: 0.9,
  ballRestitution: 0,
  staticFriction: 0.9,
  staticRestitution: 0,
};

class Brick {
  constructor(x, y, type, rad) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.rad = rad;
    this.visible = true;
  }

  draw() {
    if (this.visible) {
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#DDDDDD";
      ctx.lineWidth = 0.5;
      drawAnyBrick(ctx, this.x, this.y, this.type, this.rad)
    }
  }
}

let bricks = [];

function downloadData(data, filename) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function openClassicPicker() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject("No file selected");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    };
    input.click();
  });
}

function drawBodies(ctx, world) {
  ctx.strokeStyle = "#0000FF";
  ctx.lineWidth = 1;

  for (let body = world.getBodyList(); body; body = body.getNext()) {
    drawBody(ctx, body);
  }
}

function drawBody(ctx, body) {
  const pos = body.getPosition();
  const angle = body.getAngle();

  ctx.save();

  const canvasX = pos.x * cellSize;
  const canvasY = (fieldHeight - pos.y) * cellSize;
  ctx.translate(canvasX, canvasY);
  ctx.rotate(-angle);

  for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
    const shape = fixture.getShape();
    const type = shape.getType();

    ctx.beginPath();

    if (type === 'polygon') {
      const vertices = shape.m_vertices;
      const v0 = vertices[0];
      ctx.moveTo(v0.x * cellSize, -v0.y * cellSize);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x * cellSize, -vertices[i].y * cellSize);
      }
      ctx.lineTo(vertices[0].x * cellSize, -vertices[0].y * cellSize);
      ctx.moveTo(0, 0);
      ctx.lineTo(cellSize / 2, 0);
      ctx.closePath();
    } 
    else if (type === 'circle') {
      const radius = shape.m_radius * cellSize;
      const center = shape.m_p;

      ctx.arc(center.x * cellSize, -center.y * cellSize, radius, 0, Math.PI * 2);
      
      ctx.moveTo(center.x * cellSize, -center.y * cellSize);
      ctx.lineTo((center.x + 0.5) * cellSize, -center.y * cellSize);
    }

    ctx.stroke();
  }

  ctx.restore();
}

function addCurveInFixtures(body, mat) {
  const numberOfSegments = 6;
  const angle = Math.PI / 2 / numberOfSegments;

  let circleVector = pl.Vec2(-Math.cos(angle), Math.sin(angle));
  let lineVector = pl.Vec2(-1.0, Math.tan(angle));

  for (let i = 0; i < numberOfSegments; i++) {
    let vertices = [];

    if (i === 0) {
      vertices.push(pl.Vec2(-0.5, -0.5));
      vertices.push(pl.Vec2(circleVector.x + 0.5, circleVector.y - 0.5));
      vertices.push(pl.Vec2(lineVector.x + 0.5, lineVector.y - 0.5));
    } else if (i === numberOfSegments - 1) {
      vertices.push(pl.Vec2(0.5, 0.5));
      vertices.push(pl.Vec2(lineVector.x + 0.5, lineVector.y - 0.5));
      vertices.push(pl.Vec2(circleVector.x + 0.5, circleVector.y - 0.5));
    } else {
      let newCircleVector = pl.Vec2(-Math.cos((i + 1) * angle), Math.sin((i + 1) * angle));
      let newLineVector;

      if (i >= numberOfSegments / 2) {
        let n = numberOfSegments - i - 1;
        newLineVector = pl.Vec2(-Math.tan(n * angle), 1.0);
      } else {
        newLineVector = pl.Vec2(-1.0, Math.tan((i + 1) * angle));
      }

      vertices.push(pl.Vec2(circleVector.x + 0.5, circleVector.y - 0.5));
      vertices.push(pl.Vec2(newCircleVector.x + 0.5, newCircleVector.y - 0.5));
      vertices.push(pl.Vec2(newLineVector.x + 0.5, newLineVector.y - 0.5));
      vertices.push(pl.Vec2(lineVector.x + 0.5, lineVector.y - 0.5));

      circleVector = newCircleVector;
      lineVector = newLineVector;
    }

    const shape = pl.Polygon(vertices);
    body.createFixture(shape, mat);
  }
}

function createCurveOutShape() {
  const vertices = [];
  const numberOfSegments = 6;
  const angleStep = Math.PI / 2 / numberOfSegments;

  vertices.push(pl.Vec2(-0.5, 0.5));

  for (let i = numberOfSegments; i >= 0; i--) {
    const x = Math.cos(angleStep * i) - 0.5;
    const y = -Math.sin(angleStep * i) + 0.5;
    vertices.push(pl.Vec2(x, y));
  }

  return pl.Polygon(vertices);
}

function marblerunAtConvert(origTrack) {
  let track = [];
  for (var i = 0; i < origTrack.length; i++) {
    let b = origTrack[i];
    console.log(b.type);
    if (b.type == "Brick") {
      track.push(new Brick(b.col, b.row, 0, b.rotation * (Math.PI / 2)));
    } else if (b.type == "Ramp") {
      track.push(new Brick(b.col, b.row, 1, b.rotation * (Math.PI / 2)));
    } else if (b.type == "Kicker") {
      track.push(new Brick(b.col, b.row, 2, b.rotation * (Math.PI / 2)));
    } else if (b.type == "Curve") {
      track.push(new Brick(b.col, b.row, 3, b.rotation * (Math.PI / 2)));
    } else if (b.type == "Exit") {
      track.push(new Brick(b.col, b.row, 4, b.rotation * (Math.PI / 2)));
    } else if (b.type == "Boost") {
      track.push(new Brick(b.col, b.row, 5, b.rotation * (Math.PI / 2)));
    } else if (b.type == "Line") {
      track.push(new Brick(b.col, b.row, 6, b.rotation * (Math.PI / 2)));
    } else if (b.type == "BallBox") {
      track.push(new Brick(b.col, b.row, 7, b.rotation * (Math.PI / 2)));
    }
  }
  return track;
}

async function loadFromMarblerunAt(trackId) {
  const res = await fetch(`https://www.marblerun.at/tracks/${trackId}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    console.err("Error!");
    return;
  }
  const data = await res.json();
  return marblerunAtConvert(Object.values(data.track.json.bricks));
}

const firebaseConfig = {
  apiKey: "AIzaSyDpd5UGaLwWoa6YPDvgip2P6k1KvWTSHno",
  authDomain: "sutormin-org.firebaseapp.com",
  projectId: "sutormin-org",
  storageBucket: "sutormin-org.firebasestorage.app",
  messagingSenderId: "545602955870",
  appId: "1:545602955870:web:71a68ca48c92fdb381e2cf"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const collection = db.collection("marblerun");

async function publishData(name, data) {
  collection.add({
    name: name,
    data: data,
    timestamp: new Date()
  }).then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  }).catch((error) => {
    console.error("Error adding document: ", error);
  });
}