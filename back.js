const map = L.map("map").setView([53.4464075, 14.4927048], 15);

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: "© Esri, Maxar, Earthstar Geographics"
}).addTo(map);


document.getElementById("btn-locate").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolokalizacja niedostępna");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;

      map.setView([latitude, longitude], 17);
    },
    err => {
      alert("Błąd geolokalizacji");
      console.error(err);
    }
  );
});


let lastCanvas = null;

document.getElementById("btn-download").addEventListener("click", () => {
  leafletImage(map, function(err, canvas) {
    if (err) {
      console.error(err);
      return;
    }

    lastCanvas = canvas;
    generatePuzzlePieces();
  });
});


function generatePuzzlePieces() {
  if (!lastCanvas) return;

  const w = lastCanvas.width;
  const h = lastCanvas.height;

  const pw = Math.floor(w / 4);
  const ph = Math.floor(h / 4);

  window.pieceWidth = pw;
  window.pieceHeight = ph;

  const pieces = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {

      const pc = document.createElement("canvas");
      pc.width = pw;
      pc.height = ph;

      const ctx = pc.getContext("2d");
      ctx.drawImage(
        lastCanvas,
        c * pw, r * ph, pw, ph,
        0, 0, pw, ph
      );

      pieces.push({
        row: r,
        col: c,
        canvas: pc
      });
    }
  }

  pieces.sort(() => Math.random() - 0.5);

  const stol = document.getElementById("stol");
  stol.innerHTML = "";

  pieces.forEach((p, i) => {
    const img = document.createElement("img");
    img.className = "piece";
    img.src = p.canvas.toDataURL();
    img.draggable = true;
    img.dataset.row = p.row;
    img.dataset.col = p.col;
    
    img.style.width = pw + "px";
    img.style.height = ph + "px";

    img.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", i);
    });

    p.element = img;
    stol.appendChild(img);
  });

  window.pieces = pieces;
  setupTargets();
}


function setupTargets() {
  const box = document.getElementById("ukladanka");
  box.innerHTML = "";

  const targets = [];

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const div = document.createElement("div");
      div.className = "target";
      div.dataset.row = r;
      div.dataset.col = c;

      div.addEventListener("dragover", e => e.preventDefault());
      div.addEventListener("drop", onDrop);

      targets.push(div);
      box.appendChild(div);
    }
  }

  window.targets = targets;
}


function onDrop(e) {
    e.preventDefault();
  
    const pieceIndex = e.dataTransfer.getData("text/plain");
    const draggedPiece = window.pieces[pieceIndex];
    const draggedElem = draggedPiece.element;

    const target = e.currentTarget;
    const existing = target.firstChild;

    const previousParent = draggedElem.parentElement;
  
    target.innerHTML = "";
    target.appendChild(draggedElem);
  
    target.dataset.currentRow = draggedPiece.row;
    target.dataset.currentCol = draggedPiece.col;
  
    if (existing && existing !== draggedElem) {
  
      if (previousParent.classList.contains("target")) {
        previousParent.innerHTML = "";
        previousParent.appendChild(existing);
      } else {
        document.getElementById("stol").appendChild(existing);
      }
    }
  
    checkWin();
  }


function checkWin() {
  const targets = window.targets;

  for (let t of targets) {
    if (!t.firstChild) return false;

    if (
      t.dataset.row != t.dataset.currentRow ||
      t.dataset.col != t.dataset.currentCol
    ) {
      return false;
    }
  }

  console.log("UKOŃCZONO!");

  if (Notification.permission === "granted") {
    new Notification("Gratulacje!", {
      body: "Ułożyłeś układankę!"
    });
  }

  return true;
}

if ("Notification" in window) {
  Notification.requestPermission();
}