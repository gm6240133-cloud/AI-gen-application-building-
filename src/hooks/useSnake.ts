import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

export function useSnake() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setStatus('playing');
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (status !== 'playing') return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('gameover');
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [status, food, generateFood, score, highScore]);

  useEffect(() => {
    if (status === 'playing') {
      const interval = setInterval(moveSnake, GAME_SPEED);
      return () => clearInterval(interval);
    }
  }, [status, moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return {
    snake,
    food,
    score,
    status,
    highScore,
    resetGame,
    setStatus
  };
}
