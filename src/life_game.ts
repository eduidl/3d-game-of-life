import { State } from './types'

const getById = (id: string): HTMLElement | null => document.getElementById(id);
const getValue = (id: string): number | undefined => parseInt((getById(id) as HTMLInputElement).value, 10);

class Config {
  readonly cellNum: number;
  readonly probability: number;
  readonly aliveMin: number;
  readonly aliveMax: number;
  readonly birthMin: number;
  readonly birthMax: number;

  constructor(cellNum?: number, probability?: number, aliveMin?: number, aliveMax?: number,
              birthMin?: number, birthMax?: number) {
    this.cellNum = Config.normalize(cellNum, 5, 30, 20); // セルの個数
    this.probability = Config.normalize(probability, 0, 100, 25); // 生きたセルの割合
    this.aliveMin = Config.normalize(aliveMin, 0, 26, 4); // 生存できる隣人最小値
    this.aliveMax = Config.normalize(aliveMax, this.aliveMin, 26, this.aliveMin); // 生存できる隣人最大値
    this.birthMin = Config.normalize(birthMin, 0, 26, 6); // 誕生できる隣人最小値
    this.birthMax = Config.normalize(birthMax, this.birthMin, 26, this.birthMin);// 誕生できる隣人最大値
  }

  static readCurrentConfig(): Config {
    return new Config(
      getValue('cellNum'),
      getValue('probability'),
      getValue('aliveMin'),
      getValue('aliveMax'),
      getValue('birthMin'),
      getValue('birthMax')
    );
  }

  static normalize(num: number | undefined, min: number, max: number, default_: number): number {
    if (num == undefined) {
      return default_;
    }
    return isNaN(num) ? default_ : Math.min(Math.max(num, min), max);
  }
}

export class LifeGame {
  state: State[][][];
  private config: Config;

  constructor() {
    this.config = Config.readCurrentConfig();
    this.state = [[[]]];
    this.initializeState();
  }

  reset() {
    this.config = Config.readCurrentConfig();
    this.initializeState();
  }

  private initializeState() {
    this.state = [[[]]];
    for (let x = 0; x < this.config.cellNum; x++) {
      this.state[x] = [];
      for (let y = 0; y < this.config.cellNum; y++) {
        this.state[x][y] = [];
        for (let z = 0; z < this.config.cellNum; z++) {
          this.state[x][y][z] = (Math.random() < this.config.probability * 0.01) ?  State.ALIVE : State.DEAD;
        }
      }
    }
  }

  updateState() {
    let changed_flag = false;
    let tmp_cells_state: State[][][] = [[[]]];
    for (let x = 0; x < this.config.cellNum; x++) {
      tmp_cells_state[x] = [];
      for (let y = 0; y < this.config.cellNum; y++) {
        tmp_cells_state[x][y] = [];
        for (let z = 0; z < this.config.cellNum; z++) {
          tmp_cells_state[x][y][z] = this.isDeadOrAlive(x, y, z);
          if (!changed_flag && this.state[x][y][z] !== tmp_cells_state[x][y][z]) changed_flag = true;
        }
      }
    }
    if (changed_flag) this.state = tmp_cells_state;
    return changed_flag;
  }

  isDeadOrAlive(x: number, y: number, z: number) {
    let num = this.countSurroudingAliveCells(x, y, z);
    if (this.state[x][y][z] === State.ALIVE && this.config.aliveMin <= num && num <= this.config.aliveMax) {
      return State.ALIVE;
    } else if (this.state[x][y][z] === State.DEAD && this.config.birthMin <= num && num <= this.config.birthMax) {
      return State.ALIVE;
    } else {
      return State.DEAD;
    }
  }

  countSurroudingAliveCells(x: number, y: number, z: number): number {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      const xx = (x + dx + this.config.cellNum) % this.config.cellNum;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = (y + dy + this.config.cellNum) % this.config.cellNum;
        for (let dz = -1; dz <= 1; dz++) {
          if (dx === 0 && dy === 0 && dz === 0) continue;
          const zz = (z + dz + this.config.cellNum) % this.config.cellNum;
          count += this.state[xx][yy][zz];
        }
      }
    }
    return count;
  }

  cellNum(): number { return this.config.cellNum; }
}
