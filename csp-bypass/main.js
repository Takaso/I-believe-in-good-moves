(function () {
    // Create style element with custom CSS
    const style = document.createElement("style");
    style.textContent = `
        /* Keyframes */
        @keyframes psychedelic { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }

        /* Main GUI */
        .chess-gui {
            position: fixed;
            top: 24px;
            left: 24px;
            width: 320px;
            padding: 24px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            border: 2px solid #d1d5db;
            z-index: 9998;
            opacity: 0;
            transition: all 0.5s;
            animation: fadeInUp 0.5s ease-out forwards;
        }

        .chess-gui.hidden {
            display: none;
        }

        .chess-gui:hover {
            transform: scale(1.05);
        }

        .dark .chess-gui {
            background: rgba(17, 24, 39, 0.8);
            border: 2px solid #374151;
        }

        /* Header */
        .chess-header {
            font-size: 1.5rem;
            font-weight: 800;
            cursor: move;
            user-select: none;
            color: #111827;
            margin-bottom: 24px;
            letter-spacing: 0.025em;
        }

        .dark .chess-header {
            color: #f3f4f6;
        }

        /* Form elements */
        .field-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .option-row {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .option-label {
            font-size: 1rem;
            font-weight: 500;
            color: #374151;
        }

        .dark .option-label {
            color: #d1d5db;
        }

        .form-label {
            font-size: 1rem;
            font-weight: 500;
            color: #374151;
        }

        .dark .form-label {
            color: #d1d5db;
        }

        .form-select, .form-input {
            width: 100%;
            padding: 8px 16px;
            background: #f3f4f6;
            color: #111827;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            outline: none;
        }

        .dark .form-select, .dark .form-input {
            background: #1f2937;
            color: #f9fafb;
            border-color: #4b5563;
        }

        .form-select:focus, .form-input:focus {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }

        /* Button */
        .action-btn {
            margin-top: 16px;
            padding: 8px 16px;
            background: linear-gradient(to right, #3b82f6, #6366f1);
            color: white;
            font-weight: 600;
            border-radius: 16px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
            border: none;
            cursor: pointer;
        }

        .action-btn:hover {
            transform: scale(1.05);
        }

        .stop-btn {
            background: linear-gradient(to right, #ef4444, #ec4899);
        }

        /* Footer */
        .credit-text {
            margin-top: 24px;
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
            font-style: italic;
        }

        .dark .credit-text {
            color: #9ca3af;
        }

        /* Combined notification container */
        .notification-container {
            position: fixed;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 16px;
            background: rgba(17, 24, 39, 0.9);
            color: white;
            font-family: monospace;
            border-radius: 12px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            z-index: 9999;
            font-size: 0.9rem;
        }

        .countdown-display {
            font-weight: 700;
            font-size: 1.1rem;
            min-width: 30px;
            text-align: center;
        }

        .message-display {
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.85rem;
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .red-msg {
            background: #ef4444;
            color: #fee2e2;
        }

        .blue-msg {
            background: #3b82f6;
            color: #dbeafe;
        }

        .animate-psychedelic {
            animation: psychedelic 2s ease-in-out infinite;
        }

        /* Toggle‐Menu Button */
        .toggle-menu-btn {
            position: fixed;
            top: 24px;
            left: 360px; /* Just to the right of the 320px‐wide GUI */
            width: 32px;
            height: 32px;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            font-size: 1.25rem;
            font-weight: bold;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: background 0.3s;
        }

        .toggle-menu-btn:hover {
            background: rgba(59, 130, 246, 1);
        }

        .toggle-menu-btn.hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);

    // Main GUI container
    const GUI = document.createElement("div");
    GUI.className = "chess-gui";

    // Header
    const header = document.createElement("h1");
    header.textContent = "♟️ I believe in good moves";
    header.className = "chess-header";
    GUI.appendChild(header);

    // Field container
    const field = document.createElement("div");
    field.className = "field-container";

    // Bot toggle
    const botContainer = document.createElement("div");
    botContainer.className = "option-row";
    const botToggle = document.createElement("input");
    botToggle.type = "checkbox";
    botToggle.id = "playBot";
    botToggle.style.width = "24px";
    botToggle.style.height = "24px";
    botToggle.style.accentColor = "#3b82f6";
    const botLabel = document.createElement("label");
    botLabel.htmlFor = "playBot";
    botLabel.textContent = "Playing vs Bot?";
    botLabel.className = "option-label";
    botContainer.append(botToggle, botLabel);
    field.appendChild(botContainer);

    // Custom message toggle
    const customContainer = document.createElement("div");
    customContainer.className = "option-row";
    const customToggle = document.createElement("input");
    customToggle.type = "checkbox";
    customToggle.id = "customMsg";
    customToggle.style.width = "24px";
    customToggle.style.height = "24px";
    customToggle.style.accentColor = "#10b981";
    const customLabel = document.createElement("label");
    customLabel.htmlFor = "customMsg";
    customLabel.textContent = "Enable custom messages?";
    customLabel.className = "option-label";
    customContainer.append(customToggle, customLabel);
    field.appendChild(customContainer);

    // Color select
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Your color:";
    colorLabel.className = "form-label";
    const colorSelect = document.createElement("select");
    colorSelect.className = "form-select";
    ["White", "Black"].forEach(color => {
        const o = document.createElement("option");
        o.value = color.toLowerCase()[0];
        o.textContent = color;
        colorSelect.appendChild(o);
    });
    field.append(colorLabel, colorSelect);

    // Think time input
    const timeLabel = document.createElement("label");
    timeLabel.textContent = "Think time (sec):";
    timeLabel.className = "form-label";
    const timeInput = document.createElement("input");
    timeInput.type = "number";
    timeInput.value = 30;
    timeInput.min = 1;
    timeInput.max = 300;
    timeInput.className = "form-input";
    field.append(timeLabel, timeInput);

    // Start/stop button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Start Observer";
    toggleBtn.className = "action-btn";
    field.appendChild(toggleBtn);
    GUI.appendChild(field);

    // Footer
    const credit = document.createElement("p");
    credit.textContent = "Made by Takaso";
    credit.className = "credit-text";
    GUI.appendChild(credit);

    document.body.appendChild(GUI);

    // Toggle‐Menu Button (to show/hide .chess-gui)
    const menuToggleBtn = document.createElement("button");
    menuToggleBtn.className = "toggle-menu-btn";
    menuToggleBtn.textContent = "✕"; // “✕” when menu is open
    document.body.appendChild(menuToggleBtn);

    // Drag functionality for the GUI
    let dragging = false,
        offX = 0,
        offY = 0;
    header.addEventListener("mousedown", e => {
        dragging = true;
        const rect = GUI.getBoundingClientRect();
        offX = e.clientX - rect.left;
        offY = e.clientY - rect.top;
    });
    document.addEventListener("mousemove", e => {
        if (dragging) {
            GUI.style.left = `${e.clientX - offX}px`;
            GUI.style.top = `${e.clientY - offY}px`;
        }
    });
    document.addEventListener("mouseup", () => (dragging = false));

    // Observer and state
    let observer = null,
        state = "idle",
        notificationContainer,
        intervalId;

    function blockFor(seconds) {
        const half = Math.ceil(seconds / 2);

        const overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0)",
            zIndex: 9997,
            pointerEvents: "all"
        });
        document.body.appendChild(overlay);

        // Create combined notification container
        notificationContainer = document.createElement("div");
        notificationContainer.className = "notification-container";

        // Countdown display
        const countdown = document.createElement("div");
        countdown.className = "countdown-display";
        countdown.textContent = seconds;

        // Message display
        const message = document.createElement("div");
        message.className = "message-display";

        notificationContainer.append(countdown, message);
        document.body.appendChild(notificationContainer);

        let t = seconds;
        intervalId = setInterval(() => {
            t--;
            countdown.textContent = t;

            if (customToggle.checked) {
                if (t > half) {
                    message.textContent = "Look for Checks, Captures, Attacks";
                    message.className = "message-display red-msg";
                } else {
                    message.textContent = "Optimize position & look for tactics";
                    message.className = "message-display blue-msg";
                }
            } else {
                message.textContent = t > half ? "Analyze opponent's moves" : "Plan your strategy";
            }

            if (t <= 0) {
                clearInterval(intervalId);
                notificationContainer.remove();
                overlay.remove();
                state = "waitingOpponent";
                console.log("Your turn");
            }
        }, 1000);
    }

    function startObs() {
        const yourColor = colorSelect.value;
        const oppColor = yourColor === "w" ? "b" : "w";
        state = "waitingOpponent";
        if (observer) observer.disconnect();
        observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                const cls = m.target.className || "";
                if (m.type === "attributes" && m.attributeName === "class") {
                    if (state === "waitingOpponent" && cls.includes(`piece ${oppColor}`)) {
                        state = "blocking";
                        blockFor(parseInt(timeInput.value, 10));
                    }
                    if (state === "waitingUser" && cls.includes(`piece ${yourColor}`)) {
                        state = "waitingOpponent";
                    }
                }
                if (m.type === "childList" && m.addedNodes.length) {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && state === "waitingUser" && node.className.includes(`piece ${yourColor}`)) {
                            state = "waitingOpponent";
                        }
                    });
                }
            });
        });
        const board = document.querySelector(botToggle.checked ? "#board-play-computer" : "#board-single") || document.querySelector(".board");
        if (!board) return alert("Chess board not found, make sure you're on the game page");
        observer.observe(board, {
            attributes: true,
            subtree: true,
            attributeFilter: ["class"],
            childList: true
        });
        state = "waitingUser";
        toggleBtn.textContent = "Stop Observer";
        toggleBtn.classList.add("stop-btn");
        console.log("Observer started");
    }

    function stopObs() {
        if (observer) observer.disconnect();
        if (notificationContainer) notificationContainer.remove();
        state = "idle";
        toggleBtn.textContent = "Start Observer";
        toggleBtn.classList.remove("stop-btn");
        console.log("Observer stopped");
    }

    toggleBtn.addEventListener("click", () => (state === "idle" ? startObs() : stopObs()));

    menuToggleBtn.addEventListener("click", () => {
        if (GUI.classList.contains("hidden")) {
            GUI.classList.remove("hidden");
            menuToggleBtn.textContent = "✕";
        } else {
            GUI.classList.add("hidden");
            menuToggleBtn.textContent = "☰";
        }
    });
})();
