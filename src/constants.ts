import { Song } from './types';

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'Synthwave Dreams',
    artist: 'AI Composer X',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
  },
  {
    id: '2',
    title: 'Cyber City',
    artist: 'Neon Byte',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300&h=300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
  },
  {
    id: '3',
    title: 'Neon Nights',
    artist: 'Digital Echo',
    cover: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=300&h=300',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 318,
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 150;
