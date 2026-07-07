function drawBrick(ctx, x, y, rad) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const half = cellSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);

    ctx.fillRect(-half + 0.5, -half + 0.5, cellSize, cellSize);
    ctx.strokeRect(-half + 0.5, -half + 0.5, cellSize, cellSize);

    ctx.restore();
}

function drawSlope(ctx, x, y, rad) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const half = cellSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);

    ctx.beginPath();
    ctx.moveTo(-half + 0.5, -half + 0.5);
    ctx.lineTo(-half + 0.5,  half + 0.5);
    ctx.lineTo( half + 0.5,  half + 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawInCurve(ctx, x, y, rad) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const half = cellSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);

    ctx.beginPath();
    ctx.moveTo(-half + 0.5, -half + 0.5);
    ctx.lineTo(-half + 0.5, -half + 0.5);
    ctx.bezierCurveTo(-half + 0.5, 0.5, 0.5, half + 0.5, half + 0.5, half + 0.5);
    ctx.lineTo(half + 0.5, half + 0.5);
    ctx.lineTo(-half + 0.5, half + 0.5);
    ctx.lineTo(-half + 0.5, -half + 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawOutCurve(ctx, x, y, rad) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const half = cellSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);

    ctx.beginPath();
    ctx.moveTo(-half + 0.5, -half + 0.5);
    ctx.bezierCurveTo(0.5, -half + 0.5, half + 0.5, 0.5, half + 0.5, half + 0.5);
    ctx.lineTo(-half + 0.5, half + 0.5);
    ctx.lineTo(-half + 0.5, -half + 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawFinish(ctx, x, y, rad) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const half = cellSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);

    var checkerBoardSize = 5;
    var checkerSize = cellSize / checkerBoardSize;
    var counter = 0;
    var i, j;

    for (i = 0; i < checkerBoardSize; i++) {
      for (j = 0; j < checkerBoardSize; j++) {
        if (counter % 2 === 0) {
          ctx.fillRect(checkerSize * j - half + 0.5, checkerSize * i - half + 0.5, checkerSize, checkerSize);
          ctx.strokeRect(checkerSize * j - half + 0.5, checkerSize * i - half + 0.5, checkerSize, checkerSize);
        }
        counter++;
      }
    }

    ctx.restore();
}

function drawBoost(ctx, x, y, rad) {
    const centerX = x * cellSize + cellSize / 2;
    const centerY = y * cellSize + cellSize / 2;
    const half = cellSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);

    ctx.beginPath();
    ctx.moveTo(cellSize / 7 - half, cellSize * 3 / 14 - half);
    ctx.lineTo(cellSize * 2 / 7 - half, cellSize * 3 / 14 - half);
    ctx.lineTo(cellSize * 4 / 7 - half, cellSize / 2 - half);
    ctx.lineTo(cellSize * 2 / 7 - half, cellSize * 11 / 14 - half);
    ctx.lineTo(cellSize / 7 - half, cellSize * 11 / 14 - half);
    ctx.lineTo(cellSize * 3 / 7 - half, cellSize / 2 - half);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cellSize * 3 / 7 - half, cellSize * 3 / 14 - half);
    ctx.lineTo(cellSize * 4 / 7 - half, cellSize * 3 / 14 - half);
    ctx.lineTo(cellSize * 6 / 7 - half, cellSize / 2 - half);
    ctx.lineTo(cellSize * 4 / 7 - half, cellSize * 11 / 14 - half);
    ctx.lineTo(cellSize * 3 / 7 - half, cellSize * 11 / 14 - half);
    ctx.lineTo(cellSize * 5 / 7 - half, cellSize / 2 - half);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawLine(ctx, x, y, rad) {
  const centerX = x * cellSize + cellSize / 2;
  const centerY = y * cellSize + cellSize / 2;
  const half = cellSize / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rad);

  ctx.fillRect(-half + 0.5, -half + 0.5, cellSize, cellSize / 7);
  ctx.strokeRect(-half + 0.5, -half + 0.5, cellSize, cellSize / 7);

  ctx.restore();
}

function drawBallBox(ctx, x, y, rad) {
  const centerX = x * cellSize + cellSize / 2;
  const centerY = y * cellSize + cellSize / 2;
  const half = cellSize / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rad);

  ctx.fillRect(-half + 0.5, -half + 0.5, cellSize, cellSize);
  ctx.strokeRect(-half + 0.5, -half + 0.5, cellSize, cellSize);
  ctx.beginPath();
  ctx.moveTo(cellSize * 5 / 7 - half, cellSize * 5 / 14  - half);
  ctx.lineTo(cellSize / 2 - half, cellSize * 9 / 14 - half);
  ctx.lineTo(cellSize * 2 / 7 - half, cellSize * 5 / 14 - half);
  ctx.closePath();
  ctx.fillStyle = "#800000";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawTpBox(ctx, x, y, rad) {
  const centerX = x * cellSize + cellSize / 2;
  const centerY = y * cellSize + cellSize / 2;
  const half = cellSize / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rad);

  ctx.fillRect(-half + 0.5, -half + 0.5, cellSize, cellSize);
  ctx.strokeRect(-half + 0.5, -half + 0.5, cellSize, cellSize);
  ctx.beginPath();
  ctx.moveTo(cellSize * 5 / 7 - half, cellSize * 5 / 14  - half);
  ctx.lineTo(cellSize / 2 - half, cellSize * 9 / 14 - half);
  ctx.lineTo(cellSize * 2 / 7 - half, cellSize * 5 / 14 - half);
  ctx.closePath();
  ctx.fillStyle = "#000080";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawSpike(ctx, x, y, rad) {
  const centerX = x * cellSize + cellSize / 2;
  const centerY = y * cellSize + cellSize / 2;
  const half = cellSize / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rad);

  ctx.beginPath();
  ctx.moveTo(-half + 0.5, half + 0.5);
  ctx.lineTo(half + 0.5, half + 0.5);
  ctx.lineTo(0, -half + 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawLongSlope(ctx, x, y, rad) {
  const centerX = x * cellSize + cellSize / 2;
  const centerY = y * cellSize + cellSize / 2;
  const half = cellSize / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rad);

  ctx.beginPath();
  ctx.moveTo(-half + 0.5, -half + 0.5);
  ctx.lineTo(-half + 0.5,  half + 0.5);
  ctx.lineTo( half * 3 + 0.5,  half + 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawAnyBrick(ctx, x, y, type, rad) {
  if (type === 0) drawBrick(ctx, x, y, rad);
  if (type === 1) drawSlope(ctx, x, y, rad);
  if (type === 2) drawInCurve(ctx, x, y, rad);
  if (type === 3) drawOutCurve(ctx, x, y, rad);
  if (type === 4) drawFinish(ctx, x, y, rad);
  if (type === 5) drawBoost(ctx, x, y, rad);
  if (type === 6) drawLine(ctx, x, y, rad);
  if (type === 7) drawBallBox(ctx, x, y, rad);
  if (type === 8) drawTpBox(ctx, x, y, rad);
  if (type === 9) drawSpike(ctx, x, y, rad);
  if (type === 10) drawLongSlope(ctx, x, y, rad);
}