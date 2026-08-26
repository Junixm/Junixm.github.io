import { key, makeBoard } from './grid';

const thirteenPreset = [
  [[7,17],[12,14]],
  [[3,13],[4,13],[5,13],[11,12]],
  [[7,17],[8,3],[9,17]],
  [[6,16],[11,14]],
  [[0,6],[1,6],[2,17],[5,16],[10,12]],
  [[3,5],[4,16]], [],
  [[8,10],[9,14]],
  [[2,9],[7,2],[10,11],[11,11],[12,8]],
  [[1,15],[6,10]],
  [[3,16],[4,16],[5,10]],
  [[1,15],[7,11],[8,15],[9,1]],
  [[0,9],[5,15]]
];

// Builds the supplied 13 x 13 clue layout as a board plus its locked cells.
export function buildPreset() {
  const board = makeBoard(13);
  const locked = new Set();
  thirteenPreset.forEach((row, r) => row.forEach(([c, value]) => {
    board[r][c] = value;
    locked.add(key(r, c));
  }));
  return { board, locked };
}

// The published solution to the October 2018 Jane Street "Subtiles" puzzle:
// https://www.janestreet.com/puzzles/subtiles-solution/
export const thirteenSolution = [
  [0,0,0,0,13,13,13,17,0,0,12,12,14],
  [13,13,13,13,13,13,17,17,17,17,12,12,14],
  [13,13,17,17,17,17,17,17,3,17,12,14,14],
  [13,13,17,17,16,16,16,17,3,3,12,14,14],
  [6,6,17,17,16,16,16,4,12,12,12,14,0],
  [6,6,6,5,16,4,4,4,12,12,12,14,0],
  [6,5,5,5,16,7,7,7,7,14,14,14,0],
  [9,9,5,16,16,7,7,2,10,14,14,14,0],
  [9,9,9,16,16,16,7,2,10,10,11,11,8],
  [9,15,15,16,10,10,10,10,10,10,11,11,8],
  [9,15,15,16,16,10,11,11,11,11,11,11,8],
  [9,15,15,15,15,15,15,11,15,1,8,8,8],
  [9,0,0,0,0,15,15,15,15,0,0,8,8]
];
