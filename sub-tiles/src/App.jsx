import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css';
import { SIZE, INITIAL_NOTICE, SAVE_KEY, TEXT } from './constants';
import { key, steps, limitFor, clueColor, cellsFor, pruneOrphans, validate } from './lib/grid';
import { buildPreset, thirteenSolution } from './lib/preset';
import { loadSave } from './lib/storage';
import { exampleThree, exampleFours } from './lib/example';
import Mark from './components/Mark';
import ExampleGrid from './components/ExampleGrid';

export default function App() {
  const [initial] = useState(buildPreset);
  // Checked once, at mount, so board/bases/notice can all seed from it below.
  const [savedOnLoad] = useState(loadSave);
  const [board, setBoard] = useState(savedOnLoad ? savedOnLoad.board : initial.board);
  const [seeds] = useState(initial.locked);
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);
  const draggedThisTurn = useRef(false);
  const dragOrigin = useRef(null);
  const dragChain = useRef([]);
  const [notice, setNotice] = useState(savedOnLoad ? TEXT.loadedProgress : INITIAL_NOTICE);
  const success = notice === TEXT.perfect;
  // Drives the arrow<->check swap as a two-step animation (out, then in)
  // instead of an instant swap: arrow spins down and shrinks away, then the
  // check grows in — and the reverse on reset, without the check "un-drawing".
  const [iconPhase, setIconPhase] = useState('arrow');
  const wasSuccess = useRef(false);
  useEffect(() => {
    if (success === wasSuccess.current) return;
    wasSuccess.current = success;
    const timers = [];
    const growIn = (startPhase, phase, settlePhase) => {
      setIconPhase(startPhase);
      requestAnimationFrame(() => requestAnimationFrame(() => setIconPhase(phase)));
      timers.push(setTimeout(() => setIconPhase(settlePhase), 300));
    };
    if (success) {
      setIconPhase('arrow-out');
      timers.push(setTimeout(() => growIn('check-in-start', 'check-in', 'check'), 300));
    } else {
      setIconPhase('check-out');
      timers.push(setTimeout(() => growIn('arrow-in-start', 'arrow-in', 'arrow'), 300));
    }
    return () => timers.forEach(clearTimeout);
  }, [success]);
  const [confirmAction, setConfirmAction] = useState(null); // null | 'reveal' | 'reset'
  // True only while the board still exactly matches what REVEAL SOLUTION put
  // there — cleared the moment the player edits anything, even back to the
  // same completed layout by their own solving.
  const [revealed, setRevealed] = useState(false);
  const limit = limitFor(SIZE);
  const totalTiles = limit * (limit + 1) / 2;
  const counts = useMemo(() => Array.from({length: limit}, (_, i) => cellsFor(board, i + 1).length), [board, limit]);
  // Values with no starting clue at all (e.g. 4, 7 in this puzzle).
  const seededValues = useMemo(() => {
    const s = new Set();
    seeds.forEach(k => { const [r,c] = k.split(':').map(Number); s.add(initial.board[r][c]); });
    return s;
  }, [seeds, initial]);
  // For a clue-less value, the first cell ever placed stands in for a clue as
  // the anchor other cells must stay connected to. If that cell is removed,
  // whichever neighbor of it is still on the board takes over as the anchor.
  const [bases, setBases] = useState(savedOnLoad ? savedOnLoad.bases : {});

  // Set by reset() so the save-clearing below isn't immediately undone by
  // this same effect re-saving the just-cleared board on the next run.
  const skipNextSave = useRef(false);
  // Auto-saves progress after every action (any board or base change) so it
  // can be picked back up on the next visit.
  useEffect(() => {
    if (skipNextSave.current) { skipNextSave.current = false; return; }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ board, bases }));
    } catch {
      // Storage unavailable (private browsing, quota, etc) — progress just
      // won't persist; nothing else to do about it.
    }
  }, [board, bases]);

  const update = (r,c,value) => {
    setBoard(old => old.map((row,ri) => row.map((v,ci) => ri === r && ci === c ? value : v)));
    setRevealed(false);
    if (value && !seededValues.has(value)) {
      setBases(prev => prev[value] ? prev : { ...prev, [value]: key(r,c) });
    }
  };
  // Clears a batch of same-valued cells, then removes any fragment left
  // stranded without a path back to an anchor (a locked clue, or a clue-less
  // value's tracked base). Returns how many extra cells the prune took
  // beyond the ones explicitly requested, so callers can mention it.
  const clearCells = (keys, value) => {
    const keySet = new Set(keys);
    const cleared = board.map((row,ri) => row.map((v,ci) => keySet.has(key(ri,ci)) ? 0 : v));
    let anchors = seeds;
    if (!seededValues.has(value)) {
      let base = bases[value];
      if (base && keySet.has(base)) {
        const [br,bc] = base.split(':').map(Number);
        const remaining = new Set(cellsFor(cleared, value).map(([r,c]) => key(r,c)));
        base = steps.map(([dr,dc]) => key(br+dr,bc+dc)).find(nk => remaining.has(nk));
        setBases(prev => ({ ...prev, [value]: base }));
      }
      anchors = base ? new Set([base]) : new Set();
    }
    const pruned = pruneOrphans(cleared, value, anchors);
    setBoard(pruned);
    setRevealed(false);
    return cellsFor(cleared, value).length - cellsFor(pruned, value).length;
  };
  const reset = () => {
    setBoard(old => old.map((row,r) => row.map((value,c) => seeds.has(key(r,c)) ? value : 0)));
    setRevealed(false);
    setBases({});
    setConfirmAction(null);
    setNotice(TEXT.gridReset);
    skipNextSave.current = true;
    try { localStorage.removeItem(SAVE_KEY); } catch {
      // Storage unavailable — nothing to clear.
    }
  };
  const check = () => {
    const issues = validate(board, limit);
    setNotice(issues.length ? TEXT.issueSuffix(issues[0]) : TEXT.perfect);
  };
  const revealSolution = () => {
    setBoard(thirteenSolution.map(row => row.slice()));
    setSelected(null);
    setRevealed(true);
    setBases({});
    setConfirmAction(null);
    setNotice(TEXT.solutionRevealed);
  };
  const requestReset = () => {
    const totalPlaced = counts.reduce((a,b) => a+b, 0);
    if (totalPlaced === seeds.size) { setNotice(TEXT.nothingToReset); return; }
    if (revealed) reset(); else setConfirmAction('reset');
  };
  const selectNumber = n => {
    const wasSelected = selected === n;
    setSelected(wasSelected ? null : n);
    if (wasSelected) return;
    if (counts[n - 1] >= n) setNotice(TEXT.tileDisabled(n));
    else if (counts[n - 1] > 0) setNotice(TEXT.placeAdjacent(n));
    else setNotice(TEXT.placeInGrid);
  };
  const beginDrag = (r,c) => {
    const value = board[r][c];
    if (value && counts[value - 1] < value) {
      draggedThisTurn.current = false;
      dragOrigin.current = key(r,c);
      dragChain.current = [];
      setDragging(value);
      return;
    }
    // Pressing an empty cell with a tile selected places it on the spot and
    // starts the drag from there, so growing a clue-less number doesn't need
    // a separate click before you can drag.
    if (!value && selected && counts[selected - 1] < selected) {
      const hasFriend = counts[selected - 1] === 0 || steps.some(([dr,dc]) => board[r+dr]?.[c+dc] === selected);
      if (hasFriend) {
        draggedThisTurn.current = true;
        dragOrigin.current = key(r,c);
        dragChain.current = [];
        setDragging(selected);
        update(r,c,selected);
      }
    }
  };
  // Retreating the drag back over ground covered this gesture trims the chain
  // back to the cursor's position, rather than only undoing the tip cell.
  const paint = (r,c) => {
    if (!dragging) return;
    const cellKey = key(r,c);
    if (cellKey === dragOrigin.current) {
      if (dragChain.current.length) {
        const extra = clearCells(dragChain.current, dragging);
        dragChain.current = [];
        draggedThisTurn.current = true;
        if (extra > 0) setNotice(TEXT.retreatedToStart(extra));
      }
      return;
    }
    const idx = dragChain.current.indexOf(cellKey);
    if (idx !== -1) {
      if (idx < dragChain.current.length - 1) {
        const removed = dragChain.current.splice(idx + 1);
        const extra = clearCells(removed, dragging);
        draggedThisTurn.current = true;
        if (extra > 0) setNotice(TEXT.trimmedBack(extra));
      }
      return;
    }
    if (board[r][c] || counts[dragging - 1] >= dragging) return;
    const hasFriend = steps.some(([dr,dc]) => board[r+dr]?.[c+dc] === dragging);
    if (hasFriend) {
      dragChain.current.push(cellKey);
      draggedThisTurn.current = true;
      update(r,c,dragging);
    }
  };
  const handleCellClick = (r,c) => {
    if (draggedThisTurn.current) { draggedThisTurn.current = false; return; }
    if (board[r][c]) {
      if (seeds.has(key(r,c))) { setNotice(TEXT.cluesLocked); return; }
      const extra = clearCells([key(r,c)], board[r][c]);
      setNotice(TEXT.tileRemoved(extra));
      return;
    }
    if (!selected) return;
    if (counts[selected - 1] >= selected) { setNotice(TEXT.tileDisabled(selected)); return; }
    const hasFriend = counts[selected - 1] === 0 || steps.some(([dr,dc]) => board[r+dr]?.[c+dc] === selected);
    if (!hasFriend) { setNotice(TEXT.placeAdjacent(selected)); return; }
    update(r,c,selected);
    setNotice(TEXT.placedTile(selected));
  };
  const endPointer = () => {
    setDragging(null);
    // A browser normally dispatches click after pointerup; if it suppresses that
    // click after a drag, clear the guard before the player's next interaction.
    setTimeout(() => { draggedThisTurn.current = false; }, 0);
  };

  return <main onPointerUp={endPointer} onPointerLeave={endPointer}>
    <header>
      <div className="brand"><Mark/><span>{TEXT.brand}</span></div>
    </header>

    <section className="hero">
      <div className="hero-inner">
      <h1><i>{TEXT.heroTitle}</i></h1>
      <div className="hero-row">
        <div className="rules">
          <p className="intro">{TEXT.rulesIntro1}</p>
          <p className="intro">{TEXT.rulesIntro2}</p>
        </div>
        <div className="example">
          <p className="panel-label">{TEXT.exampleLabel}</p>
          <div className="example-row">
            <ExampleGrid cells={exampleThree}/>
            <span className="example-arrow">→</span>
            <div className="example-variants">{exampleFours.map((cells, i) => <ExampleGrid key={i} cells={cells}/>)}</div>
          </div>
        </div>
      </div>
      </div>
    </section>

    <section className="workspace">
      <div className="board-wrap">
        <div className="board-meta"><span>{TEXT.gridLabel(SIZE)}</span><span>{TEXT.tilesLabel(counts.reduce((a,b) => a+b, 0), totalTiles)}</span></div>
        <div className="board" style={{gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`}}>
          {board.map((row,r) => row.map((value,c) => <button key={key(r,c)} style={value ? { backgroundColor: clueColor(value, limit) } : undefined} className={`cell ${value ? 'tile' : ''} ${value && board[r - 1]?.[c] === value ? 'join-top' : ''} ${value && board[r][c + 1] === value ? 'join-right' : ''} ${value && board[r + 1]?.[c] === value ? 'join-bottom' : ''} ${value && board[r][c - 1] === value ? 'join-left' : ''} ${seeds.has(key(r,c)) ? 'seed' : ''}`} onClick={() => handleCellClick(r,c)} onPointerDown={() => beginDrag(r,c)} onPointerEnter={() => paint(r,c)} aria-label={TEXT.cellAriaLabel(r, c, value)}>
            {value ? <><strong>{value}</strong>{seeds.has(key(r,c)) && <i className="lock">◆</i>}</> : <i/>}</button>))}
        </div>
      </div>

      <aside className="right-panel">
        <div className="panel-col">
          <div className="hint"><b>{TEXT.howToPlayTitle}</b><p>{TEXT.howToPlayBody}</p></div>
          <div className="message">{(() => {
            switch (iconPhase) {
              case 'arrow-out': return <span key="arrow" className="icon-arrow is-exiting">↑</span>;
              case 'check-in-start': return <span key="check" className="icon-check is-entering">✓</span>;
              case 'check-in': return <span key="check" className="icon-check is-entering is-grown">✓</span>;
              case 'check': return <span key="check" className="icon-check">✓</span>;
              case 'check-out': return <span key="check" className="icon-check is-exiting">✓</span>;
              case 'arrow-in-start': return <span key="arrow" className="icon-arrow is-entering">↑</span>;
              case 'arrow-in': return <span key="arrow" className="icon-arrow is-entering is-grown">↑</span>;
              default: return <span key="arrow" className={`icon-arrow ${notice !== INITIAL_NOTICE ? 'is-right' : ''}`}>↑</span>;
            }
          })()}<p>{notice}</p></div>
        </div>
        <div className="panel-col">
          <p className="panel-label">{TEXT.selectTileLabel}</p>
          <div className="numbers">{Array.from({length: limit}, (_,i) => <button key={i} onClick={() => selectNumber(i + 1)} className={`num-option ${selected === i + 1 ? 'is-selected' : ''} ${counts[i] >= i + 1 ? 'is-full' : ''}`}><span>{i+1}</span><small>{counts[i]}/{i+1}</small></button>)}</div>
        </div>
        <div className="controls">
          <button className="clear-btn" onClick={requestReset}>{TEXT.resetButton}</button>
          <button className="clear-btn" onClick={() => setConfirmAction('reveal')}>{TEXT.revealSolutionButton}</button>
          <button className="primary" onClick={check}>{TEXT.checkSolutionButton}</button>
        </div>
      </aside>
    </section>

    <section className="credit">
      <p>{TEXT.creditPre}<b>{TEXT.creditPuzzleName}</b>{TEXT.creditMid}<a href="https://www.janestreet.com/puzzles/subtiles-index/" target="_blank" rel="noopener noreferrer">{TEXT.creditLink}</a>.</p>
    </section>

    <footer><span>{TEXT.footer}</span></footer>

    {confirmAction && <div className="modal-veil" onClick={() => setConfirmAction(null)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <p className="panel-label">{confirmAction === 'reveal' ? TEXT.revealModalLabel : TEXT.resetModalLabel}</p>
        <h2>{confirmAction === 'reveal' ? TEXT.revealModalTitle : TEXT.resetModalTitle}</h2>
        <p>{confirmAction === 'reveal' ? TEXT.revealModalBody : TEXT.resetModalBody}</p>
        <div className="modal-actions">
          <button className="clear-btn" onClick={() => setConfirmAction(null)}>{TEXT.cancelButton}</button>
          <button className="primary" onClick={confirmAction === 'reveal' ? revealSolution : reset}>{confirmAction === 'reveal' ? TEXT.revealConfirmButton : TEXT.resetButton}</button>
        </div>
      </div>
    </div>}
  </main>;
}
