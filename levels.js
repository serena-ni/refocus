// puzzle generation logic
const totalLevels = 5;

function randomNumber() { return Math.floor(Math.random()*10); }
function randomSymbol() { const syms=["+","-","*","△","◎"]; return syms[Math.floor(Math.random()*syms.length)]; }

function generateLevel() {
  const a=randomNumber();
  const b=randomNumber();
  const op=randomSymbol();
  let answer;
  if(op=="+") answer=a+b;
  else if(op=="-") answer=a-b;
  else if(op=="*") answer=a*b;
  else answer=a+b; // fallback for unknown symbols

  return {
    layers:[
      { text:a.toString(), visibleAt:[0,25] },
      { text:op, visibleAt:[20,50] },
      { text:b.toString(), visibleAt:[40,75] },
      { text:"?", visibleAt:[70,100] }
    ],
    answer:answer.toString(),
    hint:"Combine the visible layers using the operator to find the answer.",
    time:30+Math.floor(Math.random()*30)
  };
}

const levels = Array.from({length:totalLevels}, generateLevel);
