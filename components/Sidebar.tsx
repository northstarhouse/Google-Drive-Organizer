import React from 'react';
import { Album } from '../types';
import { Icons } from './Icon';

interface SidebarProps {
  albums: Album[];
  selectedAlbumId: string | null;
  onSelectAlbum: (id: string | null) => void;
  stats: { total: number; analyzed: number };
  duplicateCount: number;
  currentView: 'grid' | 'duplicates';
  onChangeView: (view: 'grid' | 'duplicates') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  albums, 
  selectedAlbumId, 
  onSelectAlbum, 
  stats,
  duplicateCount,
  currentView,
  onChangeView
}) => {
  const dateAlbums = albums.filter(a => a.type === 'date');
  const contentAlbums = albums.filter(a => a.type === 'content');

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Icons.Image className="w-5 h-5 text-white" />
          </div>
          DriveSort AI
        </h1>
        <p className="text-xs text-slate-400 mt-2">Smart Gallery Organizer</p>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
           <div className="flex justify-between text-sm text-slate-300 mb-1">
             <span>Analyzed</span>
             <span>{stats.analyzed}/{stats.total}</span>
           </div>
           <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-500 transition-all duration-500 ease-out"
               style={{ width: `${stats.total > 0 ? (stats.analyzed / stats.total) * 100 : 0}%` }}
             />
           </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6">
        {/* Main View */}
        <div>
          <button
            onClick={() => {
              onChangeView('grid');
              onSelectAlbum(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors mb-2 ${
              currentView === 'grid' && selectedAlbumId === null
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Icons.Grid className="w-4 h-4" />
            All Photos
          </button>

          {duplicateCount > 0 && (
             <button
               onClick={() => onChangeView('duplicates')}
               className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                 currentView === 'duplicates'
                   ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                   : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
               }`}
             >
               <div className="flex items-center gap-3">
                 <Icons.Copy className="w-4 h-4" />
                 <span>Duplicates</span>
               </div>
               <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 rounded-full">
                 {duplicateCount}
               </span>
             </button>
          )}
        </div>

        {/* Date Albums */}
        {dateAlbums.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Timeline</h3>
            <div className="space-y-1">
              {dateAlbums.map(album => (
                <button
                  key={album.id}
                  onClick={() => {
                    onChangeView('grid');
                    onSelectAlbum(album.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                    selectedAlbumId === album.id && currentView === 'grid'
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icons.Calendar className="w-4 h-4 opacity-70" />
                    <span>{album.title}</span>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded group-hover:bg-slate-700 transition-colors border border-slate-700">
                    {album.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Smart Albums */}
        {contentAlbums.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Smart Albums</h3>
            <div className="space-y-1">
              {contentAlbums.map(album => (
                <button
                  key={album.id}
                  onClick={() => {
                    onChangeView('grid');
                    onSelectAlbum(album.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group ${
                    selectedAlbumId === album.id && currentView === 'grid'
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icons.Tag className="w-4 h-4 opacity-70" />
                    <span>{album.title}</span>
                  </div>
                   <span className="text-xs bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded group-hover:bg-slate-700 transition-colors border border-slate-700">
                    {album.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      <div className="p-4 text-xs text-slate-600 border-t border-slate-800">
        Powered by Google Gemini 2.5
      </div>
    </aside>
  );
};
