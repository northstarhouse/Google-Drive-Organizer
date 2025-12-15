import React from 'react';
import { Photo, DuplicateGroup } from '../types';
import { Icons } from './Icon';
import { formatDate } from '../utils';

interface DuplicateReviewProps {
  duplicates: DuplicateGroup[];
  onResolve: (groupId: string, keepPhotoId: string) => void;
  onIgnore: (groupId: string) => void;
}

export const DuplicateReview: React.FC<DuplicateReviewProps> = ({ duplicates, onResolve, onIgnore }) => {
  if (duplicates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Icons.Check className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-medium text-white">No Duplicates Found</h3>
        <p className="mt-2 text-sm">Your gallery is clean and organized.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-start gap-3">
        <Icons.Warning className="w-5 h-5 text-amber-500 mt-0.5" />
        <div>
          <h3 className="text-amber-200 font-medium">Duplicate Photos Detected</h3>
          <p className="text-amber-200/70 text-sm mt-1">
            We found {duplicates.length} groups of identical photos. Review them below to free up space.
            The app matches photos based on exact timestamp and file size.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {duplicates.map((group) => (
          <div key={group.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">
                Found {group.photos.length} copies • {formatDate(group.photos[0].date)}
              </span>
              <button 
                onClick={() => onIgnore(group.id)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Ignore Group
              </button>
            </div>
            
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-4">
                {group.photos.map(photo => (
                  <div key={photo.id} className="min-w-[200px] w-[200px] flex flex-col gap-3">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-600 group hover:border-blue-500 transition-colors">
                      <img src={photo.url} className="w-full h-full object-cover" alt="duplicate candidate" />
                      {photo.source === 'drive' && (
                        <div className="absolute top-2 left-2 bg-slate-900/80 p-1 rounded shadow-sm" title="From Google Drive">
                          <Icons.GoogleDrive className="w-3 h-3" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-[10px] text-white truncate">
                        {photo.name}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onResolve(group.id, photo.id)}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Icons.Check className="w-3 h-3" />
                      Keep This One
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
