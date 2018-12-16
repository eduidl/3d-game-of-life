import { LifeGame, STATE } from './life_game.js';
import ThreeJS from './three_js.js';

const id = (id) => document.getElementById(id);

const three_js = new ThreeJS();
const life_game = new LifeGame(getOption());

function getOption() {
  const option = {
    cell_num: parseInt(id('cellNum').value, 10),
    probability: parseInt(id('probability').value, 10),
    alive_min: parseInt(id('aliveMin').value, 10),
    alive_max: parseInt(id('aliveMax').value, 10),
    birth_min: parseInt(id('birthMin').value, 10),
    birth_max: parseInt(id('birthMax').value, 10)
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

function getCoordinateSet() {
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

id('setting').addEventListener('mouseover', function() {
  three_js.controls.enabled = false;
}, false);

id('setting').addEventListener('mouseout', function() {
  three_js.controls.enabled = true;
}, false);

let intervalID;

id('start').addEventListener('click', function() {
  clearInterval(intervalID);
  intervalID = setInterval(function() {
    if (!life_game.updateState()) {
      clearInterval(intervalID);
    }
    three_js.placeParticles(getCoordinateSet());
  }, 250);
}, false);

id('stop').addEventListener('click', function() {
  clearInterval(intervalID);
}, false);

id('oneStep').addEventListener('click', function() {
  clearInterval(intervalID);
  life_game.updateState();
  three_js.placeParticles(getCoordinateSet());
}, false);

id('update').addEventListener('click', function() {
  clearInterval(intervalID);
  life_game.reset(getOption());
  three_js.placeParticles(getCoordinateSet());
}, false);

let timer = 0;
window.addEventListener('resize', function() {
  if (timer > 0) clearTimeout(timer);
  timer = setTimeout(function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    three_js.resize(width, height);
  }, 200);
}, false);

three_js.placeParticles(getCoordinateSet());
render();
