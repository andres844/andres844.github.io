import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AmbientVoidBackground from '../components/AmbientVoidBackground';
import CursorRipples from '../components/CursorRipples';
import SectionAccent from '../components/SectionAccent';

const TinyRunner = () => {
  const arenaHeight = 220;
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
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop =
          obstacle.type === 'spike'
            ? groundTop - obstacle.height + 2
            : groundTop - obstacle.height;
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
        <span>{running ? 'Jump: space / tap' : 'Ready'}</span>
      </div>
      <button
        type="button"
        onClick={handleAction}
        className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(30,58,138,0.18),rgba(15,23,42,0.1))] text-left"
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
        className={`w-full rounded-2xl border border-white/10 px-6 py-8 text-center transition-colors ${
          phase === 'ready' ? 'bg-blue-500/20 text-white' : 'bg-white/5 text-zinc-200'
        }`}
      >
        <div className="text-sm uppercase tracking-[0.35em] text-blue-200">Reaction Pulse</div>
        <div className="mt-3 text-3xl font-semibold">{message}</div>
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
        className="relative h-56 w-full rounded-2xl border border-white/10 bg-white/5"
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
            className={`h-20 rounded-2xl border border-white/10 transition-colors ${
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
    className="glass-card hover-change p-6 rounded-2xl space-y-5"
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

      <div className="relative z-10 pt-24 pb-16">
        <header className="container mx-auto px-4 text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-400"
          >
            Games Arcade
          </motion.h1>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            A tiny playground of quick challenges. No purpose.
          </p>
          <SectionAccent className="mx-auto w-56 mt-8" />
        </header>

        <section className="container mx-auto px-4 space-y-10">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="glass-card hover-change p-8 rounded-3xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-2xl font-semibold text-white">Tiny Runner</div>
                <p className="text-sm text-zinc-400 max-w-lg">
                  A minimalist sprint. Jump the blocks and see how long you last.
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
