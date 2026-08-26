export const SIZE = 13;
export const INITIAL_NOTICE = 'How to play? Read above.';
export const SAVE_KEY = 'sub-tiles-save-v1';

// All player-facing copy, in one place. Plain strings for fixed labels,
// functions for anything that depends on live state.
export const TEXT = {
  brand: 'SUB-TILES',
  heroTitle: 'Rules',
  rulesIntro1: "Place a number or press and drag from a placed number cell between 1 and 17 into some of the empty cells in the grid. When completed, the grid should have one 1, two 2's, etc., up to seventeen 17's.",
  rulesIntro2: 'Furthermore, for all N larger than 1, the squares marked N must form a connected N-omino whose shape "contains" the (N-1)-omino determined by the (N-1)\'s. Reflections and rotation are allowed. Some of the cells have already been labeled.',
  exampleLabel: 'EXAMPLE',
  gridLabel: size => `${size} × ${size} GRID`,
  tilesLabel: (placed, total) => `${placed} / ${total} TILES`,
  cellAriaLabel: (r, c, value) => `row ${r + 1}, column ${c + 1}${value ? `, ${value}` : ', empty'}`,

  howToPlayTitle: 'HOW TO PLAY',
  howToPlayBody: 'Select a tile below, then click an empty cell in the grid to place it. Or press on a tile in the grid and drag across neighboring empty cells to grow it.',
  selectTileLabel: 'SELECT A TILE',

  resetButton: 'RESET',
  revealSolutionButton: 'REVEAL SOLUTION',
  checkSolutionButton: 'CHECK SOLUTION',
  cancelButton: 'CANCEL',
  revealConfirmButton: 'REVEAL',

  creditPre: 'Sub-Tiles is a recreation of the ',
  creditPuzzleName: 'Subtiles',
  creditMid: ' puzzle originally published by ',
  creditLink: 'Jane Street',
  footer: '© 2026 Junixm',

  revealModalLabel: 'REVEAL SOLUTION',
  resetModalLabel: 'RESET GRID',
  revealModalTitle: 'Show the full solution?',
  resetModalTitle: 'Reset the grid?',
  revealModalBody: "This fills the entire grid with the completed solution, overwriting anything you've placed.",
  resetModalBody: "This clears every tile you've placed, keeping only the starting clues.",

  loadedProgress: 'Loaded your saved progress.',
  gridReset: 'Grid reset.',
  solutionRevealed: 'Solution revealed.',
  nothingToReset: 'Nothing to reset.',
  cluesLocked: 'Clues cannot be removed.',
  placeInGrid: 'Place a tile in the grid.',
  perfect: 'Perfect! Every polyomino is connected and nested.',
  tileDisabled: n => `Tile disabled\n${n} is already complete.`,
  placeAdjacent: n => `Place ${n} adjacent to an existing ${n} tile.`,
  placedTile: n => `Placed a ${n} tile.`,
  issueSuffix: issue => `${issue}. Keep growing!`,
  tileRemoved: extra => `Tile removed.${TEXT.pruneNote(extra)}`,
  retreatedToStart: extra => `Retreated to the start.${TEXT.pruneNote(extra)}`,
  trimmedBack: extra => `Trimmed back the drag.${TEXT.pruneNote(extra)}`,
  pruneNote: extra => extra > 0 ? ` ${extra} disconnected tile${extra === 1 ? '' : 's'} also cleared.` : '',
};
