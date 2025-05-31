(function () {
    // inject tailwind for styling
    const tl = document.createElement("script");
    tl.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(tl);

    // custom keyframes and styles
    const style = document.createElement("style");
    style.textContent = `
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @layer utilities {
            @keyframes psychedelic { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
            @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
            .animate-psychedelic { animation: psychedelic 2s ease-in-out infinite; }
            .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        }
    `;
    document.head.appendChild(style);

    // main GUI container
    const GUI = document.createElement("div");
    GUI.className = [
        "fixed top-6 left-6 w-80 p-6 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-80",
        "backdrop-blur-lg rounded-3xl shadow-2xl ring-2 ring-gray-300 dark:ring-gray-700 z-50",
        "opacity-0 animate-fadeInUp transition-all duration-500 hover:scale-105"
    ].join(" ");
    GUI.id = "chessObserverGUI";

    // header container (title + close button)
    const headerContainer = document.createElement("div");
    headerContainer.className = "flex justify-between items-center cursor-move select-none mb-6";

    // header title
    const header = document.createElement("h1");
    header.textContent = "♟️ I believe in good moves";
    header.className = "text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide";
    headerContainer.appendChild(header);

    // close/hide button (✕)
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "&times;"; // HTML entity for ×
    closeBtn.className = "text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors";
    closeBtn.title = "Hide Menu";
    closeBtn.style.fontSize = "1.25rem";
    closeBtn.style.lineHeight = "1";
    closeBtn.addEventListener("click", () => {
        GUI.style.display = "none";
        showOpenButton();
    });
    headerContainer.appendChild(closeBtn);

    GUI.appendChild(headerContainer);

    // field container
    const field = document.createElement("div");
    field.className = "flex flex-col gap-4";

    // bot toggle
    const botContainer = document.createElement("div");
    botContainer.className = "flex items-center gap-3";
    const botToggle = document.createElement("input");
    botToggle.type = "checkbox";
    botToggle.id = "playBot";
    botToggle.className = "w-6 h-6 accent-blue-500";
    const botLabel = document.createElement("label");
    botLabel.htmlFor = "playBot";
    botLabel.textContent = "Playing vs Bot?";
    botLabel.className = "text-base text-gray-700 dark:text-gray-300 font-medium";
    botContainer.append(botToggle, botLabel);
    field.appendChild(botContainer);

    // custom message toggle
    const customContainer = document.createElement("div");
    customContainer.className = "flex items-center gap-3";
    const customToggle = document.createElement("input");
    customToggle.type = "checkbox";
    customToggle.id = "customMsg";
    customToggle.className = "w-6 h-6 accent-green-500";
    const customLabel = document.createElement("label");
    customLabel.htmlFor = "customMsg";
    customLabel.textContent = "Enable custom messages?";
    customLabel.className = "text-base text-gray-700 dark:text-gray-300 font-medium";
    customContainer.append(customToggle, customLabel);
    field.appendChild(customContainer);

    // color select
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Your color:";
    colorLabel.className = "text-base text-gray-700 dark:text-gray-300 font-medium";
    const colorSelect = document.createElement("select");
    colorSelect.className = "w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400";
    ["White", "Black"].forEach(color => {
        const o = document.createElement("option");
        o.value = color.toLowerCase()[0];
        o.textContent = color;
        colorSelect.appendChild(o);
    });
    field.append(colorLabel, colorSelect);

    // think time input
    const timeLabel = document.createElement("label");
    timeLabel.textContent = "Think time (sec):";
    timeLabel.className = "text-base text-gray-700 dark:text-gray-300 font-medium";
    const timeInput = document.createElement("input");
    timeInput.type = "number";
    timeInput.value = 30;
    timeInput.min = 1;
    timeInput.max = 300;
    timeInput.className = "w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400";
    field.append(timeLabel, timeInput);

    // start/stop button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Start Observer";
    toggleBtn.className = "mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-2xl shadow-lg transition-transform transform hover:scale-105";
    field.appendChild(toggleBtn);

    GUI.appendChild(field);

    // footer
    const credit = document.createElement("p");
    credit.textContent = "Made by Takaso";
    credit.className = "mt-6 text-center text-sm text-gray-500 dark:text-gray-400 italic";
    GUI.appendChild(credit);

    document.body.appendChild(GUI);

    // floating “Open Menu” button (initially hidden)
    let openBtn = null;
    function showOpenButton() {
        if (openBtn) return;
        openBtn = document.createElement("button");
        openBtn.textContent = "Open Menu";
        openBtn.className = [
            "fixed bottom-6 right-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full",
            "shadow-xl z-50 transition-transform transform hover:scale-105"
        ].join(" ");
        openBtn.title = "Click to re-open the menu";
        openBtn.addEventListener("click", () => {
            GUI.style.display = "block";
            openBtn.remove();
            openBtn = null;
        });
        document.body.appendChild(openBtn);
    }

    // drag functionality
    let dragging = false, offX = 0, offY = 0;
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
    document.addEventListener("mouseup", () => dragging = false);

    // observer and state
    let observer = null, state = "idle", overlay, countdown, intervalId, msgBox;

    function blockFor(seconds) {
        const half = Math.ceil(seconds / 2);
        overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0, 0, 0, 0)",
            zIndex: 9998, pointerEvents: "all"
        });
        document.body.appendChild(overlay);

        countdown = document.createElement("div");
        countdown.className = "fixed top-4 left-1/2 transform -translate-x-1/2 px-5 py-3 bg-gray-900 bg-opacity-90 text-white text-xl font-mono rounded-xl shadow-2xl z-9999";
        document.body.appendChild(countdown);

        msgBox = document.createElement("div");
        msgBox.className = "fixed top-16 left-1/2 transform -translate-x-1/2 px-5 py-3 text-lg font-semibold rounded-xl shadow-lg z-9999 bg-red-500 text-red-100";
        document.body.appendChild(msgBox);

        let t = seconds;
        intervalId = setInterval(() => {
            t--;
            countdown.textContent = t;
            if (customToggle.checked) {
                if (t > half) {
                    msgBox.textContent = "Look for your opponent's Checks, Captures and Attacks";
                    msgBox.classList.replace("bg-blue-500", "bg-red-500");
                    msgBox.classList.replace("text-blue-100", "text-red-100");
                } else {
                    msgBox.textContent = "Look for Checks, Captures, Attacks and Optimization";
                    msgBox.classList.replace("bg-red-500", "bg-blue-500");
                    msgBox.classList.replace("text-red-100", "text-blue-100");
                }
            }
            if (t <= 0) {
                clearInterval(intervalId);
                overlay.remove();
                countdown.remove();
                msgBox.remove();
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
                const cls = m.target.className || '';
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
        const board = document.querySelector(botToggle.checked ? "#board-play-computer" : "#board-single") || document.querySelector('.board');
        if (!board) return alert("Chess board not found, make sure you're on the game page");
        observer.observe(board, { attributes: true, subtree: true, attributeFilter: ["class"], childList: true });
        state = "waitingUser";
        toggleBtn.textContent = "Stop Observer";
        toggleBtn.className = toggleBtn.className.replace("from-blue-500 to-indigo-500", "from-red-500 to-pink-500").replace("hover:from-indigo-500 hover:to-blue-500", "hover:from-pink-500 hover:to-red-500");
        console.log("Observer started");
    }

    function stopObs() {
        if (observer) observer.disconnect();
        state = "idle";
        toggleBtn.textContent = 'Start Observer';
        toggleBtn.className = toggleBtn.className.replace(/from-red-500 to-pink-500/, 'from-blue-500 to-indigo-500').replace(/hover:from-pink-500 hover:to-red-500/, 'hover:from-indigo-500 hover:to-blue-500');
        console.log("Observer stopped");
    }

    toggleBtn.addEventListener("click", () => state === "idle" ? startObs() : stopObs());
})();
