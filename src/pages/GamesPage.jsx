import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AmbientVoidBackground from '../components/AmbientVoidBackground';
import CursorRipples from '../components/CursorRipples';
import SectionAccent from '../components/SectionAccent';

const BLOCK_GRID_SIZE = 8;
const BLOCK_COLORS = [
  'bb-block--blue',
  'bb-block--violet',
  'bb-block--emerald',
  'bb-block--amber',
];

const COLOR_THEMES = [
  {
    name: 'Verdant',
    palette: [
      'bb-block--verdant-1',
      'bb-block--verdant-2',
      'bb-block--verdant-3',
      'bb-block--verdant-4',
      'bb-block--verdant-5',
      'bb-block--verdant-6',
      'bb-block--verdant-7',
      'bb-block--verdant-8',
    ],
  },
  {
    name: 'Sunset',
    palette: [
      'bb-block--sunset-1',
      'bb-block--sunset-2',
      'bb-block--sunset-3',
      'bb-block--sunset-4',
      'bb-block--sunset-5',
      'bb-block--sunset-6',
      'bb-block--sunset-7',
      'bb-block--sunset-8',
    ],
  },
  {
    name: 'Christmas',
    palette: [
      'bb-block--xmas-1',
      'bb-block--xmas-2',
      'bb-block--xmas-3',
      'bb-block--xmas-4',
      'bb-block--xmas-5',
      'bb-block--xmas-6',
      'bb-block--xmas-7',
      'bb-block--xmas-8',
    ],
  },
  {
    name: 'Indigo Tide',
    palette: [
      'bb-block--deep-1',
      'bb-block--deep-2',
      'bb-block--deep-3',
      'bb-block--deep-4',
      'bb-block--deep-5',
      'bb-block--deep-6',
      'bb-block--deep-7',
      'bb-block--deep-8',
    ],
  },
  {
    name: 'Chrome',
    palette: [
      'bb-block--chrome-1',
      'bb-block--chrome-2',
      'bb-block--chrome-3',
      'bb-block--chrome-4',
      'bb-block--chrome-5',
      'bb-block--chrome-6',
      'bb-block--chrome-7',
      'bb-block--chrome-8',
    ],
  },
];

const THEME_CYCLE_EVERY = 3;

const createShape = (id, cells) => {
  const width = Math.max(...cells.map(([x]) => x)) + 1;
  const height = Math.max(...cells.map(([, y]) => y)) + 1;
  const filled = Array.from({ length: width * height }, () => false);
  cells.forEach(([x, y]) => {
    filled[y * width + x] = true;
  });
  return { id, cells, width, height, filled };
};

const SHAPES = {
  easy: [
    createShape('dot', [[0, 0]]),
    createShape('line-2-h', [
      [0, 0],
      [1, 0],
    ]),
    createShape('line-2-v', [
      [0, 0],
      [0, 1],
    ]),
    createShape('line-3-h', [
      [0, 0],
      [1, 0],
      [2, 0],
    ]),
    createShape('line-3-v', [
      [0, 0],
      [0, 1],
      [0, 2],
    ]),
    createShape('line-4-h', [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ]),
    createShape('line-4-v', [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ]),
    createShape('square-2', [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]),
  ],
  medium: [
    createShape('corner-a', [
      [0, 0],
      [1, 0],
      [0, 1],
    ]),
    createShape('corner-b', [
      [0, 0],
      [1, 0],
      [1, 1],
    ]),
    createShape('corner-c', [
      [0, 0],
      [0, 1],
      [1, 1],
    ]),
    createShape('corner-d', [
      [1, 0],
      [0, 1],
      [1, 1],
    ]),
    createShape('l-4-a', [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ]),
    createShape('l-4-b', [
      [1, 0],
      [1, 1],
      [1, 2],
      [0, 2],
    ]),
    createShape('l-4-c', [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ]),
    createShape('l-4-d', [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ]),
    createShape('rect-2x3-h', [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ]),
    createShape('rect-2x3-v', [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
      [1, 2],
    ]),
  ],
  hard: [
    createShape('zig-a', [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ]),
    createShape('zig-b', [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ]),
    createShape('tee', [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]),
    createShape('line-5-h', [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ]),
    createShape('line-5-v', [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ]),
    createShape('big-square', [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]),
    createShape('big-l', [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]),
  ],
};

const SHAPE_WEIGHTS = {
  easy: 1,
  medium: 0.9,
  hard: 0.8,
};

const SHAPE_LIBRARY = Object.entries(SHAPES).flatMap(([tier, shapes]) =>
  shapes.map((shape) => ({ tier, shape }))
);

const createEmptyGrid = () =>
  Array.from({ length: BLOCK_GRID_SIZE }, () => Array(BLOCK_GRID_SIZE).fill(null));

const cellBit = (row, col) =>
  1n << BigInt(row * BLOCK_GRID_SIZE + col);

const ROW_MASKS = Array.from({ length: BLOCK_GRID_SIZE }, (_, row) => {
  let mask = 0n;
  for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
    mask |= cellBit(row, col);
  }
  return mask;
});

const COL_MASKS = Array.from({ length: BLOCK_GRID_SIZE }, (_, col) => {
  let mask = 0n;
  for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
    mask |= cellBit(row, col);
  }
  return mask;
});

const countBits = (mask) => {
  let value = mask;
  let count = 0;
  while (value) {
    value &= value - 1n;
    count += 1;
  }
  return count;
};

const gridToMask = (grid) => {
  let mask = 0n;
  for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
    for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
      if (grid[row][col]) {
        mask |= cellBit(row, col);
      }
    }
  }
  return mask;
};

const buildPlacementMask = (shape, row, col) => {
  let mask = 0n;
  shape.cells.forEach(([x, y]) => {
    mask |= cellBit(row + y, col + x);
  });
  return mask;
};

const SHAPE_PLACEMENTS = SHAPE_LIBRARY.reduce((map, { shape }) => {
  if (map[shape.id]) return map;

  const placements = [];
  for (let row = 0; row <= BLOCK_GRID_SIZE - shape.height; row += 1) {
    for (let col = 0; col <= BLOCK_GRID_SIZE - shape.width; col += 1) {
      placements.push({
        row,
        col,
        mask: buildPlacementMask(shape, row, col),
        cellCount: shape.cells.length,
      });
    }
  }
  map[shape.id] = placements;
  return map;
}, {});

const distanceBetweenRects = (a, b) => {
  const dx = Math.max(a.left - b.right, 0, b.left - a.right);
  const dy = Math.max(a.top - b.bottom, 0, b.top - a.bottom);
  return Math.hypot(dx, dy);
};

const canPlacePiece = (grid, piece, row, col) =>
  piece.cells.every(([x, y]) => {
    const targetRow = row + y;
    const targetCol = col + x;
    if (
      targetRow < 0 ||
      targetRow >= BLOCK_GRID_SIZE ||
      targetCol < 0 ||
      targetCol >= BLOCK_GRID_SIZE
    ) {
      return false;
    }
    return !grid[targetRow][targetCol];
  });

const placePiece = (grid, piece, row, col) => {
  const next = grid.map((line) => line.slice());
  piece.cells.forEach(([x, y]) => {
    next[row + y][col + x] = piece.color;
  });
  return next;
};

const clearLines = (grid) => {
  const rowsToClear = [];
  const colsToClear = [];
  for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
    if (grid[row].every(Boolean)) rowsToClear.push(row);
  }
  for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
    let full = true;
    for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
      if (!grid[row][col]) {
        full = false;
        break;
      }
    }
    if (full) colsToClear.push(col);
  }
  if (!rowsToClear.length && !colsToClear.length) {
    return { grid, linesCleared: 0, clearedRows: [], clearedCols: [] };
  }
  const next = grid.map((line) => line.slice());
  rowsToClear.forEach((row) => {
    for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
      next[row][col] = null;
    }
  });
  colsToClear.forEach((col) => {
    for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
      next[row][col] = null;
    }
  });
  return {
    grid: next,
    linesCleared: rowsToClear.length + colsToClear.length,
    clearedRows: rowsToClear,
    clearedCols: colsToClear,
  };
};

const clearLinesMask = (mask) => {
  const rowsToClear = [];
  const colsToClear = [];

  for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
    if ((mask & ROW_MASKS[row]) === ROW_MASKS[row]) rowsToClear.push(row);
  }
  for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
    if ((mask & COL_MASKS[col]) === COL_MASKS[col]) colsToClear.push(col);
  }
  if (!rowsToClear.length && !colsToClear.length) {
    return { mask, linesCleared: 0, clearedRows: [], clearedCols: [] };
  }

  let clearMask = 0n;
  rowsToClear.forEach((row) => {
    clearMask |= ROW_MASKS[row];
  });
  colsToClear.forEach((col) => {
    clearMask |= COL_MASKS[col];
  });

  return {
    mask: mask & ~clearMask,
    linesCleared: rowsToClear.length + colsToClear.length,
    clearedRows: rowsToClear,
    clearedCols: colsToClear,
  };
};

const scorePlacementMask = (boardMask, placement) => {
  if ((boardMask & placement.mask) !== 0n) return null;
  const placedMask = boardMask | placement.mask;
  const { mask: clearedMask, linesCleared } = clearLinesMask(placedMask);
  let nearComplete = 0;

  for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
    const filled = countBits(clearedMask & ROW_MASKS[row]);
    if (filled >= BLOCK_GRID_SIZE - 1) nearComplete += 1;
  }
  for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
    const filled = countBits(clearedMask & COL_MASKS[col]);
    if (filled >= BLOCK_GRID_SIZE - 1) nearComplete += 1;
  }

  return linesCleared * 1000 + nearComplete * 25 + placement.cellCount * 2;
};

const findBestPlacementForMask = (boardMask, shape) => {
  const placements = SHAPE_PLACEMENTS[shape.id] ?? [];
  let best = null;
  for (let i = 0; i < placements.length; i += 1) {
    const placement = placements[i];
    const score = scorePlacementMask(boardMask, placement);
    if (score === null) continue;
    if (!best || score > best.score) {
      best = {
        score,
        row: placement.row,
        col: placement.col,
        placementMask: placement.mask,
      };
    }
  }
  return best;
};

const scorePieceForMask = (boardMask, shape, weight) => {
  const best = findBestPlacementForMask(boardMask, shape);
  return best ? { score: best.score * weight + Math.random() * 4, best } : null;
};

const pickWeighted = (list) => {
  const minScore = Math.min(...list.map((item) => item.score));
  const weights = list.map((item) => Math.max(1, item.score - minScore + 1));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < list.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return list[i];
  }
  return list[list.length - 1];
};

const generatePieceSet = (grid, palette = BLOCK_COLORS) => {
  const picks = [];
  let workingMask = gridToMask(grid);

  for (let i = 0; i < 3; i += 1) {
    const candidates = SHAPE_LIBRARY.map(({ tier, shape }) => {
      const ranked = scorePieceForMask(workingMask, shape, SHAPE_WEIGHTS[tier] ?? 1);
      return { tier, shape, score: ranked?.score ?? null, best: ranked?.best ?? null };
    });
    const playable = candidates.filter((item) => item.score !== null);
    const pool = playable.length
      ? playable
      : candidates.map((item) => ({ ...item, score: 1 }));
    const sorted = [...pool].sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, Math.min(6, sorted.length));
    const list = Math.random() < 0.75 ? top : sorted;
    const chosen = pickWeighted(list);
    const color = palette[Math.floor(Math.random() * palette.length)];
    const piece = {
      key: `${chosen.tier}-${chosen.shape.id}-${Math.random().toString(36).slice(2, 8)}`,
      shapeId: chosen.shape.id,
      cells: chosen.shape.cells,
      width: chosen.shape.width,
      height: chosen.shape.height,
      filled: chosen.shape.filled,
      color,
    };
    picks.push(piece);

    if (chosen.best?.placementMask) {
      const placedMask = workingMask | chosen.best.placementMask;
      workingMask = clearLinesMask(placedMask).mask;
    }
  }

  return picks;
};

const hasMove = (grid, pieces) => {
  const boardMask = gridToMask(grid);
  return pieces.some((piece) => {
    if (!piece) return false;

    const placements = piece.shapeId ? SHAPE_PLACEMENTS[piece.shapeId] : null;
    if (placements) {
      return placements.some((placement) => (boardMask & placement.mask) === 0n);
    }

    for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
      for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
        if (canPlacePiece(grid, piece, row, col)) {
          return true;
        }
      }
    }
    return false;
  });
};

const getSnappedPlacement = (
  grid,
  piece,
  board,
  pieceLeft,
  pieceTop,
  maxRadius = 2,
  maxDistance = 1,
  boardRectOverride = null
) => {
  if (!board || !piece) return null;
  const rect = boardRectOverride ?? board.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  const cellSize = rect.width / BLOCK_GRID_SIZE;
  const rawCol = (pieceLeft - rect.left) / cellSize;
  const rawRow = (pieceTop - rect.top) / cellSize;
  const maxRow = BLOCK_GRID_SIZE - piece.height;
  const maxCol = BLOCK_GRID_SIZE - piece.width;

  const baseRow = Math.min(Math.max(Math.round(rawRow), 0), maxRow);
  const baseCol = Math.min(Math.max(Math.round(rawCol), 0), maxCol);

  if (canPlacePiece(grid, piece, baseRow, baseCol)) {
    return { row: baseRow, col: baseCol };
  }

  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let dr = -maxRadius; dr <= maxRadius; dr += 1) {
    for (let dc = -maxRadius; dc <= maxRadius; dc += 1) {
      const row = baseRow + dr;
      const col = baseCol + dc;
      if (row < 0 || row > maxRow || col < 0 || col > maxCol) continue;
      if (!canPlacePiece(grid, piece, row, col)) continue;
      const dist = dr * dr + dc * dc;
      if (dist < bestDist) {
        bestDist = dist;
        best = { row, col };
      }
    }
  }

  if (!best) return null;
  return bestDist <= maxDistance * maxDistance ? best : null;
};

const TinyRunner = () => {
  const arenaHeight = 200;
  const groundOffset = 30;
  const playerSize = 26;
  const playerX = 52;
  const gravity = 0.9;
  const jumpVelocity = -13;
  const speed = 6.2;

  const arenaRef = useRef(null);
  const widthRef = useRef(720);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const obstaclesRef = useRef([]);
  const playerRef = useRef({ y: 0, vy: 0, grounded: true });
  const rotationRef = useRef(0);
  const rotationActiveRef = useRef(false);
  const airTimeRef = useRef(0);
  const jumpDurationRef = useRef((2 * Math.abs(jumpVelocity)) / gravity);
  const spawnRef = useRef(0);
  const nextSpawnRef = useRef(70);
  const scoreRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState('Tap start or press space.');
  const [frame, setFrame] = useState({ playerY: 0, obstacles: [], rotation: 0 });

  const groundTop = arenaHeight - groundOffset;
  const floorY = groundTop - playerSize;

  const resetState = useCallback(() => {
    playerRef.current = { y: floorY, vy: 0, grounded: true };
    rotationRef.current = 0;
    rotationActiveRef.current = false;
    airTimeRef.current = 0;
    obstaclesRef.current = [];
    spawnRef.current = 0;
    nextSpawnRef.current = 60 + Math.random() * 60;
    scoreRef.current = 0;
    setScore(0);
    setFrame({ playerY: floorY, obstacles: [], rotation: 0 });
  }, [floorY]);

  const spawnObstacle = useCallback(() => {
    const isSpike = Math.random() < 0.65;
    const height = isSpike ? 24 + Math.random() * 20 : 18 + Math.random() * 26;
    const width = isSpike ? height : 14 + Math.random() * 18;
    obstaclesRef.current.push({
      x: widthRef.current + 20,
      width,
      height,
      type: isSpike ? 'spike' : 'block',
    });
  }, []);

  const startGame = useCallback(() => {
    resetState();
    setStatus('Run.');
    setRunning(true);
  }, [resetState]);

  const endGame = useCallback(() => {
    setRunning(false);
    setBest((prev) => Math.max(prev, Math.floor(scoreRef.current)));
    setStatus('Crashed. Tap restart.');
  }, []);

  const jump = useCallback(() => {
    const player = playerRef.current;
    if (!player.grounded) return;
    player.vy = jumpVelocity;
    player.grounded = false;
    rotationRef.current = 0;
    rotationActiveRef.current = true;
    airTimeRef.current = 0;
  }, []);

  const handleAction = useCallback(() => {
    if (!running) {
      startGame();
      return;
    }
    jump();
  }, [jump, running, startGame]);

  useEffect(() => {
    const updateWidth = () => {
      if (!arenaRef.current) return;
      widthRef.current = arenaRef.current.clientWidth || 720;
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(rafRef.current);
      return undefined;
    }

    lastTimeRef.current = 0;
    const loop = (ts) => {
      if (!running) return;
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = Math.min(2, (ts - lastTimeRef.current) / 16.67);
      lastTimeRef.current = ts;

      const player = playerRef.current;
      player.vy += gravity * dt;
      player.y += player.vy * dt;
      if (player.y >= floorY) {
        player.y = floorY;
        player.vy = 0;
        player.grounded = true;
        rotationRef.current = 0;
        rotationActiveRef.current = false;
        airTimeRef.current = 0;
      } else {
        if (rotationActiveRef.current) {
          airTimeRef.current += dt;
          const progress = Math.min(1, airTimeRef.current / jumpDurationRef.current);
          rotationRef.current = progress * 360;
        }
      }

      obstaclesRef.current = obstaclesRef.current
        .map((obstacle) => ({ ...obstacle, x: obstacle.x - speed * dt }))
        .filter((obstacle) => obstacle.x + obstacle.width > -40);

      spawnRef.current += dt;
      if (spawnRef.current >= nextSpawnRef.current) {
        spawnRef.current = 0;
        nextSpawnRef.current = 55 + Math.random() * 65;
        spawnObstacle();
      }

      const playerLeft = playerX;
      const playerRight = playerX + playerSize;
      const playerTop = player.y;
      const playerBottom = player.y + playerSize;

      const hit = obstaclesRef.current.some((obstacle) => {
        const insetX =
          obstacle.type === 'spike' ? obstacle.width * 0.2 : obstacle.width * 0.08;
        const insetY =
          obstacle.type === 'spike' ? obstacle.height * 0.2 : obstacle.height * 0.1;
        const obstacleLeft = obstacle.x + insetX;
        const obstacleRight = obstacle.x + obstacle.width - insetX;
        const obstacleTop =
          obstacle.type === 'spike'
            ? groundTop - obstacle.height + insetY
            : groundTop - obstacle.height + insetY;
        const obstacleBottom = groundTop;
        return (
          playerRight > obstacleLeft &&
          playerLeft < obstacleRight &&
          playerBottom > obstacleTop &&
          playerTop < obstacleBottom
        );
      });

      if (hit) {
        endGame();
        return;
      }

      scoreRef.current += dt;
      const nextScore = Math.floor(scoreRef.current);
      setScore((prev) => (prev === nextScore ? prev : nextScore));

      setFrame({
        playerY: player.y,
        obstacles: obstaclesRef.current,
        rotation: rotationRef.current,
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [endGame, floorY, gravity, groundTop, playerSize, playerX, running, spawnObstacle]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.code !== 'Space' && event.code !== 'ArrowUp') return;
      event.preventDefault();
      handleAction();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleAction]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest text-zinc-400">
        <span>Score: {score}</span>
        <span>Best: {best}</span>
        {running && <span>Jump: space / tap</span>}
      </div>
      <button
        type="button"
        onClick={handleAction}
        className="relative h-[200px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(30,58,138,0.18),rgba(15,23,42,0.1))] text-left"
        aria-label="Tiny runner arena"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute inset-x-0 bottom-[30px] h-px bg-blue-400/50" />
          <div className="absolute inset-x-0 bottom-0 h-[30px] bg-blue-900/25" />
        </div>
        <div
          className="absolute h-6 w-6 rounded-md bg-blue-500/80 shadow-[0_0_18px_rgba(59,130,246,0.4)]"
          style={{
            left: playerX,
            top: frame.playerY,
            transform: `rotate(${frame.rotation}deg)`,
            transformOrigin: 'center',
          }}
        />
        {frame.obstacles.map((obstacle, index) => {
          const baseStyle = {
            left: obstacle.x,
            width: obstacle.width,
            height: obstacle.height,
            top: groundTop - obstacle.height,
          };

          if (obstacle.type === 'spike') {
            return (
              <div
                key={`${index}-${obstacle.x}`}
                className="absolute gd-spike"
                style={{
                  ...baseStyle,
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                }}
              >
                <span className="gd-spike__inner" />
              </div>
            );
          }

          return (
            <div
              key={`${index}-${obstacle.x}`}
              className="absolute gd-block"
              style={baseStyle}
            />
          );
        })}
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300">
            <div className="text-xs uppercase tracking-[0.4em] text-blue-200">Tiny Runner</div>
            <div className="mt-3 text-xl font-semibold">{status}</div>
            <div className="mt-2 text-sm text-zinc-400">Tap the arena or press space.</div>
          </div>
        )}
      </button>
    </div>
  );
};

const BlockBlast = () => {
  const boardRef = useRef(null);
  const [grid, setGrid] = useState(createEmptyGrid);
  const themeRef = useRef(0);
  const setCounterRef = useRef(0);
  const clearsThisSetRef = useRef(0);
  const [pieces, setPieces] = useState(() =>
    generatePieceSet(createEmptyGrid(), COLOR_THEMES[0]?.palette ?? BLOCK_COLORS)
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverCell, setHoverCell] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [comboToast, setComboToast] = useState(null);
  const [popCells, setPopCells] = useState(null);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const comboToastRef = useRef(0);
  const popTimeoutRef = useRef(0);
  const dragRafRef = useRef(0);
  const dragGhostRef = useRef(null);
  const dragPointerRef = useRef({ x: 0, y: 0 });
  const lastPlacementRef = useRef(null);
  const lastDragPosRef = useRef(null);

  const cycleTheme = useCallback(() => {
    setCounterRef.current += 1;
    if (setCounterRef.current % THEME_CYCLE_EVERY === 0) {
      const nextTheme = (themeRef.current + 1) % COLOR_THEMES.length;
      themeRef.current = nextTheme;
    }
    return COLOR_THEMES[themeRef.current]?.palette ?? BLOCK_COLORS;
  }, []);

  const activeIndex = dragging ? dragging.index : selectedIndex;
  const activePiece = activeIndex !== null ? pieces[activeIndex] : null;

  useEffect(() => {
    if (selectedIndex !== null && pieces[selectedIndex]) return;
    const nextIndex = pieces.findIndex(Boolean);
    setSelectedIndex(nextIndex === -1 ? null : nextIndex);
  }, [pieces, selectedIndex]);

  useEffect(
    () => () => {
      if (comboToastRef.current) {
        clearTimeout(comboToastRef.current);
      }
      if (popTimeoutRef.current) {
        clearTimeout(popTimeoutRef.current);
      }
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
      }
    },
    []
  );

  const previewCells = useMemo(() => {
    if (!dragging || !activePiece || !hoverCell || gameOver) return null;
    if (!canPlacePiece(grid, activePiece, hoverCell.row, hoverCell.col)) return null;
    return new Set(
      activePiece.cells.map(
        ([x, y]) => `${hoverCell.row + y}-${hoverCell.col + x}`
      )
    );
  }, [activePiece, dragging, hoverCell, grid, gameOver]);

  const updateDragGhostPosition = useCallback((left, top) => {
    if (!dragGhostRef.current) return;
    dragGhostRef.current.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  }, []);

  const commitPlacement = useCallback(
    (pieceIndex, row, col) => {
      const piece = pieces[pieceIndex];
      if (!piece || gameOver) return false;
      if (!canPlacePiece(grid, piece, row, col)) return false;

      const placed = placePiece(grid, piece, row, col);
      const { grid: cleared, linesCleared, clearedRows, clearedCols } = clearLines(placed);
      let nextStreak = comboRef.current;
      let comboLevel = 0;
      if (linesCleared > 0) {
        nextStreak = comboRef.current + 1;
        comboRef.current = nextStreak;
        setComboStreak(nextStreak);
        clearsThisSetRef.current += 1;
        comboLevel = Math.max(0, nextStreak - 2);
      }
      if (linesCleared > 0) {
        const nextPop = {};
        clearedRows.forEach((row) => {
          for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
            const color = placed[row][col];
            if (color) nextPop[`${row}-${col}`] = color;
          }
        });
        clearedCols.forEach((col) => {
          for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
            const color = placed[row][col];
            if (color) nextPop[`${row}-${col}`] = color;
          }
        });
        if (popTimeoutRef.current) clearTimeout(popTimeoutRef.current);
        setPopCells(nextPop);
        popTimeoutRef.current = window.setTimeout(() => {
          setPopCells(null);
        }, 420);
      }
      const baseScore =
        piece.cells.length * 2 + linesCleared * BLOCK_GRID_SIZE * 3;
      const multiplier =
        linesCleared > 0 && comboLevel > 0 ? 1 + comboLevel * 3 : 1;
      const gained = baseScore * multiplier;
      const nextScore = scoreRef.current + gained;
      scoreRef.current = nextScore;
      setScore(nextScore);
      if (linesCleared > 0 && comboLevel > 0) {
        if (comboToastRef.current) clearTimeout(comboToastRef.current);
        setComboToast({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          comboLevel,
          multiplier,
          linesCleared,
        });
        comboToastRef.current = window.setTimeout(() => {
          setComboToast(null);
        }, 900);
      }

      let nextPieces = pieces.map((item, index) =>
        index === pieceIndex ? null : item
      );
      if (nextPieces.every((item) => !item)) {
        if (clearsThisSetRef.current === 0) {
          comboRef.current = 0;
          setComboStreak(0);
        }
        clearsThisSetRef.current = 0;
        const nextPalette = cycleTheme();
        nextPieces = generatePieceSet(cleared, nextPalette);
      }

      setGrid(cleared);
      setPieces(nextPieces);
      setHoverCell(null);

      if (!hasMove(cleared, nextPieces)) {
        setGameOver(true);
        setBest((prev) => Math.max(prev, nextScore));
      }

      return true;
    },
    [cycleTheme, gameOver, grid, pieces]
  );

  useEffect(() => {
    if (!dragging) return undefined;

    const getDragMetrics = (clientX, clientY) => {
      const board = boardRef.current;
      if (!board || !activePiece || !dragging) return null;
      const rect = dragging.boardRect ?? board.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      const cellSize = dragging.cellSize ?? rect.width / BLOCK_GRID_SIZE;
      const previewThreshold = dragging.previewThreshold ?? cellSize * 2.2;
      const liftRange = 240;
      const maxLift = 140;
      const baseLift = 48;
      const speedUp = 1.4;
      const speedDown = 1.0;
      const distance = clientY - rect.top;
      const clamped = Math.min(Math.max(distance, 0), liftRange);
      const extraLift = maxLift * (1 - clamped / liftRange);
      const dy = clientY - dragging.startY;
      const adjustedY = dy < 0 ? dy * speedUp : dy * speedDown;
      const left = clientX - dragging.offsetX;
      let top = dragging.startTop + adjustedY - extraLift;
      const minTop = clientY - dragging.offsetY - baseLift;
      if (top > minTop) top = minTop;
      const pieceRect = {
        left,
        top,
        right: left + activePiece.width * cellSize,
        bottom: top + activePiece.height * cellSize,
      };
      const proximity = distanceBetweenRects(rect, pieceRect);
      const placement =
        proximity <= previewThreshold
          ? getSnappedPlacement(grid, activePiece, board, left, top, 2, 1, rect)
          : null;
      return { left, top, placement };
    };

    const handleMove = (event) => {
      dragPointerRef.current = { x: event.clientX, y: event.clientY };
      if (dragRafRef.current) return;
      dragRafRef.current = window.requestAnimationFrame(() => {
        dragRafRef.current = 0;
        const { x, y } = dragPointerRef.current;
        const metrics = getDragMetrics(x, y);
        if (!metrics) return;
        const prevPos = lastDragPosRef.current;
        if (!prevPos || prevPos.left !== metrics.left || prevPos.top !== metrics.top) {
          lastDragPosRef.current = { left: metrics.left, top: metrics.top };
          updateDragGhostPosition(metrics.left, metrics.top);
        }
        const prevPlacement = lastPlacementRef.current;
        const nextPlacement = metrics.placement;
        const samePlacement =
          prevPlacement?.row === nextPlacement?.row &&
          prevPlacement?.col === nextPlacement?.col;
        if (!samePlacement) {
          lastPlacementRef.current = nextPlacement;
          setHoverCell(nextPlacement);
        }
      });
    };

    const handleUp = (event) => {
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = 0;
      }
      const metrics = getDragMetrics(event.clientX, event.clientY);
      if (metrics?.placement) {
        commitPlacement(dragging.index, metrics.placement.row, metrics.placement.col);
      }
      setDragging(null);
      setHoverCell(null);
      lastPlacementRef.current = null;
      lastDragPosRef.current = null;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      if (dragRafRef.current) {
        cancelAnimationFrame(dragRafRef.current);
        dragRafRef.current = 0;
      }
    };
  }, [activePiece, commitPlacement, dragging, grid, updateDragGhostPosition]);

  const reset = () => {
    setGrid(createEmptyGrid());
    setPieces(generatePieceSet(createEmptyGrid(), COLOR_THEMES[0]?.palette ?? BLOCK_COLORS));
    setSelectedIndex(0);
    setHoverCell(null);
    setDragging(null);
    setScore(0);
    scoreRef.current = 0;
    setComboStreak(0);
    comboRef.current = 0;
    setPopCells(null);
    if (popTimeoutRef.current) {
      clearTimeout(popTimeoutRef.current);
      popTimeoutRef.current = 0;
    }
    clearsThisSetRef.current = 0;
    themeRef.current = 0;
    setCounterRef.current = 0;
    setGameOver(false);
  };

  return (
    <div className="space-y-4" style={{ '--bb-cell-size': 'clamp(30px, 6vw, 46px)' }}>
      <div className="bb-scoreboard flex flex-wrap items-center justify-between gap-3">
        <span className="bb-score-pill">Score: {score}</span>
        <span className="bb-score-pill">Best: {best}</span>
        <span className="bb-score-pill">
          {comboStreak >= 3 ? `Combo x${comboStreak - 2}` : 'Combo --'}
        </span>
        {gameOver && <span className="bb-score-pill">No moves</span>}
      </div>
      <div className="flex flex-col items-center gap-5">
        <div className="bb-board">
          <div
            className="bb-grid"
            style={{
              gridTemplateColumns: `repeat(${BLOCK_GRID_SIZE}, var(--bb-cell-size))`,
            }}
            ref={boardRef}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const isPreview = previewCells?.has(key);
                const popColor = popCells?.[key];
                const isPop = Boolean(popColor);
                const isFilled = Boolean(cell || isPreview || popColor);
                const isGhost = Boolean(isPreview && !cell && !isPop);
                const colorClass =
                  cell || (isPreview ? activePiece?.color : '') || popColor || '';
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label={`Row ${rowIndex + 1} column ${colIndex + 1}`}
                    disabled={!activePiece || gameOver}
                    className={`bb-cell ${
                      isFilled ? 'bb-cell--filled' : 'bb-cell--empty'
                    } ${isGhost ? 'bb-cell--ghost' : ''} ${
                      isPop ? 'bb-cell--pop' : ''
                    } ${colorClass}`}
                  />
                );
              })
            )}
          </div>
          {gameOver && (
            <div className="bb-overlay">
              <div className="bb-overlay__lines" aria-hidden="true">
                <span className="bb-overlay__line bb-overlay__line--forward" />
                <span className="bb-overlay__line bb-overlay__line--back" />
              </div>
              <button
                type="button"
                onClick={reset}
                className="bb-overlay__button rounded-xl border border-red-300/40 bg-red-500/20 px-5 py-2 text-xs uppercase tracking-[0.35em] text-red-100 hover:bg-red-500/30"
              >
                Retry
              </button>
            </div>
          )}
          {comboToast && (
            <div key={comboToast.id} className="bb-combo-toast" aria-live="polite">
              <span className="bb-combo-toast__badge">Combo</span>
              <span className="bb-combo-toast__text">x{comboToast.comboLevel}</span>
              {comboToast.linesCleared > 1 && (
                <span className="bb-combo-toast__lines">
                  {comboToast.linesCleared} lines
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          {pieces.map((piece, index) => {
            const isActive = index === activeIndex && piece;
            return (
              <button
                key={piece?.key ?? `empty-${index}`}
                type="button"
                onClick={() => {
                  if (!piece || gameOver) return;
                  setSelectedIndex(index);
                }}
                onPointerDown={(event) => {
                  if (!piece || gameOver) return;
                  event.preventDefault();
                  const gridElement = event.currentTarget.querySelector('.bb-piece-grid');
                  if (!gridElement) return;
                  const rect = gridElement.getBoundingClientRect();
                  const board = boardRef.current;
                  if (board) {
                    const boardRect = board.getBoundingClientRect();
                    const liftRange = 240;
                    const maxLift = 140;
                    const baseLift = 48;
                    const cellSize = boardRect.width / BLOCK_GRID_SIZE;
                    const previewThreshold = cellSize * 2.2;
                    const trayRect = rect;
                    const pieceWidth = piece.width * cellSize;
                    const pieceHeight = piece.height * cellSize;
                    const grabOffsetX = pieceWidth / 2;
                    const grabOffsetY = pieceHeight / 2;
                    const startLeft = trayRect.left;
                    const startTop = trayRect.top - baseLift;
                    const distance = event.clientY - boardRect.top;
                    const clamped = Math.min(Math.max(distance, 0), liftRange);
                    const extraLift = maxLift * (1 - clamped / liftRange);
                    const top = startTop - extraLift;
                    setSelectedIndex(index);
                    dragPointerRef.current = { x: event.clientX, y: event.clientY };
                    setDragging({
                      index,
                      offsetX: grabOffsetX,
                      offsetY: grabOffsetY,
                      startX: event.clientX,
                      startY: event.clientY,
                      startLeft,
                      startTop,
                      initialLeft: startLeft,
                      initialTop: top,
                      boardRect,
                      cellSize,
                      previewThreshold,
                    });
                    updateDragGhostPosition(startLeft, top);
                    lastDragPosRef.current = { left: startLeft, top };
                    const pieceRect = {
                      left: startLeft,
                      top,
                      right: startLeft + pieceWidth,
                      bottom: top + pieceHeight,
                    };
                    const proximity = distanceBetweenRects(boardRect, pieceRect);
                    const initialPlacement =
                      proximity <= previewThreshold
                        ? getSnappedPlacement(
                            grid,
                            piece,
                            board,
                            startLeft,
                            top,
                            2,
                            1,
                            boardRect
                          )
                        : null;
                    setHoverCell(initialPlacement);
                    lastPlacementRef.current = initialPlacement;
                  } else {
                    const baseLift = 48;
                    const grabOffsetX = rect.width / 2;
                    const grabOffsetY = rect.height / 2;
                    const startLeft = rect.left;
                    const startTop = rect.top - baseLift;
                    setSelectedIndex(index);
                    dragPointerRef.current = { x: event.clientX, y: event.clientY };
                    setDragging({
                      index,
                      offsetX: grabOffsetX,
                      offsetY: grabOffsetY,
                      startX: event.clientX,
                      startY: event.clientY,
                      startLeft,
                      startTop,
                      initialLeft: startLeft,
                      initialTop: startTop,
                    });
                    updateDragGhostPosition(startLeft, startTop);
                    lastDragPosRef.current = { left: startLeft, top: startTop };
                    lastPlacementRef.current = null;
                  }
                }}
                disabled={!piece || gameOver}
                className={`bb-piece ${isActive ? 'bb-piece--active' : ''} ${
                  dragging?.index === index ? 'bb-piece--dragging' : ''
                } ${piece ? '' : 'opacity-40'}`}
                aria-pressed={isActive}
              >
                {piece ? (
                  <div
                    className="bb-grid bb-piece-grid"
                    style={{
                      gridTemplateColumns: `repeat(${piece.width}, var(--bb-cell-size))`,
                    }}
                  >
                    {Array.from({ length: piece.width * piece.height }).map((_, cellIndex) => {
                      const filled =
                        piece.filled?.[cellIndex] ??
                        piece.cells.some(
                          ([cellX, cellY]) =>
                            cellY * piece.width + cellX === cellIndex
                        );
                      return (
                        <div
                          key={`${piece.key}-${cellIndex}`}
                          className={`bb-cell ${
                            filled ? 'bb-cell--filled' : 'bb-cell--empty'
                          } ${filled ? piece.color : ''}`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="bb-piece-empty" />
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-white/10 bg-blue-500/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-blue-100 hover:bg-blue-500/30"
        >
          Restart
        </button>
      </div>
      {dragging && activePiece && (
        <div
          ref={dragGhostRef}
          className="bb-drag"
          style={{
            transform: `translate3d(${dragging.initialLeft ?? dragging.startLeft}px, ${
              dragging.initialTop ?? dragging.startTop
            }px, 0)`,
          }}
        >
          <div
            className="bb-grid bb-piece-grid"
            style={{
              gridTemplateColumns: `repeat(${activePiece.width}, var(--bb-cell-size))`,
            }}
          >
            {Array.from({ length: activePiece.width * activePiece.height }).map(
              (_, cellIndex) => {
                const filled =
                  activePiece.filled?.[cellIndex] ??
                  activePiece.cells.some(
                    ([cellX, cellY]) =>
                      cellY * activePiece.width + cellX === cellIndex
                  );
                return (
                  <div
                    key={`${activePiece.key}-drag-${cellIndex}`}
                    className={`bb-cell ${
                      filled ? 'bb-cell--filled' : 'bb-cell--empty'
                    } ${filled ? activePiece.color : ''}`}
                  />
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ReactionPulse = () => {
  const [phase, setPhase] = useState('idle');
  const [reaction, setReaction] = useState(null);
  const [best, setBest] = useState(null);
  const [message, setMessage] = useState('Click to arm the pulse.');
  const timeoutRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const arm = () => {
    setReaction(null);
    setPhase('waiting');
    setMessage('Hold... wait for the glow.');
    const delay = 800 + Math.random() * 1800;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase('ready');
      setMessage('NOW');
    }, delay);
  };

  const handleClick = () => {
    if (phase === 'idle') {
      arm();
      return;
    }
    if (phase === 'waiting') {
      clearTimeout(timeoutRef.current);
      setPhase('idle');
      setMessage('Too soon. Try again.');
      return;
    }
    if (phase === 'ready') {
      const time = Math.round(performance.now() - startRef.current);
      setReaction(time);
      setBest((prev) => (prev ? Math.min(prev, time) : time));
      setPhase('idle');
      setMessage('Click to run it back.');
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleClick}
        className={`w-full rounded-2xl border border-white/10 px-6 py-6 text-center transition-colors ${
          phase === 'ready' ? 'bg-blue-500/20 text-white' : 'bg-white/5 text-zinc-200'
        }`}
      >
        <div className="text-sm uppercase tracking-[0.35em] text-blue-200">Reaction Pulse</div>
        <div className="mt-2 text-2xl font-semibold">{message}</div>
        {reaction !== null && (
          <div className="mt-2 text-sm text-zinc-300">Last: {reaction} ms</div>
        )}
      </button>
      <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400">
        <span>Best: {best ? `${best} ms` : '--'}</span>
        <span>Tap when it lights</span>
      </div>
    </div>
  );
};

const AimTrainer = () => {
  const duration = 15;
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [target, setTarget] = useState({ x: 40, y: 40 });
  const arenaRef = useRef(null);

  const spawnTarget = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const size = 38;
    const pad = 8;
    const x = pad + Math.random() * Math.max(1, rect.width - size - pad * 2);
    const y = pad + Math.random() * Math.max(1, rect.height - size - pad * 2);
    setTarget({ x, y });
  }, []);

  const start = () => {
    setScore(0);
    setTimeLeft(duration);
    setRunning(true);
    spawnTarget();
  };

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setBest((prev) => Math.max(prev, score));
      setTimeLeft(duration);
    }
  }, [timeLeft, running, score]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400">
        <span>Score: {score}</span>
        <span>Best: {best}</span>
        <span>{running ? `${timeLeft}s` : '15s'}</span>
      </div>
      <div
        ref={arenaRef}
        className="relative h-44 w-full rounded-2xl border border-white/10 bg-white/5"
      >
        {running ? (
          <button
            type="button"
            onClick={() => {
              setScore((prev) => prev + 1);
              spawnTarget();
            }}
            className="absolute h-10 w-10 rounded-full bg-blue-500/70 shadow-[0_0_24px_rgba(59,130,246,0.45)]"
            style={{ left: target.x, top: target.y }}
            aria-label="Target"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Tap start and chase the dot.
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={start}
        className="w-full rounded-xl border border-white/10 bg-blue-500/20 px-4 py-2 text-sm uppercase tracking-[0.3em] text-blue-100 hover:bg-blue-500/30"
      >
        {running ? 'Running' : 'Start'}
      </button>
    </div>
  );
};

const PulseGrid = () => {
  const duration = 20;
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [active, setActive] = useState(null);
  const hopRef = useRef(null);
  const tickRef = useRef(null);

  const start = () => {
    setScore(0);
    setTimeLeft(duration);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return undefined;
    setActive(Math.floor(Math.random() * 9));
    hopRef.current = setInterval(() => {
      setActive(Math.floor(Math.random() * 9));
    }, 700);
    tickRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(hopRef.current);
      clearInterval(tickRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) {
      setRunning(false);
      setBest((prev) => Math.max(prev, score));
      setActive(null);
      setTimeLeft(duration);
    }
  }, [timeLeft, running, score]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400">
        <span>Score: {score}</span>
        <span>Best: {best}</span>
        <span>{running ? `${timeLeft}s` : '20s'}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (!running || active !== index) return;
              setScore((prev) => prev + 1);
              setActive(Math.floor(Math.random() * 9));
            }}
            className={`h-16 rounded-2xl border border-white/10 transition-colors ${
              active === index
                ? 'bg-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.35)]'
                : 'bg-white/5'
            }`}
            aria-label={`Cell ${index + 1}`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={start}
        className="w-full rounded-xl border border-white/10 bg-blue-500/20 px-4 py-2 text-sm uppercase tracking-[0.3em] text-blue-100 hover:bg-blue-500/30"
      >
        {running ? 'Running' : 'Start'}
      </button>
    </div>
  );
};

const GameCard = ({ title, description, children }) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.3 }}
    className="glass-card hover-change p-5 rounded-2xl space-y-4"
  >
    <div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
    {children}
  </motion.article>
);

const GamesPage = () => {
  return (
    <div className="relative bg-[#040a16] text-white cursor-crosshair">
      <AmbientVoidBackground />
      <CursorRipples />

      <div className="relative z-10 pt-16 pb-12">
        <header className="container mx-auto px-4 text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-400"
          >
            Games Arcade
          </motion.h1>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Work in progress. Enjoy :)
          </p>
          <SectionAccent className="mx-auto w-56 mt-6" />
        </header>

        <section className="container mx-auto px-4 space-y-6">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="glass-card hover-change p-6 rounded-3xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-2xl font-semibold text-white">Block Blast</div>
              </div>
            </div>
            <div className="mt-6">
              <BlockBlast />
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="glass-card hover-change p-6 rounded-3xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-2xl font-semibold text-white">Tiny Runner</div>
                <p className="text-sm text-zinc-400 max-w-lg">
                  Geometry dash dupe. Jump the blocks and see how long you last.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <TinyRunner />
            </div>
          </motion.article>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GameCard
              title="Reaction Pulse"
              description="Test how fast you can catch the signal."
            >
              <ReactionPulse />
            </GameCard>
            <GameCard
              title="Aim Trainer"
              description="Hit as many targets as you can in 15 seconds."
            >
              <AimTrainer />
            </GameCard>
            <GameCard
              title="Pulse Grid"
              description="Tap the lit cell before it jumps."
            >
              <PulseGrid />
            </GameCard>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GamesPage;
