import { LifeGame, STATE } from './life_game';
import ThreeJS from './three_js';

const getById = (id: string): HTMLElement | null => document.getElementById(id);
const getValue = (id: string): number => parseInt((getById(id) as HTMLInputElement).value, 10);

const three_js = new ThreeJS();
const life_game = new LifeGame(getOption());

function getOption() {
  const option = {
    cell_num: getValue('cellNum'),
    probability: getValue('probability'),
    alive_min: getValue('aliveMin'),
    alive_max: getValue('aliveMax'),
    birth_min: getValue('birthMin'),
    birth_max: getValue('birthMax')
  };
  return option;
}

function coordinate(x, y, z) {
  const particle_gap = 5;
  return {
    x: ((life_game.cell_num - 1) * 0.5 - x) * particle_gap,
    y: ((life_game.cell_num - 1) * 0.5 - y) * particle_gap,
    z: ((life_game.cell_num - 1) * 0.5 - z) * particle_gap
  };
}

const getCoordinateSet = () => {
  let ret = [];
  for (let x = 0; x < life_game.cell_num; x++) {
    for (let y = 0; y < life_game.cell_num; y++) {
      for (let z = 0; z < life_game.cell_num; z++) {
        if (life_game.state[x][y][z] === STATE.DEAD) continue;
        ret.push(coordinate(x, y, z));
      }
    }
  }
  return ret;
}

function render() {
  requestAnimationFrame(render);
  three_js.render();
}

getById('setting').addEventListener('mouseover', () => {
  three_js.controls.enabled = false;
}, false);

getById('setting').addEventListener('mouseout', () => {
  three_js.controls.enabled = true;
}, false);

let intervalID;

getById('start').addEventListener('click', () => {
  clearInterval(intervalID);
  intervalID = setInterval(function() {
    if (!life_game.updateState()) {
      clearInterval(intervalID);
    }
    three_js.placeParticles(getCoordinateSet());
  }, 250);
}, false);

getById('stop').addEventListener('click', () => {
  clearInterval(intervalID);
}, false);

getById('oneStep').addEventListener('click', () =>  {
  clearInterval(intervalID);
  life_game.updateState();
  three_js.placeParticles(getCoordinateSet());
}, false);

getById('update').addEventListener('click', () => {
  clearInterval(intervalID);
  life_game.reset(getOption());
  three_js.placeParticles(getCoordinateSet());
}, false);

let timer: any;
window.addEventListener('resize', () => {
  if (timer > 0) clearTimeout(timer);
  timer = setTimeout(function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    three_js.resize(width, height);
  }, 200);
}, false);

three_js.placeParticles(getCoordinateSet());
render();
