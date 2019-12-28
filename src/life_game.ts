import { Point, State } from "./types";

const getValue = (id: string): number | undefined => {
  const elm = document.getElementById(id);
  if (!(elm instanceof HTMLInputElement)) {
    throw TypeError;
  }
  return parseInt(elm.value, 10);
};

const setValue = (id: string, val: number): void => {
  const elm = document.getElementById(id);
  if (!(elm instanceof HTMLInputElement)) {
    throw TypeError;
  }
  elm.value = val.toString();
};

class Config {
  readonly cellNum: number; // セルの個数
  readonly probability: number; // 生きたセルの割合
  readonly aliveMin: number; // 生存できる隣人最小値
  readonly aliveMax: number; //  生存できる隣人最大値
  readonly birthMin: number; // 誕生できる隣人最小値
  readonly birthMax: number; // 誕生できる隣人最大値

  constructor(
    cellNum?: number,
    probability?: number,
    aliveMin?: number,
    aliveMax?: number,
    birthMin?: number,
    birthMax?: number
  ) {
    this.cellNum = Config.normalize(cellNum, 5, 30, 20);
    this.probability = Config.normalize(probability, 0, 100, 25);
    this.aliveMin = Config.normalize(aliveMin, 0, 26, 4);
    this.aliveMax = Config.normalize(
      aliveMax,
      this.aliveMin,
      26,
      this.aliveMin
    );
    this.birthMin = Config.normalize(birthMin, 0, 26, 6);
    this.birthMax = Config.normalize(
      birthMax,
      this.birthMin,
      26,
      this.birthMin
    );
  }

  static readCurrentConfig(): Config {
    const config = new Config(
      getValue("cellNum"),
      getValue("probability"),
      getValue("aliveMin"),
      getValue("aliveMax"),
      getValue("birthMin"),
      getValue("birthMax")
    );
    setValue("cellNum", config.cellNum);
    setValue("probability", config.probability);
    setValue("aliveMin", config.aliveMin);
    setValue("aliveMax", config.aliveMax);
    setValue("birthMin", config.birthMin);
    setValue("birthMax", config.birthMax);
    return config;
  }

  static normalize(
    num: number | undefined,
    min: number,
    max: number,
    default_: number
  ): number {
    if (num == undefined) {
      return default_;
    }
    return isNaN(num) ? default_ : Math.min(Math.max(num, min), max);
  }
}

export class LifeGame {
  private state: State[][][];
  private config: Config;

  constructor() {
    this.config = Config.readCurrentConfig();
    this.state = [[[]]];
    this.initializeState();
  }

  reset(): void {
    this.config = Config.readCurrentConfig();
    this.initializeState();
  }

  private initializeState(): void {
    this.state = [[[]]];
    for (let x = 0; x < this.config.cellNum; x++) {
      this.state[x] = [];
      for (let y = 0; y < this.config.cellNum; y++) {
        this.state[x][y] = [];
        for (let z = 0; z < this.config.cellNum; z++) {
          this.state[x][y][z] =
            Math.random() < this.config.probability * 0.01
              ? State.ALIVE
              : State.DEAD;
        }
      }
    }
  }

  updateState(): boolean {
    let changedFlag = false;
    const tmpCellsState: State[][][] = [[[]]];
    for (let x = 0; x < this.config.cellNum; x++) {
      tmpCellsState[x] = [];
      for (let y = 0; y < this.config.cellNum; y++) {
        tmpCellsState[x][y] = [];
        for (let z = 0; z < this.config.cellNum; z++) {
          tmpCellsState[x][y][z] = this.isDeadOrAlive(x, y, z);
          if (!changedFlag && this.state[x][y][z] !== tmpCellsState[x][y][z])
            changedFlag = true;
        }
      }
    }
    if (changedFlag) this.state = tmpCellsState;
    return changedFlag;
  }

  private coordinate(x: number, y: number, z: number): Point {
    const particleGap = 5;
    return {
      x: ((this.config.cellNum - 1) * 0.5 - x) * particleGap,
      y: ((this.config.cellNum - 1) * 0.5 - y) * particleGap,
      z: ((this.config.cellNum - 1) * 0.5 - z) * particleGap
    };
  }

  getCoordinates(): Point[] {
    const coordinates = [];
    for (let x = 0; x < this.config.cellNum; x++) {
      for (let y = 0; y < this.config.cellNum; y++) {
        for (let z = 0; z < this.config.cellNum; z++) {
          if (this.state[x][y][z] === State.DEAD) continue;
          coordinates.push(this.coordinate(x, y, z));
        }
      }
    }
    return coordinates;
  }

  private isDeadOrAlive(x: number, y: number, z: number): State {
    const num = this.countSurroudingAliveCells(x, y, z);
    if (
      this.state[x][y][z] === State.ALIVE &&
      this.config.aliveMin <= num &&
      num <= this.config.aliveMax
    ) {
      return State.ALIVE;
    } else if (
      this.state[x][y][z] === State.DEAD &&
      this.config.birthMin <= num &&
      num <= this.config.birthMax
    ) {
      return State.ALIVE;
    }
    return State.DEAD;
  }

  private countSurroudingAliveCells(x: number, y: number, z: number): number {
    let count = 0;
    for (let dx = -1; dx <= 1; ++dx) {
      const xx = (x + dx + this.config.cellNum) % this.config.cellNum;
      for (let dy = -1; dy <= 1; ++dy) {
        const yy = (y + dy + this.config.cellNum) % this.config.cellNum;
        for (let dz = -1; dz <= 1; ++dz) {
          if (dx === 0 && dy === 0 && dz === 0) continue;
          const zz = (z + dz + this.config.cellNum) % this.config.cellNum;
          count += this.state[xx][yy][zz];
        }
      }
    }
    return count;
  }
}
