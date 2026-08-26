import { SAVE_KEY } from '../constants';

// Reads a previously auto-saved board/base state back out of localStorage.
// Returns null on first visit, or if the saved shape doesn't match this
// puzzle (wrong size, corrupted, from an older version, etc).
export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved.board) || saved.board.length !== 13) return null;
    if (!saved.board.every(row => Array.isArray(row) && row.length === 13)) return null;
    return { board: saved.board, bases: saved.bases && typeof saved.bases === 'object' ? saved.bases : {} };
  } catch {
    return null;
  }
}
