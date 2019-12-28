import { LifeGame } from "./life_game";
import Visualizer from "./visualizer";

const visualizer = new Visualizer();
const lifeGame = new LifeGame();

const render = (): void => {
  requestAnimationFrame(render);
  visualizer.render();
};

const settingElm = document.getElementById("setting");
if (settingElm === null) {
  throw TypeError;
}
settingElm.addEventListener(
  "mouseover",
  () => {
    visualizer.controls.enabled = false;
  },
  false
);
settingElm.addEventListener(
  "mouseout",
  () => {
    visualizer.controls.enabled = true;
  },
  false
);

let intervalID: number;
const startBtn = document.getElementById("start");
if (startBtn === null) {
  throw TypeError;
}
startBtn.addEventListener(
  "click",
  () => {
    clearInterval(intervalID);
    intervalID = window.setInterval(() => {
      if (!lifeGame.updateState()) {
        clearInterval(intervalID);
      }
      visualizer.placeParticles(lifeGame.getCoordinates());
    }, 250);
  },
  false
);

const stopBtn = document.getElementById("stop");
if (stopBtn === null) {
  throw TypeError;
}
stopBtn.addEventListener(
  "click",
  () => {
    clearInterval(intervalID);
  },
  false
);

const oneStepBtn = document.getElementById("oneStep");
if (oneStepBtn === null) {
  throw TypeError;
}
oneStepBtn.addEventListener(
  "click",
  () => {
    clearInterval(intervalID);
    lifeGame.updateState();
    visualizer.placeParticles(lifeGame.getCoordinates());
  },
  false
);

const updateBtn = document.getElementById("update");
if (updateBtn === null) {
  throw TypeError;
}
updateBtn.addEventListener(
  "click",
  () => {
    clearInterval(intervalID);
    lifeGame.reset();
    visualizer.placeParticles(lifeGame.getCoordinates());
  },
  false
);

let timer: number;
window.addEventListener(
  "resize",
  () => {
    if (timer > 0) clearTimeout(timer);
    timer = window.setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      visualizer.resize(width, height);
    }, 200);
  },
  false
);

visualizer.placeParticles(lifeGame.getCoordinates());
render();
