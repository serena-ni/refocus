const camera=document.getElementById("camera");
const focusSlider=document.getElementById("focus");
const codeInput=document.getElementById("code");
const submitBtn=document.getElementById("submit");
const hintBtn=document.getElementById("hint");
const msg=document.getElementById("msg");
const timerEl=document.getElementById("timer");
const scoreEl=document.getElementById("score");
const levelMenu=document.getElementById("level-menu");

let level=0, timer, currentLayers=[], score=0;

// Load a level
function loadLevel(idx){
  clearInterval(timer);
  camera.innerHTML="";
  codeInput.value="";
  focusSlider.value=0;
  camera.classList.add("glitch");
  playSound("glitch");
  setTimeout(()=>camera.classList.remove("glitch"),500);
  msg.textContent=levels[idx].hint;
  startTimer(levels[idx].time);

  currentLayers=[];
  levels[idx].layers.forEach(layer=>{
    const div=document.createElement("div");
    div.className="layer";
    div.textContent=layer.text;
    camera.appendChild(div);
    currentLayers.push({elem:div,data:layer});
  });
  updateFocus();
}

// Timer
function startTimer(seconds){
  let timeLeft=seconds;
  timerEl.textContent=`Time: ${timeLeft}`;
  timer=setInterval(()=>{
    timeLeft--;
    timerEl.textContent=`Time: ${timeLeft}`;
    if(timeLeft<=0){
      clearInterval(timer);
      msg.textContent="⏰ Time's up!";
      playSound("wrong");
    }
  },1000);
}

// Update layer visibility
function updateFocus(){
  const val=parseInt(focusSlider.value);
  currentLayers.forEach(({elem,data})=>{
    const [min,max]=data.visibleAt;
    elem.style.opacity=(val>=min && val<=max)?1:0;
    elem.style.filter=(val>=min && val<=max)?"blur(0px)":"blur(2px)";
  });
}
focusSlider.addEventListener("input",updateFocus);

// Submit answer
submitBtn.addEventListener("click",()=>{
  const ans=codeInput.value.trim();
  if(ans==levels[level].answer){
    clearInterval(timer);
    playSound("correct");
    score+=10;
    scoreEl.textContent=`Score: ${score}`;
    msg.textContent="✔️ Correct! Moving to next level...";
    level++;
    if(level<levels.length) setTimeout(()=>loadLevel(level),500);
    else{
      msg.textContent="🎉 You solved all puzzles!";
      camera.innerHTML="<div class='layer' style='opacity:1;color:#00ffff;font-size:1.5em;'>END OF TRANSMISSION</div>";
      focusSlider.disabled=true;
      codeInput.disabled=true;
      submitBtn.disabled=true;
      hintBtn.disabled=true;
      timerEl.textContent="";
    }
  } else{
    playSound("wrong");
    msg.textContent="❌ Incorrect. Try again.";
  }
});

// Hint button
hintBtn.addEventListener("click",()=>{
  msg.textContent="💡 Hint: "+levels[level].hint;
});

// Level menu
function createLevelMenu(){
  levelMenu.innerHTML="";
  levels.forEach((lvl,idx)=>{
    const btn=document.createElement("button");
    btn.textContent=`Level ${idx+1}`;
    btn.addEventListener("click",()=>{
      level=idx;
      loadLevel(level);
    });
    levelMenu.appendChild(btn);
  });
}

// Initialize
createLevelMenu();
loadLevel(level);

function playSound(name){ if(window.sounds && sounds[name]) sounds[name].play(); }
