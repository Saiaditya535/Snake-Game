import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 16;
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 8, y: 9 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  
  const currentDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    currentDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  useEffect(() => {
    generateFood(snake);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p') {
        if (isGameOver) {
          resetGame();
        } else {
          setIsPaused((p) => !p);
        }
        return;
      }

      if (isGameOver || isPaused) return;

      const { x: curX, y: curY } = currentDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (curY !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (curY !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (curX !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (curX !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        currentDirectionRef.current = direction;

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(gameLoop);
  }, [direction, food, isGameOver, isPaused, generateFood, highScore]);

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  return (
    <div className="flex flex-col items-center bg-black jarring-border-alt p-6 w-fit relative group transform transition-all hover:scale-[1.01]">
      
      <div className="flex justify-between w-full mb-4 px-2 uppercase tracking-widest font-bold text-2xl border-b-4 border-[#0ff] pb-2">
        <div className="text-[#0ff] glitch-text" data-text={`SCORE:${score.toString().padStart(4, '0')}`}>
          SCORE:{score.toString().padStart(4, '0')}
        </div>
        <div className="text-[#f0f]">
          HI:{highScore.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        className="relative bg-[#050505] border-4 border-[#333] overflow-hidden"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >
        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-[#0ff] z-10 scale-110' : 'bg-[#0ff] opacity-80'}`}
              style={{
                width: '20px',
                height: '20px',
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
                boxShadow: isHead ? '0 0 10px #0ff' : 'none',
              }}
            />
          );
        })}

        {/* Render Food */}
        <div
          className="absolute bg-[#f0f] animate-pulse z-0"
          style={{
            width: '20px',
            height: '20px',
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
            boxShadow: '0 0 10px #f0f',
          }}
        />

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            {isGameOver ? (
              <div className="text-center screen-tear border-y-4 border-[#f0f] w-full bg-[#111] py-4">
                <h2 className="text-4xl font-bold text-[#f0f] mb-2 uppercase tracking-widest bg-black inline-block px-2">
                  FATAL_ERR
                </h2>
                <div className="text-[#0ff] text-xl mb-6 uppercase tracking-widest border-b border-[#333] pb-4 mx-4">
                  &gt; COLLISION_DETECTED
                </div>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-transparent border-2 border-[#0ff] text-[#0ff] font-bold text-xl uppercase hover:bg-[#0ff] hover:text-black transition-colors"
                >
                  [ REBOOT (SPACE) ]
                </button>
              </div>
            ) : (
              <div className="text-center border-y-4 border-[#0ff] w-full bg-[#111] py-8 border-dashed">
                <h2 className="text-4xl font-bold text-[#0ff] uppercase tracking-widest animate-pulse bg-black inline-block px-4">
                  SYS_PAUSED
                </h2>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 w-full flex items-center justify-between text-lg text-[#0ff] border-t-4 border-[#f0f] pt-4 uppercase tracking-widest font-bold">
        <div className="flex gap-2 items-center">
          <span>CTRL:</span>
          <span className="bg-[#f0f] text-black px-2 py-1 leading-none">[W,A,S,D]</span>
        </div>
        <div className="flex gap-2 items-center">
          <span>HALT:</span>
          <span className="border-2 border-[#f0f] text-[#f0f] px-2 py-1 leading-none">[SPACE]</span>
        </div>
      </div>

    </div>
  );
}
