import { Photo, DuplicateGroup } from './types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert URL to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const getMonthYear = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const findDuplicates = (photos: Photo[]): DuplicateGroup[] => {
  const groups: Record<string, Photo[]> = {};

  photos.forEach(photo => {
    // A robust key for duplicates: precise timestamp + file size
    // Note: Filename is often unreliable (e.g. "IMG_1234 (1).jpg")
    const key = `${photo.date.getTime()}_${photo.size}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(photo);
  });

  return Object.entries(groups)
    .filter(([_, groupPhotos]) => groupPhotos.length > 1)
    .map(([key, groupPhotos]) => ({
      id: key,
      key,
      photos: groupPhotos
    }));
};
