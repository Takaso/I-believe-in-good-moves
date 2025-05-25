// Use this script to bypass CSP

(function () {
  // inject custom CSS
  const style = document.createElement("style");
  style.textContent = `
    .observer-gui {
      position: fixed;
      top: 1.5rem;
      left: 1.5rem;
      width: 20rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      border-radius: 1.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border: 2px solid #d1d5db;
      z-index: 50;
      color: #111827;
      font-family: sans-serif;
    }
    .observer-gui.dark {
      background: rgba(31, 41, 55, 0.8);
      border-color: #374151;
      color: #f3f4f6;
    }
    .observer-header {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      cursor: move;
      user-select: none;
    }
    .observer-field {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .observer-field label {
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }
    .observer-field input[type="number"],
    .observer-field select {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 1rem;
      background: #fff;
      color: #111827;
      font-size: 1rem;
    }
    .observer-field input[type="number"]::-webkit-inner-spin-button {
      margin: 0;
    }
    .observer-field input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
    }
    .observer-btn {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 1rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .observer-btn.start {
      background-color: #3b82f6;
      color: #fff;
    }
    .observer-btn.start:hover {
      background-color: #2563eb;
    }
    .observer-btn.stop {
      background-color: #ef4444;
      color: #fff;
    }
    .observer-btn.stop:hover {
      background-color: #dc2626;
    }
    .observer-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: transparent;
      z-index: 9999;
      pointer-events: all;
    }
    .observer-countdown {
      position: fixed;
      top: 0.625rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.625rem 1.25rem;
      background: #000;
      color: #fff;
      font-size: 1.25rem;
      border-radius: 0.5rem;
      z-index: 10000;
    }
  `;
  document.head.appendChild(style);

  // main GUI
  const GUI = document.createElement("div");
  GUI.className = "observer-gui";
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    GUI.classList.add("dark");
  }

  const header = document.createElement("h1");
  header.textContent = "♟️ I believe in good moves";
  header.className = "observer-header";
  GUI.appendChild(header);

  const field = document.createElement("div");
  field.className = "observer-field";

  // bot toggle
  const botContainer = document.createElement("div");
  botContainer.style.display = "flex";
  botContainer.style.alignItems = "center";
  botContainer.style.gap = "0.5rem";
  const botToggle = document.createElement("input");
  botToggle.type = "checkbox";
  botToggle.id = "playBot";
  const botLabel = document.createElement("label");
  botLabel.htmlFor = "playBot";
  botLabel.textContent = "Playing vs Bot?";
  botContainer.appendChild(botToggle);
  botContainer.appendChild(botLabel);
  field.appendChild(botContainer);

  // color select
  const colorLabel = document.createElement("label");
  colorLabel.textContent = "Your color:";
  const colorSelect = document.createElement("select");
  ["White", "Black"].forEach(col => {
    const o = document.createElement("option");
    o.value = col.toLowerCase();
    o.textContent = col;
    colorSelect.appendChild(o);
  });
  field.appendChild(colorLabel);
  field.appendChild(colorSelect);

  // think time
  const timeLabel = document.createElement("label");
  timeLabel.textContent = "Think time (sec):";
  const timeInput = document.createElement("input");
  timeInput.type = "number";
  timeInput.value = 30;
  timeInput.min = 1;
  timeInput.max = 300;
  field.appendChild(timeLabel);
  field.appendChild(timeInput);

  // start/stop button
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Start Observer";
  toggleBtn.className = "observer-btn start";
  field.appendChild(toggleBtn);

  GUI.appendChild(field);
  document.body.appendChild(GUI);

  // drag logic
  let dragging = false, offX = 0, offY = 0;
  header.addEventListener("mousedown", e => {
    dragging = true;
    const r = GUI.getBoundingClientRect();
    offX = e.clientX - r.left;
    offY = e.clientY - r.top;
  });
  document.addEventListener("mousemove", e => {
    if (dragging) {
      GUI.style.left = `${e.clientX - offX}px`;
      GUI.style.top = `${e.clientY - offY}px`;
    }
  });
  document.addEventListener("mouseup", () => { dragging = false; });

  // observer state
  let observer = null, state = "idle";
  let overlay, countdown, intervalId;

  function blockFor(seconds) {
    overlay = document.createElement("div");
    overlay.className = "observer-overlay";
    document.body.appendChild(overlay);

    countdown = document.createElement("div");
    countdown.className = "observer-countdown";
    countdown.textContent = seconds;
    document.body.appendChild(countdown);

    let t = seconds;
    intervalId = setInterval(() => {
      t--;
      countdown.textContent = t;
      if (t <= 0) {
        clearInterval(intervalId);
        overlay.remove();
        countdown.remove();
        state = "waitingOpponent";
        console.log("Your turn");
      }
    }, 1000);
  }

  function startObs() {
    const yourColor = colorSelect.value[0]; // 'w' or 'b'
    const oppColor = yourColor === "w" ? "b" : "w";
    state = "waitingOpponent";
    if (observer) observer.disconnect();
    observer = new MutationObserver(muts => {
      muts.forEach(m => {
        if (m.type === "attributes" && m.attributeName === "class") {
          const cls = m.target.className;
          if (state === "waitingOpponent" && cls.includes(`piece ${oppColor}`)) {
            console.log("Opponent moved");
            state = "blocking";
            blockFor(parseInt(timeInput.value, 10));
          } else if (state === "waitingUser" && cls.includes(`piece ${yourColor}`)) {
            console.log("Your move registered");
            state = "waitingOpponent";
          }
        } else if (m.type === "childList") {
          m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && state === "waitingUser" && n.className.includes(`piece ${yourColor}`)) {
              console.log("Your move");
              state = "waitingOpponent";
            }
          });
        }
      });
    });
    const boardSel = botToggle.checked ? "#board-play-computer" : "#board-single";
    const board = document.querySelector(boardSel);
    if (!board) return alert("Board missing, bozo");
    observer.observe(board, { attributes: true, subtree: true, attributeFilter: ["class"], childList: true });
    state = "waitingUser";
    toggleBtn.textContent = "Stop Observer";
    toggleBtn.className = "observer-btn stop";
    console.log("Observer started on", boardSel);
  }

  function stopObs() {
    if (observer) observer.disconnect();
    state = "idle";
    toggleBtn.textContent = "Start Observer";
    toggleBtn.className = "observer-btn start";
    console.log("Observer stopped");
  }

  toggleBtn.addEventListener("click", () => {
    state === "idle" ? startObs() : stopObs();
  });
})();
