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
                  <div key={photo.id} className="min-w-[220px] w-[220px] flex flex-col bg-slate-900 rounded-lg border border-slate-800 p-3">
                    
                    {/* Image */}
                    <div className="relative aspect-square rounded-md overflow-hidden bg-slate-800 mb-3 border border-slate-700">
                      <img src={photo.url} className="w-full h-full object-cover" alt="duplicate candidate" />
                      {/* Source Icon overlay */}
                      <div className="absolute top-2 left-2 shadow-sm">
                         {photo.source === 'drive' ? (
                            <div className="bg-[#0f172a]/90 text-white p-1.5 rounded-md backdrop-blur-sm border border-slate-700/50" title="From Google Drive">
                                <Icons.GoogleDrive className="w-3.5 h-3.5" />
                            </div>
                         ) : (
                            <div className="bg-slate-700/90 text-slate-200 p-1.5 rounded-md backdrop-blur-sm border border-slate-600/50" title="From Local Device">
                                <Icons.Upload className="w-3.5 h-3.5" />
                            </div>
                         )}
                      </div>
                    </div>
                    
                    {/* Metadata */}
                    <div className="space-y-2 mb-4 flex-1">
                        {/* Source Label */}
                        <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                 photo.source === 'drive' 
                                 ? 'bg-blue-900/30 text-blue-300 border-blue-800/50' 
                                 : 'bg-slate-800 text-slate-400 border-slate-700'
                             }`}>
                                {photo.source === 'drive' ? 'Drive Import' : 'Local Upload'}
                             </span>
                        </div>

                        {/* Category/AI Data */}
                        {photo.status === 'done' && photo.analysis ? (
                           <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                                    <Icons.Tag className="w-3 h-3 text-blue-400" />
                                    <span>{photo.analysis.category}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                    {photo.analysis.summary}
                                </p>
                           </div>
                        ) : (
                             <div className="flex items-center gap-2 py-1">
                                <Icons.Spinner className="w-3 h-3 text-slate-500 animate-spin" />
                                <span className="text-xs text-slate-500">Analyzing content...</span>
                             </div>
                        )}

                        {/* Filename */}
                         <div className="pt-2 border-t border-slate-800/50">
                            <p className="text-[10px] text-slate-600 truncate font-mono" title={photo.name}>
                                {photo.name}
                            </p>
                        </div>
                    </div>

                    <button
                      onClick={() => onResolve(group.id, photo.id)}
                      className="w-full py-2 px-3 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold rounded-lg transition-all border border-slate-700 hover:border-emerald-500/50 flex items-center justify-center gap-2 shadow-sm group/btn"
                    >
                      <Icons.Check className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                      Keep This Copy
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
