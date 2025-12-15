import { Photo, DuplicateGroup } from './types';

// Robust ID generator that works in non-secure contexts (http) too
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

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
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
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
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    throw error;
  }
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
