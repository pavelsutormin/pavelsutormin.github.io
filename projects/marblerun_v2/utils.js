function graphicsDashedLine(graphics, startX, startY, endX, endY, dashLength, gapLength) {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const nx = dx / distance;
    const ny = dy / distance;

    let progress = 0;
    let drawing = true;

    graphics.moveTo(startX, startY);

    while (progress < distance) {
        const currentLength = drawing ? dashLength : gapLength;
        const step = Math.min(currentLength, distance - progress);
        const targetX = startX + nx * (progress + step);
        const targetY = startY + ny * (progress + step);

        if (drawing) {
            graphics.lineTo(targetX, targetY);
        } else {
            graphics.moveTo(targetX, targetY);
        }

        progress += step;
        drawing = !drawing;
    }
}

function createPixiButton(text, x, y, width, height, onClick) {
    const container = new PIXI.Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';

    const bg = new PIXI.Graphics();
    const drawBg = (color) => {
        bg.clear()
          .rect(0, 0, width, height)
          .fill(color)
          .stroke({width: 2, color: 0x555555});
    };

    drawBg(0x232323); 

    const label = new PIXI.Text({text, style: baseTextStyle});
    label.anchor.set(0.5);
    label.position.set(width / 2, height / 2);

    container.addChild(bg, label);

    container.on("pointerover", () => drawBg(0x333333));
    container.on("pointerout", () => drawBg(0x232323));
    container.on("pointerdown", onClick);

    container.x = x;
    container.y = y;

    return container;
}

function marblerunAtConvert(origTrack) {
  let track = [];
  for (var i = 0; i < origTrack.length; i++) {
    let b = origTrack[i];
    if (b.type == "Brick") {
      track.push({x: b.col, y: b.row, id: 0});
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

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}