const controls = document.getElementById("controls");
const floatingBrick = document.getElementById("floatingBrick");
const floatingBrickCtx = floatingBrick.getContext("2d");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const debug = false;

let mouseX = 0;
let mouseY = 0;

let selectedBrick;

let lastPlaced;
let lastRotation;

function drawBackground() {
  ctx.fillStyle = "#FDFD00";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
  ctx.strokeStyle = "rgba(85, 85, 85, 0.5)";
  ctx.lineWidth = 1;
  ctx.setLineDash([5.5, 3.5]);

  for (let i = 1; i < fieldHeight; i++) {
    ctx.beginPath();
    ctx.moveTo(0.5, i * cellSize + 0.5);
    ctx.lineTo(fieldWidth * cellSize + 0.5, i * cellSize + 0.5);
    ctx.stroke();
  }

  for (let i = 1; i < fieldWidth; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize + 0.5, 0.5);
    ctx.lineTo(i * cellSize + 0.5, fieldHeight * cellSize + 0.5);
    ctx.stroke();
  }
  
  ctx.setLineDash([]);
}

function drawBricks() {
  for (let i = 0; i < bricks.length; i++) {
    bricks[i].draw();
  }
}

function drawSelect() {
  if (!(mouseX >= 0 && mouseX < fieldWidth && mouseY >= 0 && mouseY < fieldHeight)) return;
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(mouseX * cellSize, mouseY * cellSize, cellSize + 1, cellSize + 1);
}

function floatingBrickSetType(type) {
  floatingBrickCtx.clearRect(0, 0, cellSize + 1, cellSize + 1);
  floatingBrickCtx.fillStyle = "#000000";
  floatingBrickCtx.strokeStyle = "#DDDDDD";
  floatingBrickCtx.lineWidth = 0.5;
  drawAnyBrick(floatingBrickCtx, 0, 0, type, bricks[selectedBrick].rad);
}

function brickPut() {
  if (selectedBrick != null) {
    if (mouseX >= 0 && mouseX < fieldWidth && mouseY >= 0 && mouseY < fieldHeight) {
      for (let i = 0; i < bricks.length; i++) {
        if (bricks[i].x == mouseX && bricks[i].y == mouseY) {
          //bricks.splice(i, 1);
          break;
        }
      }
      lastPlaced = bricks[selectedBrick].type;
      lastRotation = bricks[selectedBrick].rad;
      bricks[selectedBrick].x = mouseX;
      bricks[selectedBrick].y = mouseY;
      bricks[selectedBrick].visible = true;
      selectedBrick = null;
      floatingBrick.style.visibility = "hidden";
    } else {
      bricks.splice(selectedBrick, 1);
      selectedBrick = null;
      floatingBrick.style.visibility = "hidden";
    }
    initPlanck();
  }
}

function brickPick() {
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].x == mouseX && bricks[i].y == mouseY) {
      bricks[i].visible = false;
      selectedBrick = i;
      floatingBrick.style.visibility = "visible";
      floatingBrickSetType(bricks[i].type);
      return true;
    }
  }
  return false;
}

function draw() {
  drawBackground();
  drawGrid();
  drawBricks();
  drawBalls(ctx);
  drawSelect();

  if (debug) {
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 1;
    if (ballPositions.length > 2) {
      ctx.beginPath();
      ctx.moveTo(ballPositions[0].x * cellSize, (fieldHeight - ballPositions[0].y) * cellSize);
      for (let i = 1; i < ballPositions.length; i++) {
          ctx.lineTo(ballPositions[i].x * cellSize, (fieldHeight - ballPositions[i].y) * cellSize);
      }
      ctx.stroke();
    }

    if (world) drawBodies(ctx, world);
  }
}

canvas.width = fieldWidth * cellSize;
canvas.height = fieldHeight * cellSize;
floatingBrick.width = cellSize + 1;
floatingBrick.height = cellSize + 1;
controls.style.height = `${fieldHeight * cellSize}px`;

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(id => {
    const canvasEl = document.getElementById(`floatingBrickSrc${id}`);
    canvasEl.width = (id === 10) ? cellSize * 2 + 1 : cellSize + 1;
    canvasEl.height = cellSize + 1;
    const ctxEl = canvasEl.getContext("2d");
    ctxEl.fillStyle = "#000000";
    ctxEl.strokeStyle = "#DDDDDD";
    ctxEl.lineWidth = 0.5;
    
    drawAnyBrick(ctxEl, 0, 0, id, 0);

    canvasEl.addEventListener('pointerdown', (event) => {
      if (selectedBrick == null) {
        var i = bricks.push(new Brick(0, 0, id, 0)) - 1;
        bricks[i].visible = false;
        selectedBrick = i;
        floatingBrick.style.visibility = "visible";
        floatingBrickSetType(bricks[i].type);
      }
    });
});

document.body.addEventListener('mousemove', (event) => {
  floatingBrick.style.left = event.clientX - 20 + "px";
  floatingBrick.style.top = event.clientY - 20 + "px";
  const rect = canvas.getBoundingClientRect();
  mouseX = Math.round((event.clientX - rect.left) / 32 - 0.5);
  mouseY = Math.round((event.clientY - rect.top) / 32 - 0.5);
  draw();
});

document.body.addEventListener('pointerdown', (event) => {
  if (event.button === 0) {
    if (mouseX >= 0 && mouseX < fieldWidth && mouseY >= 0 && mouseY < fieldHeight) {
      if (!brickPick() && lastPlaced != null && lastRotation != null) {
        bricks.push(new Brick(mouseX, mouseY, lastPlaced, lastRotation));
        initPlanck();
      }
    }
  } else if (event.button === 1) {
    let deleted = false;
    bricks = bricks.filter(b => {
      if (b.x == mouseX && b.y == mouseY) {
        deleted = true;
        return false;
      }
      return true;
    });
    if (deleted) initPlanck();
  } else if (event.button === 2) {
    let rotated = false;
    for (let i = 0; i < bricks.length; i++) {
      if (bricks[i].x == mouseX && bricks[i].y == mouseY) {
        bricks[i].rad += Math.PI / 2;
        lastPlaced = bricks[i].type;
        lastRotation = bricks[i].rad;
        rotated = true;
      }
    }
    if (rotated) initPlanck();
  }
  draw();
});

document.body.addEventListener('pointerup', (event) => {
  if (event.button === 0) {
    brickPut();
  }
  draw();
});

document.getElementById("buttonRun").addEventListener('click', (event) => {
  initPlanck();
  startRun(bricks);
});

document.getElementById("buttonClear").addEventListener('click', (event) => {
  bricks = [];
  initPlanck();
  draw();
});

document.getElementById("buttonSave").addEventListener('click', (event) => {
  let track = saveTrack();
  localStorage.setItem('track', JSON.stringify(track));
  draw();
});

document.getElementById("buttonLoad").addEventListener('click', (event) => {
  let track = localStorage.getItem('track');
  if (track == null) {
    alert("No savedata found!");
    return;
  }
  track = JSON.parse(track);
  loadTrack(track);
  initPlanck();
  draw();
});

document.getElementById("buttonExport").addEventListener('click', (event) => {
  let track = saveTrack();
  downloadData(JSON.stringify(track), "track.json");
  draw();
});

document.getElementById("buttonImport").addEventListener('click', (event) => {
  openClassicPicker()
    .then((trackStr) => {
      trackStr = JSON.parse(track);
      loadTrack(track);
      initPlanck();
      draw();
    })
    .catch((err) => {
      console.log(err);
    });
    draw();
});

document.getElementById("buttonPublish").addEventListener('click', (event) => {
  let name = prompt("Enter name of track: (empty for no name)");
  if (name != null) name = name.trim();
  if (name === '') name = null;
  let track = [];
  for (let i = 0; i < bricks.length; i++) {
    let b = bricks[i];
    track.push({x: b.x, y: b.y, type: b.type, rad: b.rad});
  }
  publishData(name, JSON.stringify(track));
  draw();
});

document.getElementById("buttonMarblerunAt").addEventListener('click', (event) => {
  let id = document.getElementById("inputMarblerunAt").value;
  if (id.trim() !== '' && !isNaN(Number(id))) {
    loadFromMarblerunAt(Number(id))
      .then((track) => {
        bricks = track;
        initPlanck();
        draw();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const firestoreId = urlParams.get('firestoreId');
  let trackRawData = null;

  if (firestoreId) {
    try {
      const doc = await collection.doc(firestoreId).get();
      if (doc.exists) {
        trackRawData = doc.data().data; 
      }
    } catch (error) {
      console.error("Error getting Firestore document: ", error);
    }
  }

  if (!trackRawData) {
    trackRawData = localStorage.getItem('track');
  }

  if (trackRawData) {
    const track = typeof trackRawData === 'string' ? JSON.parse(trackRawData) : trackRawData;
    loadTrack(track);
  }

  initPlanck();
  draw();
});