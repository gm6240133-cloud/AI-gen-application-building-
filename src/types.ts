export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
  duration: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export interface Point {
  x: number;
  y: number;
}
