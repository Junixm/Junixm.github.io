export const key = (r, c) => `${r}:${c}`;
export const steps = [[1,0],[-1,0],[0,1],[0,-1]];

export const makeBoard = n => Array.from({ length: n }, () => Array(n).fill(0));

// The total number of required tiles is 1 + 2 + ... + n = n(n + 1) / 2.
export const limitFor = n => Math.floor((Math.sqrt(1 + 8 * n * n) - 1) / 2);

export const clueColor = (value, limit) => `hsl(${Math.round((value - 1) * 360 / limit)}, 48%, 42%)`;

export function cellsFor(board, value) {
  const cells = [];
  board.forEach((row, r) => row.forEach((v, c) => v === value && cells.push([r, c])));
  return cells;
}

// After a removal, clears any fragment of this value that lost its last path
// back to an anchor cell (a locked clue, or — for a clue-less value — its
// tracked base tile). With no anchor at all, fragments are left alone.
export function pruneOrphans(board, value, anchors) {
  const cells = cellsFor(board, value);
  const hasAnchor = cells.some(([r,c]) => anchors.has(key(r,c)));
  if (!hasAnchor) return board;
  const cellSet = new Set(cells.map(([r,c]) => key(r,c)));
  const seen = new Set();
  const keep = new Set();
  cells.forEach(([r,c]) => {
    const startKey = key(r,c);
    if (seen.has(startKey)) return;
    const comp = [startKey];
    const queue = [[r,c]];
    seen.add(startKey);
    let compHasAnchor = anchors.has(startKey);
    while (queue.length) {
      const [cr,cc] = queue.shift();
      steps.forEach(([dr,dc]) => {
        const nr = cr+dr, nc = cc+dc, nk = key(nr,nc);
        if (cellSet.has(nk) && !seen.has(nk)) {
          seen.add(nk);
          comp.push(nk);
          if (anchors.has(nk)) compHasAnchor = true;
          queue.push([nr,nc]);
        }
      });
    }
    if (compHasAnchor) comp.forEach(k => keep.add(k));
  });
  if (keep.size === cells.length) return board;
  return board.map((row,r) => row.map((v,c) => (v === value && !keep.has(key(r,c))) ? 0 : v));
}

export function connected(cells) {
  if (!cells.length) return false;
  const all = new Set(cells.map(([r,c]) => key(r,c)));
  const seen = new Set([key(...cells[0])]);
  const queue = [cells[0]];
  while (queue.length) {
    const [r,c] = queue.shift();
    steps.forEach(([dr,dc]) => {
      const next = key(r+dr,c+dc);
      if (all.has(next) && !seen.has(next)) { seen.add(next); queue.push([r+dr,c+dc]); }
    });
  }
  return seen.size === cells.length;
}

// Returns all eight rotations/reflections, normalized to a top-left origin.
function transforms(shape) {
  const ops = [
    ([r,c]) => [r,c], ([r,c]) => [r,-c], ([r,c]) => [-r,c], ([r,c]) => [-r,-c],
    ([r,c]) => [c,r], ([r,c]) => [c,-r], ([r,c]) => [-c,r], ([r,c]) => [-c,-r]
  ];
  return ops.map(op => {
    const points = shape.map(op);
    const minR = Math.min(...points.map(p => p[0]));
    const minC = Math.min(...points.map(p => p[1]));
    return points.map(([r,c]) => [r-minR,c-minC]);
  });
}

// Checks whether large has a translated oriented copy of small as a subset.
function containsShape(large, small) {
  const largeSet = new Set(large.map(([r,c]) => key(r,c)));
  return transforms(small).some(form => large.some(([ar,ac]) => {
    const [fr,fc] = form[0];
    return form.every(([r,c]) => largeSet.has(key(ar + r - fr, ac + c - fc)));
  }));
}

export function validate(board, limit) {
  const issues = [];
  let previous = null;
  for (let n = 1; n <= limit; n++) {
    const cells = cellsFor(board, n);
    if (cells.length !== n) issues.push(`${n} needs ${n} cells (has ${cells.length})`);
    else if (!connected(cells)) issues.push(`${n}-omino is not connected`);
    else if (previous && !containsShape(cells, previous)) issues.push(`${n}-omino does not contain the ${n - 1}-omino`);
    previous = cells;
  }
  return issues;
}
