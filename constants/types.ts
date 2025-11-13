import { Timestamp } from 'firebase/firestore';

export interface Sound {
  id: string;
  title: string;
  artist: string;
  artworkUrl: string;
  streamUrl: string;
  genre: string;
  playCount?: number;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: Timestamp;
  songIds: string[]; 
}