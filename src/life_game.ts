const normalization = (num: number, min: number, max: number, default_: number) => {
  return isNaN(num) ? default_ : Math.min(Math.max(num, min), max);
};

export enum STATE {
  ALIVE = 1,
  DEAD = 0,
}

export class LifeGame {
  state: STATE[][][];
  cell_num: number;
  probability: number;
  alive_min: number;
  alive_max: number;
  birth_min: number;
  birth_max: number;

  constructor(option) {
    this.reset(option);
  }

  reset(option) {
    this.setOption(option);
    this.state = [];
    for (let x = 0; x < this.cell_num; x++) {
      this.state[x] = [];
      for (let y = 0; y < this.cell_num; y++) {
        this.state[x][y] = [];
        for (let z = 0; z < this.cell_num; z++) {
          this.state[x][y][z] = (Math.random() < this.probability * 0.01) ?  STATE.ALIVE : STATE.DEAD;
        }
      }
    }
  }

  updateState() {
    let changed_flag = false;
    let tmp_cells_state = [];
    for (let x = 0; x < this.cell_num; x++) {
      tmp_cells_state[x] = [];
      for (let y = 0; y < this.cell_num; y++) {
        tmp_cells_state[x][y] = [];
        for (let z = 0; z < this.cell_num; z++) {
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
    if (this.state[x][y][z] === STATE.ALIVE && this.alive_min <= num && num <= this.alive_max) {
      return STATE.ALIVE;
    } else if (this.state[x][y][z] === STATE.DEAD && this.birth_min <= num && num <= this.birth_max) {
      return STATE.ALIVE;
    } else {
      return STATE.DEAD;
    }
  }

  countSurroudingAliveCells(x: number, y: number, z: number): number {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      const xx = (x + dx + this.cell_num) % this.cell_num;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = (y + dy + this.cell_num) % this.cell_num;
        for (let dz = -1; dz <= 1; dz++) {
          if (dx === 0 && dy === 0 && dz === 0) continue;
          const zz = (z + dz + this.cell_num) % this.cell_num;
          count += this.state[xx][yy][zz];
        }
      }
    }
    return count;
  }

  setOption(option) {
    this.cell_num = normalization(option.cell_num, 5, 30, 20); // セルの個数
    this.probability = normalization(option.probability, 0, 100, 25); // 生きたセルの割合
    this.alive_min = normalization(option.alive_min, 0, 26, 4); // 生存できる隣人最小値
    this.alive_max = normalization(option.alive_max, this.alive_min, 26, this.alive_min); // 生存できる隣人最大値
    this.birth_min = normalization(option.birth_min, 0, 26, 6); // 誕生できる隣人最小値
    this.birth_max = normalization(option.birth_max, this.birth_min, 26, this.birth_min);// 誕生できる隣人最大値
  }
}
