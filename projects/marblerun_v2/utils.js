function drawDashedLine(graphics, startX, startY, endX, endY, dashLength, gapLength) {
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

function marblerunAtConvert(origTrack) {
  let track = [];
  for (var i = 0; i < origTrack.length; i++) {
    let b = origTrack[i];
    if (b.type == "Brick") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 0});
    } else if (b.type == "Ramp") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 1});
    } else if (b.type == "Kicker") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 2});
    } else if (b.type == "Curve") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 3});
    } else if (b.type == "Exit") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 4});
    } else if (b.type == "Boost") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 5});
    } else if (b.type == "Line") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 6});
    } else if (b.type == "BallBox") {
      track.push({x: b.col, y: b.row, rot: b.rotation * (Math.PI / 2), id: 7});
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
    return docRef.id;
  }).catch((error) => {
    console.error("Error publishing track: ", error);
  });
}