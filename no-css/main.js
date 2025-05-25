// Use this script with worse CSS if your browser lags

(function () {
    // inject tailwind, nya
    const tl = document.createElement("script"); tl.src = "https://cdn.tailwindcss.com"; document.head.appendChild(tl);

    // main GUI
    const GUI = document.createElement("div");
    GUI.className = [
        "fixed top-6 left-6 w-80 p-6 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-80",
        "backdrop-blur-lg rounded-3xl shadow-2xl ring-2 ring-gray-300 dark:ring-gray-700 z-50"
    ].join(" ");
    const header = document.createElement("h1");
    header.textContent = "♟️ I believe in good moves";
    header.className = "text-2xl font-bold cursor-move select-none text-gray-900 dark:text-gray-100 mb-4";
    GUI.appendChild(header);

    const field = document.createElement("div");
    field.className = "flex flex-col gap-4";

    // bot toggle
    const botContainer = document.createElement("div");
    botContainer.className = "flex items-center gap-2";
    const botToggle = document.createElement("input");
    botToggle.type = "checkbox";
    botToggle.id = "playBot";
    botToggle.className = "w-5 h-5";
    const botLabel = document.createElement("label");
    botLabel.htmlFor = "playBot";
    botLabel.textContent = "Playing vs Bot?";
    botLabel.className = "text-base text-gray-700 dark:text-gray-300";
    botContainer.appendChild(botToggle);
    botContainer.appendChild(botLabel);
    field.appendChild(botContainer);

    // color select
    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Your color:";
    colorLabel.className = "text-base text-gray-700 dark:text-gray-300";
    const colorSelect = document.createElement("select");
    colorSelect.className = "w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl";
    ["White","Black"].forEach(color => {
        const o = document.createElement("option");
        o.value = color.toLowerCase();
        o.textContent = color;
        colorSelect.appendChild(o);
    });
    field.appendChild(colorLabel);
    field.appendChild(colorSelect);

    // think time
    const timeLabel = document.createElement("label");
    timeLabel.textContent = "Think time (sec):";
    timeLabel.className = "text-base text-gray-700 dark:text-gray-300";
    const timeInput = document.createElement("input");
    timeInput.type = "number";
    timeInput.value = 30;
    timeInput.min = 1;
    timeInput.max = 300;
    timeInput.className = "w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl";
    field.appendChild(timeLabel);
    field.appendChild(timeInput);

    // start/stop
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Start Observer";
    toggleBtn.className = "mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors duration-200";
    field.appendChild(toggleBtn);
    GUI.appendChild(field);
    document.body.appendChild(GUI);

    // drag listener
    let dragging=false,offX=0,offY=0;
    header.addEventListener("mousedown",e=>{dragging=true;const r=GUI.getBoundingClientRect();offX=e.clientX-r.left;offY=e.clientY-r.top;});
    document.addEventListener("mousemove",e=>{if(dragging){GUI.style.left=`${e.clientX-offX}px`;GUI.style.top=`${e.clientY-offY}px`;}});
    document.addEventListener("mouseup",()=>dragging=false);

    // state
    let observer=null, state="idle";
    let overlay, countdown, intervalId;

    function blockFor(seconds){
        overlay=document.createElement("div");Object.assign(overlay.style,{position:"fixed",top:0,left:0,width:'100%',height:'100%',zIndex:9999,background:'transparent',pointerEvents:'all'});document.body.appendChild(overlay);
        countdown=document.createElement("div");countdown.textContent=seconds;Object.assign(countdown.style,{position:'fixed',top:'10px',left:'50%',transform:'translateX(-50%)',padding:'10px 20px',background:'black',color:'white',fontSize:'20px',borderRadius:'8px',zIndex:10000});document.body.appendChild(countdown);
        let t=seconds;intervalId=setInterval(()=>{t--;countdown.textContent=t;if(t<=0){clearInterval(intervalId);overlay.remove();countdown.remove();state="waitingOpponent";console.log("Your turn");}},1000);
    }

    function startObs(){
        const yourColor=colorSelect.value[0]; // 'w' or 'b'
        const oppColor= yourColor==="w"?"b":"w";
        state="waitingOpponent";
        if(observer)observer.disconnect();
        observer=new MutationObserver(muts=>{
            muts.forEach(m=>{
                if(m.type==="attributes"&&m.attributeName==="class"){
                    const el=m.target;
                    const cls=el.className;
                    if(state==="waitingOpponent" && cls.includes(`piece ${oppColor}`)){
                        console.log("Opponent moved");state="blocking";blockFor(parseInt(timeInput.value,10));
                    } else if(state==="waitingUser" && cls.includes(`piece ${yourColor}`)){
                        console.log("Your move registered");state="waitingOpponent";
                    }
                } else if(m.type==="childList"){
                    m.addedNodes.forEach(n=>{
                        if(n.nodeType===1){
                            const cls=n.className||"";
                            if(state==="waitingUser" && cls.includes(`piece ${yourColor}`)){
                                console.log("Your move");state="waitingOpponent";
                            }
                        }
                    });
                }
            });
        });
        const boardSel=botToggle.checked?"#board-play-computer":"#board-single";
        const board=document.querySelector(boardSel);
        if(!board) return alert("Board missing, bozo");
        observer.observe(board,{attributes:true,subtree:true,attributeFilter:["class"],childList:true});
        state="waitingUser";
        toggleBtn.textContent="Stop Observer";toggleBtn.classList.replace('bg-blue-500','bg-red-500');toggleBtn.classList.replace('hover:bg-blue-600','hover:bg-red-600');
        console.log("Observer started on", boardSel);
    }
    function stopObs(){
        if(observer)observer.disconnect();state="idle";
        toggleBtn.textContent='Start Observer';toggleBtn.classList.replace('bg-red-500','bg-blue-500');toggleBtn.classList.replace('hover:bg-red-600','hover:bg-blue-600');
        console.log("Observer stopped");
    }

    toggleBtn.addEventListener("click",()=>{if(state==="idle")startObs();else stopObs();});
})();
