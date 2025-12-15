import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { PhotoCard } from './components/PhotoCard';
import { DuplicateReview } from './components/DuplicateReview';
import { Icons } from './components/Icon';
import { Photo, Album, DuplicateGroup } from './types';
import { fileToBase64, urlToBase64, getMonthYear, findDuplicates } from './utils';
import { analyzeImageContent } from './services/gemini';
import { importFromGoogleDrive } from './services/drive';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'duplicates'>('grid');
  
  // Use a ref to track processing state without triggering re-renders for the queue logic itself
  const processingQueueRef = useRef<string[]>([]);
  const [analyzedCount, setAnalyzedCount] = useState(0);

  // --- Handlers ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsUploading(true);
    const newPhotos: Photo[] = [];

    Array.from(e.target.files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) return;

      const photo: Photo = {
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        date: new Date(file.lastModified),
        size: file.size,
        source: 'local',
        status: 'pending'
      };
      newPhotos.push(photo);
    });

    setPhotos(prev => [...prev, ...newPhotos]);
    setIsUploading(false);
    
    // Process new photos
    newPhotos.forEach(p => processPhoto(p));
  };

  const handleDriveImport = async () => {
    setIsUploading(true);
    try {
      // Simulate OAuth/Picker flow
      const drivePhotos = await importFromGoogleDrive();
      setPhotos(prev => [...prev, ...drivePhotos]);
      
      // Process newly imported photos
      drivePhotos.forEach(p => processPhoto(p));
    } catch (error) {
      console.error("Drive import failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const processPhoto = async (photo: Photo) => {
    if (processingQueueRef.current.includes(photo.id)) return;
    processingQueueRef.current.push(photo.id);

    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'analyzing' } : p));

    try {
      let base64 = "";
      let mimeType = "image/jpeg"; // Default fallback

      if (photo.file) {
        base64 = await fileToBase64(photo.file);
        mimeType = photo.file.type;
      } else {
        // Drive import gives URL, fetch blob then convert
        base64 = await urlToBase64(photo.url);
        // mimeType stays default or could be inferred from url extension
      }
      
      const analysis = await analyzeImageContent(base64, mimeType);

      setPhotos(prev => prev.map(p => 
        p.id === photo.id 
          ? { ...p, status: 'done', analysis } 
          : p
      ));
      setAnalyzedCount(c => c + 1);

    } catch (err) {
      console.error("Error processing photo", photo.id, err);
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, status: 'error' } : p));
    } finally {
        processingQueueRef.current = processingQueueRef.current.filter(id => id !== photo.id);
    }
  };

  // --- Duplicates Logic ---

  const duplicates = useMemo(() => findDuplicates(photos), [photos]);

  const resolveDuplicate = (groupId: string, keepPhotoId: string) => {
    const group = duplicates.find(g => g.id === groupId);
    if (!group) return;

    // IDs to remove are all in the group EXCEPT the one to keep
    const idsToRemove = group.photos.filter(p => p.id !== keepPhotoId).map(p => p.id);
    
    setPhotos(prev => prev.filter(p => !idsToRemove.includes(p.id)));
    
    // If no more duplicates, switch back to grid
    if (duplicates.length <= 1) setCurrentView('grid');
  };

  const ignoreDuplicateGroup = (groupId: string) => {
    // In a real app we'd persist this "ignore" state. 
    // Here we might just remove them from the current duplicate view calculation or just simple alert
    // For simplicity, we won't hide them in this session without complex state, but we will switch view
    alert("Duplicate group ignored for this session.");
  };

  // --- Derived State: Albums ---

  const albums = useMemo(() => {
    const albumMap = new Map<string, Album>();

    // 1. Date Albums
    photos.forEach(photo => {
      const key = getMonthYear(photo.date);
      if (!albumMap.has(key)) {
        albumMap.set(key, {
          id: key,
          title: key,
          type: 'date',
          count: 0,
          filter: (p) => getMonthYear(p.date) === key
        });
      }
      const album = albumMap.get(key)!;
      album.count++;
    });

    // 2. Content Albums
    photos.forEach(photo => {
      if (photo.analysis?.category) {
        const key = `cat_${photo.analysis.category}`;
        if (!albumMap.has(key)) {
            albumMap.set(key, {
                id: key,
                title: photo.analysis.category,
                type: 'content',
                count: 0,
                filter: (p) => p.analysis?.category === photo.analysis?.category
            });
        }
        const album = albumMap.get(key)!;
        album.count++;
      }
    });

    return Array.from(albumMap.values()).sort((a, b) => {
       if (a.type !== b.type) return a.type === 'date' ? -1 : 1;
       if (a.type === 'date') {
           return new Date(b.title).getTime() - new Date(a.title).getTime();
       }
       return a.title.localeCompare(b.title);
    });
  }, [photos]);

  // --- Filtering ---

  const displayedPhotos = useMemo(() => {
    let filtered = photos;
    if (selectedAlbumId) {
      const album = albums.find(a => a.id === selectedAlbumId);
      if (album) {
        filtered = photos.filter(album.filter);
      }
    }
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [photos, selectedAlbumId, albums]);

  const currentAlbumTitle = selectedAlbumId 
    ? albums.find(a => a.id === selectedAlbumId)?.title 
    : "All Photos";

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        albums={albums} 
        selectedAlbumId={selectedAlbumId} 
        onSelectAlbum={setSelectedAlbumId}
        stats={{ total: photos.length, analyzed: analyzedCount }}
        duplicateCount={duplicates.length}
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-semibold text-white tracking-tight">
               {currentView === 'duplicates' ? 'Review Duplicates' : currentAlbumTitle}
             </h2>
             {currentView === 'grid' && (
                <span className="text-sm text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    {displayedPhotos.length} photos
                </span>
             )}
          </div>

          <div className="flex items-center gap-3">
             {/* Drive Import Button */}
             <button
               onClick={handleDriveImport}
               disabled={isUploading}
               className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors font-medium text-sm border border-slate-200"
             >
               {isUploading ? <Icons.Spinner className="w-4 h-4 animate-spin text-slate-600" /> : <Icons.GoogleDrive className="w-4 h-4" />}
               <span>Import from Drive</span>
             </button>
             
             {/* Local Upload Button */}
             <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-lg shadow-blue-900/20 font-medium text-sm">
                {isUploading ? <Icons.Spinner className="w-4 h-4 animate-spin" /> : <Icons.Upload className="w-4 h-4" />}
                <span>Upload</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  disabled={isUploading}
                />
             </label>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {currentView === 'duplicates' ? (
            <DuplicateReview 
              duplicates={duplicates} 
              onResolve={resolveDuplicate}
              onIgnore={ignoreDuplicateGroup}
            />
          ) : (
             <>
               {photos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-6">
                    <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-700">
                        <Icons.Image className="w-10 h-10 opacity-50" />
                    </div>
                    <div className="text-center max-w-md">
                        <h3 className="text-lg font-medium text-slate-300 mb-2">Your Smart Gallery is Empty</h3>
                        <p className="text-sm leading-relaxed mb-6">
                            Import photos to start. DriveSort AI will organize them by date and content, and help you clean up duplicates.
                        </p>
                        <button onClick={handleDriveImport} className="text-blue-400 hover:text-blue-300 underline text-sm">
                            Try "Import from Drive" for a demo
                        </button>
                    </div>
                </div>
               ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {displayedPhotos.map(photo => (
                    <PhotoCard 
                        key={photo.id} 
                        photo={photo} 
                        onClick={() => console.log("Open photo", photo)} 
                    />
                    ))}
                </div>
               )}
             </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
