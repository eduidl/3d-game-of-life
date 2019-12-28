import { LifeGame } from './life_game';
import ThreeJS from './three_js';
import { Point, State } from './types';

const getById = (id: string): HTMLElement | null => document.getElementById(id);

const threeJs = new ThreeJS();
const lifeGame = new LifeGame();

function coordinate(x: number, y: number, z: number): Point {
  const particle_gap = 5;
  return {
    x: ((lifeGame.cellNum() - 1) * 0.5 - x) * particle_gap,
    y: ((lifeGame.cellNum() - 1) * 0.5 - y) * particle_gap,
    z: ((lifeGame.cellNum() - 1) * 0.5 - z) * particle_gap
  };
}

const getCoordinateSet = (): Point[] => {
  let ret = [];
  for (let x = 0; x < lifeGame.cellNum(); x++) {
    for (let y = 0; y < lifeGame.cellNum(); y++) {
      for (let z = 0; z < lifeGame.cellNum(); z++) {
        if (lifeGame.state[x][y][z] === State.DEAD) continue;
        ret.push(coordinate(x, y, z));
      }
    }
  }
  return ret;
}

const render = () => {
  requestAnimationFrame(render);
  threeJs.render();
}

let intervalID: any;

const main = () => {
  const settingElm = getById("setting");
  if (settingElm == null) { throw TypeError; }
  settingElm.addEventListener('mouseover', () => {
    threeJs.controls.enabled = false;
  }, false);
  settingElm.addEventListener('mouseout', () => {
    threeJs.controls.enabled = true;
  }, false);

  const startBtn = getById("start");
  if (startBtn == null) { throw TypeError; }
  startBtn.addEventListener('click', () => {
    clearInterval(intervalID);
    intervalID = setInterval(() => {
      if (!lifeGame.updateState()) {
        clearInterval(intervalID);
      }
      threeJs.placeParticles(getCoordinateSet());
    }, 250);
  }, false);

  const stopBtn = getById("stop");
  if (stopBtn == null) { throw TypeError; }
  stopBtn.addEventListener('click', () => {
    clearInterval(intervalID);
  }, false);

  const oneStepBtn = getById('oneStep');
  if (oneStepBtn == null) { throw TypeError; }
  oneStepBtn.addEventListener('click', () =>  {
    clearInterval(intervalID);
    lifeGame.updateState();
    threeJs.placeParticles(getCoordinateSet());
  }, false);

  const updateBtn = getById('update')
  if (updateBtn == null) { throw TypeError; }
  updateBtn.addEventListener('click', () => {
    clearInterval(intervalID);
    lifeGame.reset();
    threeJs.placeParticles(getCoordinateSet());
  }, false);

  let timer: any;
  window.addEventListener('resize', () => {
    if (timer > 0) clearTimeout(timer);
    timer = setTimeout(() => {
      let width = window.innerWidth;
      let height = window.innerHeight;
      threeJs.resize(width, height);
    }, 200);
  }, false);

  threeJs.placeParticles(getCoordinateSet());
  render();
}

main();