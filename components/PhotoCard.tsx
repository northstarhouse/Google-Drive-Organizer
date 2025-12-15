import React from 'react';
import { Photo } from '../types';
import { Icons } from './Icon';
import { formatDate } from '../utils';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative aspect-square bg-slate-800 rounded-xl overflow-hidden cursor-pointer border border-slate-700 hover:border-blue-500 transition-all shadow-sm hover:shadow-md"
    >
      <img 
        src={photo.url} 
        alt={photo.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Status Badge */}
      <div className="absolute top-2 right-2">
        {photo.status === 'analyzing' && (
          <div className="bg-blue-500/90 p-1.5 rounded-full backdrop-blur-sm animate-pulse">
            <Icons.Spinner className="w-4 h-4 text-white animate-spin" />
          </div>
        )}
        {photo.status === 'done' && (
          <div className="bg-emerald-500/90 p-1.5 rounded-full backdrop-blur-sm shadow-sm">
            <Icons.Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Info Overlay (Hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white text-sm font-medium truncate">{photo.analysis?.summary || photo.name}</p>
        <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-300 flex items-center gap-1">
                <Icons.Calendar className="w-3 h-3" />
                {formatDate(photo.date)}
            </span>
            {photo.analysis?.category && (
                <span className="text-[10px] bg-slate-700/80 px-2 py-0.5 rounded text-blue-200 border border-slate-600">
                    {photo.analysis.category}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};
