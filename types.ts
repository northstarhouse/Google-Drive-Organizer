export interface AIAnalysis {
  category: string;
  tags: string[];
  summary: string;
  season?: string;
}

export type PhotoSource = 'local' | 'drive';

export interface Photo {
  id: string;
  file?: File;
  url: string;
  name: string;
  date: Date;
  size: number;
  source: PhotoSource;
  analysis?: AIAnalysis;
  status: 'pending' | 'analyzing' | 'done' | 'error';
}

export interface Album {
  id: string;
  title: string;
  type: 'date' | 'content';
  count: number;
  coverUrl?: string;
  filter: (photo: Photo) => boolean;
}

export interface DuplicateGroup {
  id: string;
  photos: Photo[];
  key: string; // The identifying characteristic (e.g. size + date)
}

export enum ViewMode {
  GRID = 'GRID',
  ALBUMS = 'ALBUMS',
  DUPLICATES = 'DUPLICATES'
}
