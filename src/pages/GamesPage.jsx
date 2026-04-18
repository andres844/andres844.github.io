import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AmbientVoidBackground from '../components/AmbientVoidBackground';
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
const ARCADE_MASTER_GAIN = 1;
const ARCADE_VOLUME_BOOST = 1.8;

const useArcadeAudio = () => {
  const audioRef = useRef({
    context: null,
    master: null,
    noiseBuffer: null,
  });

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;

    if (!audioRef.current.context) {
      const context = new AudioCtor();
      const master = context.createGain();
      const compressor = context.createDynamicsCompressor();
      master.gain.value = ARCADE_MASTER_GAIN;
      compressor.threshold.setValueAtTime(-20, context.currentTime);
      compressor.knee.setValueAtTime(18, context.currentTime);
      compressor.ratio.setValueAtTime(6, context.currentTime);
      compressor.attack.setValueAtTime(0.003, context.currentTime);
      compressor.release.setValueAtTime(0.18, context.currentTime);
      master.connect(compressor);
      compressor.connect(context.destination);
      audioRef.current.context = context;
      audioRef.current.master = master;
    }

    return audioRef.current.context;
  }, []);

  const ensureNoiseBuffer = useCallback((context) => {
    if (!context) return null;
    const cached = audioRef.current.noiseBuffer;
    if (cached && cached.sampleRate === context.sampleRate) return cached;

    const length = context.sampleRate * 0.25;
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      channel[i] = Math.random() * 2 - 1;
    }
    audioRef.current.noiseBuffer = buffer;
    return buffer;
  }, []);

  const unlock = useCallback(async () => {
    const context = getContext();
    if (!context) return false;
    if (context.state === 'suspended') {
      try {
        await context.resume();
      } catch {
        return false;
      }
    }
    return context.state === 'running';
  }, [getContext]);

  const playTone = useCallback(
    ({
      frequency,
      type = 'triangle',
      volume = 0.05,
      attack = 0.003,
      release = 0.12,
      delay = 0,
      slideTo = null,
      slideTime = 0.08,
      detune = 0,
    }) => {
      const context = getContext();
      const master = audioRef.current.master;
      if (!context || !master || context.state !== 'running') return;

      const start = context.currentTime + delay;
      const end = start + attack + release;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const boostedVolume = Math.min(0.98, volume * ARCADE_VOLUME_BOOST);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(Math.max(1, frequency), start);
      oscillator.detune.setValueAtTime(detune, start);
      if (slideTo) {
        oscillator.frequency.exponentialRampToValueAtTime(
          Math.max(1, slideTo),
          start + slideTime
        );
      }

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(boostedVolume, start + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(start);
      oscillator.stop(end + 0.03);
    },
    [getContext]
  );

  const playNoise = useCallback(
    ({
      volume = 0.035,
      duration = 0.07,
      delay = 0,
      highpass = 500,
      lowpass = 5000,
    }) => {
      const context = getContext();
      const master = audioRef.current.master;
      if (!context || !master || context.state !== 'running') return;

      const buffer = ensureNoiseBuffer(context);
      if (!buffer) return;

      const start = context.currentTime + delay;
      const source = context.createBufferSource();
      const gain = context.createGain();
      const highpassFilter = context.createBiquadFilter();
      const lowpassFilter = context.createBiquadFilter();
      const boostedVolume = Math.min(0.98, volume * ARCADE_VOLUME_BOOST);

      source.buffer = buffer;
      highpassFilter.type = 'highpass';
      highpassFilter.frequency.setValueAtTime(highpass, start);
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.setValueAtTime(lowpass, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(boostedVolume, start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      source.connect(highpassFilter);
      highpassFilter.connect(lowpassFilter);
      lowpassFilter.connect(gain);
      gain.connect(master);

      source.start(start);
      source.stop(start + duration + 0.02);
    },
    [ensureNoiseBuffer, getContext]
  );

  const playBlockPlace = useCallback(
    (cellCount = 1) => {
      const sizeBias = Math.min(5, cellCount);
      playTone({
        frequency: 220 + sizeBias * 16,
        slideTo: 170 + sizeBias * 12,
        type: 'triangle',
        volume: 0.04,
        release: 0.08,
      });
      playTone({
        frequency: 540 + sizeBias * 18,
        slideTo: 430 + sizeBias * 12,
        type: 'sine',
        volume: 0.022,
        delay: 0.014,
        release: 0.06,
      });
    },
    [playTone]
  );

  const playBlockClear = useCallback(
    (linesCleared = 1, comboLevel = 0) => {
      const popCount = Math.min(4, Math.max(1, linesCleared + comboLevel));
      for (let i = 0; i < popCount; i += 1) {
        const base = 240 + i * 48 + linesCleared * 22;
        playTone({
          frequency: base,
          slideTo: base + 170,
          slideTime: 0.045,
          type: 'sine',
          volume: 0.052 + comboLevel * 0.006,
          delay: i * 0.04,
          release: 0.085,
        });
        playTone({
          frequency: base * 0.82,
          slideTo: base + 92,
          slideTime: 0.035,
          type: 'triangle',
          volume: 0.022 + linesCleared * 0.004,
          delay: i * 0.04 + 0.006,
          release: 0.06,
        });
        playNoise({
          volume: 0.01 + linesCleared * 0.003,
          duration: 0.03,
          delay: i * 0.04 + 0.004,
          highpass: 220 + i * 30,
          lowpass: 2400 + i * 140,
        });
      }

      if (comboLevel > 0) {
        playTone({
          frequency: 620 + comboLevel * 35,
          slideTo: 880 + comboLevel * 42,
          type: 'sine',
          volume: 0.032,
          delay: popCount * 0.03,
          release: 0.12,
        });
      }
    },
    [playNoise, playTone]
  );

  const midiToFrequency = useCallback((midi) => 440 * 2 ** ((midi - 69) / 12), []);

  const playRunnerJump = useCallback(
    (jumpIndex = 0, isShortJump = false) => {
      const rootMidi = 57; // A3
      const melody = [12, 15, 19, 22, 19, 15, 12, 10, 12, 15, 19, 24];
      const accent = [7, 10, 12, 15, 12, 10];
      const leadMidi = rootMidi + melody[jumpIndex % melody.length];
      const accentMidi = rootMidi + accent[jumpIndex % accent.length];
      const leadFrequency = midiToFrequency(leadMidi);
      const accentFrequency = midiToFrequency(accentMidi);
      const supportFrequency = midiToFrequency(leadMidi - 12);
      const isAnchorJump = jumpIndex % 6 === 5;

      playTone({
        frequency: leadFrequency,
        slideTo: leadFrequency * (isShortJump ? 1.03 : 1.07),
        type: 'triangle',
        volume: isShortJump ? 0.058 : 0.076,
        attack: 0.0015,
        release: isShortJump ? 0.075 : 0.115,
        detune: 3,
      });
      playTone({
        frequency: leadFrequency * 2,
        slideTo: leadFrequency * (isShortJump ? 1.95 : 2.08),
        type: 'square',
        volume: isShortJump ? 0.012 : 0.018,
        delay: 0.01,
        release: 0.06,
        detune: -5,
      });
      playTone({
        frequency: accentFrequency,
        slideTo: accentFrequency * 0.97,
        type: 'sine',
        volume: 0.026,
        delay: 0.02,
        release: 0.09,
      });
      playTone({
        frequency: supportFrequency,
        slideTo: supportFrequency * 0.96,
        type: 'triangle',
        volume: 0.022,
        attack: 0.002,
        release: 0.12,
      });
      playNoise({
        volume: isShortJump ? 0.006 : 0.009,
        duration: 0.028,
        highpass: 1800,
        lowpass: 4200,
      });
      if (isAnchorJump) {
        const bassFrequency = midiToFrequency(rootMidi - 5);
        playTone({
          frequency: bassFrequency,
          slideTo: bassFrequency * 1.08,
          type: 'sine',
          volume: 0.05,
          attack: 0.002,
          release: 0.18,
        });
        playTone({
          frequency: bassFrequency * 1.5,
          slideTo: bassFrequency * 1.42,
          type: 'square',
          volume: 0.016,
          attack: 0.003,
          delay: 0.016,
          release: 0.09,
        });
      }
    },
    [midiToFrequency, playNoise, playTone]
  );

  const playRunnerLand = useCallback(
    (hardLanding = false) => {
      playTone({
        frequency: hardLanding ? 180 : 210,
        slideTo: hardLanding ? 120 : 150,
        type: 'triangle',
        volume: hardLanding ? 0.038 : 0.026,
        release: 0.05,
      });
    },
    [playTone]
  );

  const playRunnerCrash = useCallback(() => {
    playTone({
      frequency: 72,
      slideTo: 32,
      type: 'sine',
      volume: 0.13,
      attack: 0.003,
      release: 0.48,
    });
    playTone({
      frequency: 96,
      slideTo: 42,
      type: 'triangle',
      volume: 0.1,
      attack: 0.004,
      release: 0.38,
      delay: 0.012,
      detune: -9,
    });
    playTone({
      frequency: 410,
      slideTo: 74,
      type: 'square',
      volume: 0.048,
      attack: 0.001,
      release: 0.09,
    });
    playNoise({
      volume: 0.092,
      duration: 0.32,
      highpass: 60,
      lowpass: 1050,
    });
    playTone({
      frequency: 148,
      slideTo: 54,
      type: 'sawtooth',
      volume: 0.058,
      attack: 0.003,
      release: 0.24,
      delay: 0.045,
    });
    playNoise({
      volume: 0.05,
      duration: 0.52,
      delay: 0.06,
      highpass: 140,
      lowpass: 1900,
    });
  }, [playNoise, playTone]);

  useEffect(
    () => () => {
      if (audioRef.current.context) {
        audioRef.current.context.close().catch(() => {});
        audioRef.current.context = null;
        audioRef.current.master = null;
        audioRef.current.noiseBuffer = null;
      }
    },
    []
  );

  return useMemo(
    () => ({
      unlock,
      playBlockPlace,
      playBlockClear,
      playRunnerJump,
      playRunnerLand,
      playRunnerCrash,
    }),
    [
      playBlockClear,
      playBlockPlace,
      playRunnerCrash,
      playRunnerJump,
      playRunnerLand,
      unlock,
    ]
  );
};

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

const CELL_MASKS = Array.from({ length: BLOCK_GRID_SIZE * BLOCK_GRID_SIZE }, (_, index) =>
  1n << BigInt(index)
);

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

const SHAPE_PLACEMENT_LOOKUP = Object.entries(SHAPE_PLACEMENTS).reduce(
  (shapeMap, [shapeId, placements]) => {
    shapeMap[shapeId] = placements.reduce((placementMap, placement) => {
      placementMap[`${placement.row}-${placement.col}`] = placement;
      return placementMap;
    }, {});
    return shapeMap;
  },
  {}
);

const distanceBetweenRects = (a, b) => {
  const dx = Math.max(a.left - b.right, 0, b.left - a.right);
  const dy = Math.max(a.top - b.bottom, 0, b.top - a.bottom);
  return Math.hypot(dx, dy);
};

const getPlacementAt = (piece, row, col) => {
  if (!piece) return null;
  const maxRow = BLOCK_GRID_SIZE - piece.height;
  const maxCol = BLOCK_GRID_SIZE - piece.width;
  if (row < 0 || row > maxRow || col < 0 || col > maxCol) return null;

  const cached = piece.shapeId
    ? SHAPE_PLACEMENT_LOOKUP[piece.shapeId]?.[`${row}-${col}`]
    : null;
  if (cached) return cached;

  return {
    row,
    col,
    mask: buildPlacementMask(piece, row, col),
    cellCount: piece.cells.length,
  };
};

const canPlacePieceMask = (boardMask, piece, row, col) => {
  const placement = getPlacementAt(piece, row, col);
  return placement ? (boardMask & placement.mask) === 0n : false;
};

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

const hasMoveForMask = (boardMask, pieces) => {
  return pieces.some((piece) => {
    if (!piece) return false;

    const placements = piece.shapeId ? SHAPE_PLACEMENTS[piece.shapeId] : null;
    if (placements) {
      return placements.some((placement) => (boardMask & placement.mask) === 0n);
    }

    for (let row = 0; row < BLOCK_GRID_SIZE; row += 1) {
      for (let col = 0; col < BLOCK_GRID_SIZE; col += 1) {
        if (canPlacePieceMask(boardMask, piece, row, col)) {
          return true;
        }
      }
    }
    return false;
  });
};

const getSnappedPlacement = (
  boardMask,
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

  const basePlacement = getPlacementAt(piece, baseRow, baseCol);
  if (basePlacement && (boardMask & basePlacement.mask) === 0n) {
    return basePlacement;
  }

  let best = null;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let dr = -maxRadius; dr <= maxRadius; dr += 1) {
    for (let dc = -maxRadius; dc <= maxRadius; dc += 1) {
      const row = baseRow + dr;
      const col = baseCol + dc;
      if (row < 0 || row > maxRow || col < 0 || col > maxCol) continue;
      const placement = getPlacementAt(piece, row, col);
      if (!placement || (boardMask & placement.mask) !== 0n) continue;
      const dist = dr * dr + dc * dc;
      if (dist < bestDist) {
        bestDist = dist;
        best = placement;
      }
    }
  }

  if (!best) return null;
  return bestDist <= maxDistance * maxDistance ? best : null;
};

const RUNNER_CELL_SIZE = 32;
const RUNNER_JUMP_ROTATION_DEGREES = 180;
const RUNNER_THEME_CYCLE_EVERY = 4;
const RUNNER_JUMP_BUFFER_FRAMES = 7;
const RUNNER_COYOTE_FRAMES = 5;
const RUNNER_LOW_JUMP_GRAVITY_MULTIPLIER = 1.35;
const RUNNER_SHORT_JUMP_VELOCITY = -10.5;
const RUNNER_RELEASE_VELOCITY = -9.2;
const RUNNER_CHAIN_JUMP_FRAMES = 28.6;
const RUNNER_CHAIN_SPEED_LEAD = 0.1;
const RUNNER_SECTION_GAP = 270;
const RUNNER_SECTION_GAP_RANDOM = 50;
const RUNNER_DEATH_BURST_DURATION_MS = 620;
const RUNNER_TOP_LANDING_TOLERANCE = 18;
const RUNNER_BODY_TOP_INSET = 4;
const RUNNER_BODY_SIDE_INSET = 5;
const RUNNER_BODY_BOTTOM_INSET = 4;
const RUNNER_FEET_SIDE_INSET = 7;
const RUNNER_SIDE_COLLISION_DEPTH = 8;
const RUNNER_BURST_PIXEL_SIZE = 6;
const RUNNER_BURST_COLORS = [
  '#f8fafc',
  '#dbeafe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6',
  '#1d4ed8',
  '#facc15',
  '#f97316',
];

const RUNNER_CHALLENGES = [
  {
    id: 'single-hop',
    minScore: 0,
    weight: 3,
    pieces: [{ type: 'block', widthCells: 1, heightCells: 1, offset: 0 }],
  },
  {
    id: 'two-high',
    minScore: 4,
    weight: 2,
    pieces: [{ type: 'block', widthCells: 1, heightCells: 2, offset: 0 }],
  },
  {
    id: 'staircase',
    minScore: 8,
    weight: 4,
    pieces: [
      { type: 'block', widthCells: 1, heightCells: 1, chainStep: 0 },
      { type: 'block', widthCells: 1, heightCells: 2, chainStep: 1 },
      { type: 'block', widthCells: 1, heightCells: 3, chainStep: 2 },
    ],
  },
  {
    id: 'spike-pad',
    minScore: 12,
    weight: 2,
    pieces: [
      { type: 'spike', widthCells: 1, heightCells: 1, offset: 0 },
      { type: 'block', widthCells: 1, heightCells: 1, offset: 156 },
      { type: 'spike', widthCells: 1, heightCells: 1, offset: 312 },
    ],
  },
  {
    id: 'platform-run',
    minScore: 18,
    weight: 2,
    pieces: [
      { type: 'block', widthCells: 3, heightCells: 1, offset: 0 },
      { type: 'spike', widthCells: 1, heightCells: 1, offset: 208 },
      { type: 'block', widthCells: 1, heightCells: 2, offset: 362 },
    ],
  },
  {
    id: 'split-stairs',
    minScore: 28,
    weight: 2,
    pieces: [
      { type: 'block', widthCells: 2, heightCells: 1, chainStep: 0 },
      { type: 'block', widthCells: 1, heightCells: 2, chainStep: 1 },
      { type: 'block', widthCells: 2, heightCells: 3, chainStep: 2 },
    ],
  },
];

const RUNNER_OPENING_SEQUENCE = ['single-hop', 'two-high', 'staircase'];

const getRunnerPalette = (themeIndex) =>
  COLOR_THEMES[themeIndex]?.palette ?? BLOCK_COLORS;

const getRunnerSpecWidth = (spec) =>
  (spec.widthCells ?? 1) * RUNNER_CELL_SIZE;

const getRunnerSpecHeight = (spec) =>
  (spec.heightCells ?? 1) * RUNNER_CELL_SIZE;

const getRunnerPieceOffset = (piece, speed) =>
  piece.offset ??
  Math.round(piece.chainStep * RUNNER_CHAIN_JUMP_FRAMES * (speed + RUNNER_CHAIN_SPEED_LEAD));

const pickRunnerChallenge = (score, challengeIndex) => {
  const scriptedId = RUNNER_OPENING_SEQUENCE[challengeIndex];
  const scripted = scriptedId
    ? RUNNER_CHALLENGES.find((challenge) => challenge.id === scriptedId)
    : null;
  if (scripted) return scripted;

  const unlocked = RUNNER_CHALLENGES.filter((challenge) => score >= challenge.minScore);
  const pool = unlocked.length ? unlocked : [RUNNER_CHALLENGES[0]];
  const totalWeight = pool.reduce((sum, challenge) => sum + challenge.weight, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < pool.length; i += 1) {
    roll -= pool[i].weight;
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
};

const rectanglesOverlap = (a, b) =>
  a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;

const createRunnerBurstParticles = () => {
  const particles = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const dxBase = col - 1.5;
      const dyBase = row - 1.5;
      const angle = Math.atan2(dyBase, dxBase) + (Math.random() - 0.5) * 0.42;
      const speed = 18 + Math.random() * 20 + (row === 0 ? 8 : 0);
      particles.push({
        id: `${row}-${col}`,
        left: col * RUNNER_BURST_PIXEL_SIZE,
        top: row * RUNNER_BURST_PIXEL_SIZE,
        size: RUNNER_BURST_PIXEL_SIZE - (Math.random() > 0.65 ? 1 : 0),
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 10 - Math.random() * 10,
        rotate: (Math.random() - 0.5) * 180,
        color:
          RUNNER_BURST_COLORS[
            (row * 4 + col + Math.floor(Math.random() * 3)) % RUNNER_BURST_COLORS.length
          ],
        delay: Math.random() * 0.05,
      });
    }
  }
  return particles;
};

const TinyRunner = ({ audio }) => {
  const arenaHeight = 200;
  const groundOffset = 30;
  const playerSize = 24;
  const playerX = 52;
  const gravity = 0.9;
  const jumpVelocity = -13;
  const baseSpeed = 5.9;

  const arenaRef = useRef(null);
  const widthRef = useRef(720);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const obstaclesRef = useRef([]);
  const playerRef = useRef({ y: 0, vy: 0, grounded: true });
  const rotationRef = useRef(0);
  const rotationActiveRef = useRef(false);
  const jumpStartRotationRef = useRef(0);
  const airTimeRef = useRef(0);
  const jumpDurationRef = useRef((2 * Math.abs(jumpVelocity)) / gravity);
  const spawnRef = useRef(0);
  const nextSpawnRef = useRef(70);
  const scoreRef = useRef(0);
  const themeIndexRef = useRef(0);
  const challengeIndexRef = useRef(0);
  const jumpBufferRef = useRef(0);
  const jumpHeldRef = useRef(false);
  const coyoteRef = useRef(RUNNER_COYOTE_FRAMES);
  const deathBurstTimeoutRef = useRef(0);
  const jumpMelodyRef = useRef(0);
  const restartReadyRef = useRef(true);
  const restartReleaseGateRef = useRef(false);

  const [running, setRunning] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState('Tap start or press space.');
  const [deathBurst, setDeathBurst] = useState(null);
  const [frame, setFrame] = useState({
    playerY: 0,
    obstacles: [],
    rotation: 0,
  });

  const groundTop = arenaHeight - groundOffset;
  const floorY = groundTop - playerSize;

  const resetState = useCallback(() => {
    playerRef.current = { y: floorY, vy: 0, grounded: true };
    rotationRef.current = 0;
    rotationActiveRef.current = false;
    jumpStartRotationRef.current = 0;
    airTimeRef.current = 0;
    obstaclesRef.current = [];
    spawnRef.current = 0;
    nextSpawnRef.current = 44;
    scoreRef.current = 0;
    themeIndexRef.current = 0;
    challengeIndexRef.current = 0;
    jumpBufferRef.current = 0;
    jumpHeldRef.current = false;
    coyoteRef.current = RUNNER_COYOTE_FRAMES;
    jumpMelodyRef.current = 0;
    restartReadyRef.current = true;
    restartReleaseGateRef.current = false;
    if (deathBurstTimeoutRef.current) {
      clearTimeout(deathBurstTimeoutRef.current);
      deathBurstTimeoutRef.current = 0;
    }
    setDeathBurst(null);
    setScore(0);
    setFrame({ playerY: floorY, obstacles: [], rotation: 0 });
  }, [floorY]);

  const spawnChallenge = useCallback((speed) => {
    const challengeNumber = challengeIndexRef.current;
    if (challengeNumber > 0 && challengeNumber % RUNNER_THEME_CYCLE_EVERY === 0) {
      themeIndexRef.current = (themeIndexRef.current + 1) % COLOR_THEMES.length;
    }

    const challenge = pickRunnerChallenge(scoreRef.current, challengeNumber);
    const palette = getRunnerPalette(themeIndexRef.current);
    const spawnX = widthRef.current + 4;
    const obstacles = challenge.pieces.map((piece, pieceIndex) => {
      const widthCells = piece.widthCells ?? 1;
      const heightCells = piece.heightCells ?? 1;
      const cellCount = widthCells * heightCells;
      const colorStart = (challengeNumber + pieceIndex * 2) % palette.length;
      const color = palette[colorStart];
      const offset = getRunnerPieceOffset(piece, speed);

      return {
        id: `${challenge.id}-${challengeNumber}-${pieceIndex}`,
        x: spawnX + offset,
        offset,
        width: getRunnerSpecWidth(piece),
        height: getRunnerSpecHeight(piece),
        widthCells,
        heightCells,
        type: piece.type,
        color,
        tileColors: Array.from({ length: cellCount }, () => color),
      };
    });

    obstaclesRef.current = obstaclesRef.current.concat(obstacles);
    challengeIndexRef.current = challengeNumber + 1;

    return Math.max(...obstacles.map((obstacle) => obstacle.offset + obstacle.width));
  }, []);

  const startGame = useCallback(() => {
    resetState();
    setPlayerVisible(true);
    setStatus('Run.');
    setRunning(true);
  }, [resetState]);

  const endGame = useCallback(() => {
    setRunning(false);
    setPlayerVisible(false);
    setBest((prev) => Math.max(prev, Math.floor(scoreRef.current)));
    setStatus('Crashed.');
    audio?.playRunnerCrash();
  }, [audio]);

  const triggerDeathBurst = useCallback(
    (y) => {
      restartReadyRef.current = false;
      restartReleaseGateRef.current = jumpHeldRef.current;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setDeathBurst({
        id,
        x: playerX,
        y,
        particles: createRunnerBurstParticles(),
      });
      if (deathBurstTimeoutRef.current) {
        clearTimeout(deathBurstTimeoutRef.current);
      }
      deathBurstTimeoutRef.current = window.setTimeout(() => {
        setDeathBurst((current) => (current?.id === id ? null : current));
        restartReadyRef.current = true;
        setStatus('Crashed. Tap restart.');
        deathBurstTimeoutRef.current = 0;
      }, RUNNER_DEATH_BURST_DURATION_MS);
    },
    [playerX]
  );

  const queueJump = useCallback(() => {
    jumpBufferRef.current = RUNNER_JUMP_BUFFER_FRAMES;
  }, []);

  const applyJump = useCallback(() => {
    const player = playerRef.current;
    const isShortJump = !jumpHeldRef.current;
    player.vy = isShortJump ? RUNNER_SHORT_JUMP_VELOCITY : jumpVelocity;
    player.grounded = false;
    jumpStartRotationRef.current = rotationRef.current;
    rotationActiveRef.current = true;
    airTimeRef.current = 0;
    jumpBufferRef.current = 0;
    coyoteRef.current = 0;
    audio?.playRunnerJump(jumpMelodyRef.current, isShortJump);
    jumpMelodyRef.current += 1;
  }, [audio, jumpVelocity]);

  const releaseJump = useCallback(() => {
    jumpHeldRef.current = false;
    restartReleaseGateRef.current = false;
    if (!running) return;
    const player = playerRef.current;
    if (!player.grounded && player.vy < RUNNER_RELEASE_VELOCITY) {
      player.vy = RUNNER_RELEASE_VELOCITY;
    }
  }, [running]);

  const handleAction = useCallback(() => {
    if (!running) {
      if (!restartReadyRef.current) {
        restartReleaseGateRef.current = true;
        return;
      }
      if (restartReleaseGateRef.current) return;
      startGame();
      return;
    }
    queueJump();
  }, [queueJump, running, startGame]);

  const handlePointerAction = useCallback(
    (event) => {
      event.preventDefault();
      audio?.unlock();
      handleAction();
      jumpHeldRef.current = true;
    },
    [audio, handleAction]
  );

  const handleArenaClick = useCallback(
    (event) => {
      if (event.detail === 0) handleAction();
    },
    [handleAction]
  );

  useEffect(() => {
    const updateWidth = () => {
      if (!arenaRef.current) return;
      widthRef.current = arenaRef.current.clientWidth || 720;
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(
    () => () => {
      if (deathBurstTimeoutRef.current) {
        clearTimeout(deathBurstTimeoutRef.current);
      }
    },
    []
  );

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
      const speed = baseSpeed + Math.min(2.4, scoreRef.current / 220);
      if (jumpBufferRef.current > 0) {
        jumpBufferRef.current = Math.max(0, jumpBufferRef.current - dt);
      }

      const player = playerRef.current;
      const wasGrounded = player.grounded;
      const previousY = player.y;
      const previousBottom = previousY + playerSize - 3;
      player.grounded = false;
      const gravityMultiplier =
        !jumpHeldRef.current && player.vy < 0
          ? RUNNER_LOW_JUMP_GRAVITY_MULTIPLIER
          : 1;
      player.vy += gravity * gravityMultiplier * dt;
      player.y += player.vy * dt;

      const obstacles = obstaclesRef.current;
      let activeObstacleCount = 0;
      for (let i = 0; i < obstacles.length; i += 1) {
        const obstacle = obstacles[i];
        obstacle.x -= speed * dt;
        if (obstacle.x + obstacle.width > -40) {
          obstacles[activeObstacleCount] = obstacle;
          activeObstacleCount += 1;
        }
      }
      obstacles.length = activeObstacleCount;

      spawnRef.current += dt;
      if (spawnRef.current >= nextSpawnRef.current) {
        spawnRef.current = 0;
        const challengeSpan = spawnChallenge(speed);
        const sectionGap =
          RUNNER_SECTION_GAP + Math.random() * RUNNER_SECTION_GAP_RANDOM;
        nextSpawnRef.current =
          Math.max(70, (challengeSpan + sectionGap) / speed);
      }

      let hit = false;
      let landedObstacleId = null;
      const playerBodyRect = {
        left: playerX + RUNNER_BODY_SIDE_INSET,
        right: playerX + playerSize - RUNNER_BODY_SIDE_INSET,
        top: player.y + RUNNER_BODY_TOP_INSET,
        bottom: player.y + playerSize - RUNNER_BODY_BOTTOM_INSET,
      };
      const playerFeetRect = {
        left: playerX + RUNNER_FEET_SIDE_INSET,
        right: playerX + playerSize - RUNNER_FEET_SIDE_INSET,
        top: player.y + playerSize - 8,
        bottom: player.y + playerSize - 1,
      };

      for (let i = 0; i < obstaclesRef.current.length; i += 1) {
        const obstacle = obstaclesRef.current[i];
        const obstacleTop = groundTop - obstacle.height;
        const obstacleRect = {
          left: obstacle.x,
          right: obstacle.x + obstacle.width,
          top: obstacleTop,
          bottom: groundTop,
        };

        if (obstacle.type === 'spike') {
          const spikeRect = {
            left: obstacleRect.left + obstacle.width * 0.22,
            right: obstacleRect.right - obstacle.width * 0.22,
            top: obstacleRect.top + obstacle.height * 0.18,
            bottom: obstacleRect.bottom,
          };
          if (rectanglesOverlap(playerBodyRect, spikeRect)) {
            hit = true;
            break;
          }
          continue;
        }

        const overlapsTop =
          playerFeetRect.right > obstacleRect.left + 1 &&
          playerFeetRect.left < obstacleRect.right - 1;
        const landsOnTop =
          overlapsTop &&
          player.vy >= 0 &&
          previousBottom <= obstacleRect.top + RUNNER_TOP_LANDING_TOLERANCE &&
          playerFeetRect.bottom >= obstacleRect.top;

        if (landsOnTop) {
          player.y = obstacleRect.top - playerSize;
          player.vy = 0;
          player.grounded = true;
          landedObstacleId = obstacle.id;
          playerBodyRect.top = player.y + RUNNER_BODY_TOP_INSET;
          playerBodyRect.bottom = player.y + playerSize - RUNNER_BODY_BOTTOM_INSET;
          playerFeetRect.top = player.y + playerSize - 8;
          playerFeetRect.bottom = player.y + playerSize - 1;
        }

        if (
          obstacle.id !== landedObstacleId &&
          rectanglesOverlap(playerBodyRect, obstacleRect) &&
          playerBodyRect.bottom > obstacleRect.top + RUNNER_SIDE_COLLISION_DEPTH
        ) {
          hit = true;
          break;
        }
      }

      if (!hit && player.y >= floorY) {
        player.y = floorY;
        player.vy = 0;
        player.grounded = true;
      }

      if (hit) {
        triggerDeathBurst(player.y);
        endGame();
        return;
      }

      if (
        !wasGrounded &&
        player.grounded &&
        jumpBufferRef.current <= 0 &&
        !jumpHeldRef.current
      ) {
        audio?.playRunnerLand(player.y >= floorY - 0.5);
      }

      if (player.grounded && rotationActiveRef.current) {
        rotationRef.current =
          jumpStartRotationRef.current + RUNNER_JUMP_ROTATION_DEGREES;
        rotationActiveRef.current = false;
        airTimeRef.current = 0;
      }

      if (player.grounded) {
        coyoteRef.current = RUNNER_COYOTE_FRAMES;
      } else {
        coyoteRef.current = Math.max(0, coyoteRef.current - dt);
      }

      if (
        (jumpBufferRef.current > 0 || jumpHeldRef.current) &&
        (player.grounded || coyoteRef.current > 0)
      ) {
        applyJump();
      }

      if (!player.grounded && rotationActiveRef.current) {
        airTimeRef.current += dt;
        const progress = Math.min(1, airTimeRef.current / jumpDurationRef.current);
        rotationRef.current =
          jumpStartRotationRef.current + progress * RUNNER_JUMP_ROTATION_DEGREES;
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
  }, [
    applyJump,
    audio,
    baseSpeed,
    endGame,
    floorY,
    gravity,
    groundTop,
    playerSize,
    playerX,
    running,
    spawnChallenge,
    triggerDeathBurst,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== 'Space' && event.code !== 'ArrowUp') return;
      event.preventDefault();
      audio?.unlock();
      handleAction();
      jumpHeldRef.current = true;
    };
    const handleKeyUp = (event) => {
      if (event.code !== 'Space' && event.code !== 'ArrowUp') return;
      event.preventDefault();
      releaseJump();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [audio, handleAction, releaseJump]);

  return (
    <div className="space-y-5">
      <div className="bb-scoreboard flex flex-wrap items-center justify-between gap-3">
        <span className="bb-score-pill">Score: {score}</span>
        <span className="bb-score-pill">Best: {best}</span>
        {running && <span className="bb-score-pill">Space / Tap</span>}
      </div>
      <button
        ref={arenaRef}
        type="button"
        onPointerDown={handlePointerAction}
        onPointerUp={releaseJump}
        onPointerCancel={releaseJump}
        onPointerLeave={releaseJump}
        onClick={handleArenaClick}
        className="runner-arena relative h-[200px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(30,58,138,0.18),rgba(15,23,42,0.1))] text-left"
        aria-label="Tiny runner arena"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute inset-x-0 bottom-[30px] h-px bg-blue-400/50" />
          <div className="absolute inset-x-0 bottom-0 h-[30px] bg-blue-900/25" />
        </div>
        {playerVisible && !deathBurst && (
          <div
            className="runner-player rounded-md bg-blue-500/80 shadow-[0_0_18px_rgba(59,130,246,0.4)]"
            style={{
              width: playerSize,
              height: playerSize,
              transform: `translate3d(${playerX}px, ${frame.playerY}px, 0) rotate(${frame.rotation}deg)`,
              transformOrigin: 'center',
            }}
          />
        )}
        {deathBurst && (
          <div
            className="runner-burst"
            style={{
              width: playerSize,
              height: playerSize,
              transform: `translate3d(${deathBurst.x}px, ${deathBurst.y}px, 0)`,
            }}
          >
            {deathBurst.particles.map((particle) => (
              <span
                key={`${deathBurst.id}-${particle.id}`}
                className="runner-burst__pixel"
                style={{
                  left: particle.left,
                  top: particle.top,
                  width: particle.size,
                  height: particle.size,
                  background: particle.color,
                  '--runner-pixel-dx': `${particle.dx}px`,
                  '--runner-pixel-dy': `${particle.dy}px`,
                  '--runner-pixel-rotate': `${particle.rotate}deg`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </div>
        )}
        {frame.obstacles.map((obstacle) => {
          const obstacleTop = groundTop - obstacle.height;
          const baseStyle = {
            width: obstacle.width,
            height: obstacle.height,
            transform: `translate3d(${obstacle.x}px, ${obstacleTop}px, 0)`,
          };

          if (obstacle.type === 'spike') {
            return (
              <div
                key={obstacle.id}
                className={`runner-spike ${obstacle.color}`}
                style={baseStyle}
              >
                <span className="runner-spike__shine" />
              </div>
            );
          }

          return (
            <div
              key={obstacle.id}
              className="runner-obstacle runner-block-grid"
              style={{
                ...baseStyle,
                '--bb-cell-size': `${RUNNER_CELL_SIZE}px`,
                gridTemplateColumns: `repeat(${obstacle.widthCells}, var(--bb-cell-size))`,
              }}
            >
              {obstacle.tileColors.map((color, cellIndex) => (
                <span
                  key={`${obstacle.id}-${cellIndex}`}
                  className={`runner-tile bb-cell bb-cell--filled ${color}`}
                />
              ))}
            </div>
          );
        })}
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300">
            <div className="text-xs uppercase tracking-[0.4em] text-blue-200">Tiny Runner</div>
            <div className="mt-3 text-xl font-semibold">{status}</div>
            <div className="mt-2 text-sm text-zinc-400">
              {deathBurst ? 'Wait for the explosion to finish.' : 'Tap the arena or press space.'}
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

const getDragLift = (pointerType, cellSize) => {
  if (pointerType === 'touch') return Math.min(72, cellSize * 1.45);
  if (pointerType === 'pen') return Math.min(32, cellSize * 0.7);
  return 0;
};

const getAcceleratedLogicalTop = (clientY, dragging) => {
  const pointerTop = clientY - dragging.offsetY;
  const dy = clientY - dragging.startY;
  if (dy >= 0) return pointerTop;

  const upwardDistance = -dy;
  const multiplier = 1.03 + Math.min(0.58, upwardDistance / 260);
  return dragging.startLogicalTop + dy * multiplier;
};

const BoardCell = React.memo(({ cell, isPreview, previewColor, popColor }) => {
  const isPop = Boolean(popColor);
  const isFilled = Boolean(cell || isPreview || popColor);
  const isGhost = Boolean(isPreview && !cell && !isPop);
  const colorClass = cell || (isPreview ? previewColor : '') || popColor || '';

  return (
    <div
      aria-hidden="true"
      className={`bb-cell ${isFilled ? 'bb-cell--filled' : 'bb-cell--empty'} ${
        isGhost ? 'bb-cell--ghost' : ''
      } ${isPop ? 'bb-cell--pop' : ''} ${colorClass}`}
    />
  );
});

BoardCell.displayName = 'BoardCell';

const BlockBoard = React.memo(
  React.forwardRef(
    ({ grid, previewMask, previewColor, popCells, gameOver, comboToast, onReset }, boardRef) => (
      <div className="bb-board">
        <div
          className="bb-grid"
          style={{
            gridTemplateColumns: `repeat(${BLOCK_GRID_SIZE}, var(--bb-cell-size))`,
          }}
          ref={boardRef}
          role="grid"
          aria-label="Block Blast board"
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const cellMask = CELL_MASKS[rowIndex * BLOCK_GRID_SIZE + colIndex];
              const isPreview = previewMask !== 0n && (previewMask & cellMask) !== 0n;
              return (
                <BoardCell
                  key={key}
                  cell={cell}
                  isPreview={isPreview}
                  previewColor={previewColor}
                  popColor={popCells?.[key]}
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
              onClick={onReset}
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
    )
  )
);

BlockBoard.displayName = 'BlockBoard';

const PieceGrid = React.memo(({ piece, dragKey = '' }) => (
  <div
    className="bb-grid bb-piece-grid"
    style={{
      gridTemplateColumns: `repeat(${piece.width}, var(--bb-cell-size))`,
    }}
  >
    {piece.filled.map((filled, cellIndex) => (
      <div
        key={`${piece.key}${dragKey}-${cellIndex}`}
        className={`bb-cell ${filled ? 'bb-cell--filled' : 'bb-cell--empty'} ${
          filled ? piece.color : ''
        }`}
      />
    ))}
  </div>
));

PieceGrid.displayName = 'PieceGrid';

const PieceButton = React.memo(
  ({ piece, index, isActive, isDragging, gameOver, onSelect, onPointerDown }) => (
    <button
      type="button"
      onClick={() => onSelect(index)}
      onPointerDown={(event) => onPointerDown(event, index, piece)}
      disabled={!piece || gameOver}
      className={`bb-piece ${isActive ? 'bb-piece--active' : ''} ${
        isDragging ? 'bb-piece--dragging' : ''
      } ${piece ? '' : 'opacity-40'}`}
      aria-pressed={isActive}
    >
      {piece ? <PieceGrid piece={piece} /> : <div className="bb-piece-empty" />}
    </button>
  )
);

PieceButton.displayName = 'PieceButton';

const PieceTray = React.memo(
  ({ pieces, activeIndex, draggingIndex, gameOver, onSelect, onPointerDown }) => (
    <div className="flex w-full flex-wrap items-center justify-center gap-4">
      {pieces.map((piece, index) => (
        <PieceButton
          key={piece?.key ?? `empty-${index}`}
          piece={piece}
          index={index}
          isActive={Boolean(index === activeIndex && piece)}
          isDragging={draggingIndex === index}
          gameOver={gameOver}
          onSelect={onSelect}
          onPointerDown={onPointerDown}
        />
      ))}
    </div>
  )
);

PieceTray.displayName = 'PieceTray';

const DragGhost = React.memo(
  React.forwardRef(({ piece, initialLeft, initialTop }, dragGhostRef) => (
    <div
      ref={dragGhostRef}
      className="bb-drag"
      style={{
        transform: `translate3d(${initialLeft}px, ${initialTop}px, 0)`,
      }}
    >
      <PieceGrid piece={piece} dragKey="-drag" />
    </div>
  ))
);

DragGhost.displayName = 'DragGhost';

const BlockBlast = ({ audio }) => {
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
  const boardMask = useMemo(() => gridToMask(grid), [grid]);
  const previewMask = dragging && hoverCell && !gameOver ? hoverCell.mask : 0n;
  const previewColor = previewMask !== 0n ? activePiece?.color ?? '' : '';

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

  const updateDragGhostPosition = useCallback((left, top) => {
    if (!dragGhostRef.current) return;
    dragGhostRef.current.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  }, []);

  const commitPlacement = useCallback(
    (pieceIndex, row, col) => {
      const piece = pieces[pieceIndex];
      if (!piece || gameOver) return false;
      const placement = getPlacementAt(piece, row, col);
      if (!placement || (boardMask & placement.mask) !== 0n) return false;

      const placed = placePiece(grid, piece, row, col);
      const clearedMask = clearLinesMask(boardMask | placement.mask).mask;
      const { grid: cleared, linesCleared, clearedRows, clearedCols } = clearLines(placed);
      audio?.playBlockPlace(piece.cells.length);
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
        audio?.playBlockClear(linesCleared, comboLevel);
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

      if (!hasMoveForMask(clearedMask, nextPieces)) {
        setGameOver(true);
        setBest((prev) => Math.max(prev, nextScore));
      }

      return true;
    },
    [audio, boardMask, cycleTheme, gameOver, grid, pieces]
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
      const logicalLeft = clientX - dragging.offsetX;
      const logicalTop = getAcceleratedLogicalTop(clientY, dragging);
      const visualLeft = logicalLeft;
      const visualTop = logicalTop - (dragging.lift ?? 0);
      const pieceRect = {
        left: logicalLeft,
        top: logicalTop,
        right: logicalLeft + activePiece.width * cellSize,
        bottom: logicalTop + activePiece.height * cellSize,
      };
      const proximity = distanceBetweenRects(rect, pieceRect);
      const placement =
        proximity <= previewThreshold
          ? getSnappedPlacement(
              boardMask,
              activePiece,
              board,
              logicalLeft,
              logicalTop,
              2,
              1,
              rect
            )
          : null;
      return { left: visualLeft, top: visualTop, placement };
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

    window.addEventListener('pointermove', handleMove, { passive: true });
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
  }, [activePiece, boardMask, commitPlacement, dragging, updateDragGhostPosition]);

  const reset = useCallback(() => {
    const emptyGrid = createEmptyGrid();
    setGrid(emptyGrid);
    setPieces(generatePieceSet(emptyGrid, COLOR_THEMES[0]?.palette ?? BLOCK_COLORS));
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
  }, []);

  const handleReset = useCallback(() => {
    audio?.unlock();
    reset();
  }, [audio, reset]);

  const handleSelectPiece = useCallback(
    (index) => {
      if (!pieces[index] || gameOver) return;
      audio?.unlock();
      setSelectedIndex(index);
    },
    [audio, gameOver, pieces]
  );

  const handlePiecePointerDown = useCallback(
    (event, index, piece) => {
      if (!piece || gameOver) return;
      event.preventDefault();
      audio?.unlock();

      const gridElement = event.currentTarget.querySelector('.bb-piece-grid');
      if (!gridElement) return;

      const pieceRect = gridElement.getBoundingClientRect();
      const board = boardRef.current;
      setSelectedIndex(index);
      dragPointerRef.current = { x: event.clientX, y: event.clientY };

      if (!board) {
        const offsetX = event.clientX - pieceRect.left;
        const offsetY = event.clientY - pieceRect.top;
        const initialLeft = event.clientX - offsetX;
        const initialTop = event.clientY - offsetY;
        setDragging({
          index,
          offsetX,
          offsetY,
          lift: 0,
          startY: event.clientY,
          startLogicalTop: initialTop,
          initialLeft,
          initialTop,
        });
        updateDragGhostPosition(initialLeft, initialTop);
        lastDragPosRef.current = { left: initialLeft, top: initialTop };
        lastPlacementRef.current = null;
        return;
      }

      const boardRect = board.getBoundingClientRect();
      const cellSize = boardRect.width / BLOCK_GRID_SIZE;
      const previewThreshold = cellSize * 2.2;
      const renderedWidth = Math.max(1, pieceRect.width);
      const renderedHeight = Math.max(1, pieceRect.height);
      const pieceWidth = piece.width * cellSize;
      const pieceHeight = piece.height * cellSize;
      const offsetX = Math.min(
        Math.max((event.clientX - pieceRect.left) * (pieceWidth / renderedWidth), 0),
        pieceWidth
      );
      const offsetY = Math.min(
        Math.max((event.clientY - pieceRect.top) * (pieceHeight / renderedHeight), 0),
        pieceHeight
      );
      const lift = getDragLift(event.pointerType, cellSize);
      const logicalLeft = event.clientX - offsetX;
      const logicalTop = event.clientY - offsetY;
      const initialLeft = logicalLeft;
      const initialTop = logicalTop - lift;

      setDragging({
        index,
        offsetX,
        offsetY,
        lift,
        startY: event.clientY,
        startLogicalTop: logicalTop,
        initialLeft,
        initialTop,
        boardRect,
        cellSize,
        previewThreshold,
      });
      updateDragGhostPosition(initialLeft, initialTop);
      lastDragPosRef.current = { left: initialLeft, top: initialTop };

      const logicalRect = {
        left: logicalLeft,
        top: logicalTop,
        right: logicalLeft + pieceWidth,
        bottom: logicalTop + pieceHeight,
      };
      const proximity = distanceBetweenRects(boardRect, logicalRect);
      const initialPlacement =
        proximity <= previewThreshold
          ? getSnappedPlacement(
              boardMask,
              piece,
              board,
              logicalLeft,
              logicalTop,
              2,
              1,
              boardRect
            )
          : null;
      setHoverCell(initialPlacement);
      lastPlacementRef.current = initialPlacement;
    },
    [audio, boardMask, gameOver, updateDragGhostPosition]
  );

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
        <BlockBoard
          ref={boardRef}
          grid={grid}
          previewMask={previewMask}
          previewColor={previewColor}
          popCells={popCells}
          gameOver={gameOver}
          comboToast={comboToast}
          onReset={handleReset}
        />
        <PieceTray
          pieces={pieces}
          activeIndex={activeIndex}
          draggingIndex={dragging?.index ?? null}
          gameOver={gameOver}
          onSelect={handleSelectPiece}
          onPointerDown={handlePiecePointerDown}
        />
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-white/10 bg-blue-500/20 px-4 py-2 text-xs uppercase tracking-[0.35em] text-blue-100 hover:bg-blue-500/30"
        >
          Restart
        </button>
      </div>
      {dragging && activePiece && (
        <DragGhost
          ref={dragGhostRef}
          piece={activePiece}
          initialLeft={dragging.initialLeft}
          initialTop={dragging.initialTop}
        />
      )}
    </div>
  );
};

const GamesPage = () => {
  const arcadeAudio = useArcadeAudio();

  return (
    <div className="relative bg-[#040a16] text-white cursor-crosshair">
      <AmbientVoidBackground lightweight />

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
            className="game-shell p-6 rounded-3xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-2xl font-semibold text-white">Block Blast</div>
                <p className="text-sm text-zinc-400 max-w-lg">
                  Complete a row or column, keep the combo alive.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <BlockBlast audio={arcadeAudio} />
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="game-shell p-6 rounded-3xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-2xl font-semibold text-white">Tiny Runner</div>
                <p className="text-sm text-zinc-400 max-w-lg">
                  Jump the blocks and see how long you last.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <TinyRunner audio={arcadeAudio} />
            </div>
          </motion.article>

        </section>
      </div>
    </div>
  );
};

export default GamesPage;
