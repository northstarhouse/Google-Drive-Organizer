import React from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Loader2, 
  Grid, 
  FolderOpen, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Tag,
  Search,
  Copy,
  Trash2,
  AlertTriangle,
  Cloud
} from 'lucide-react';

const GoogleDrive = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
    <path d="m6.6 66.85 25.3-43.8 25.3 43.8z" fill="#0066da"/>
    <path d="m43.65 23.05-25.3 43.8h-18.35l25.3-43.8z" fill="#00ac47"/>
    <path d="m73.55 76h-43.65l-9.15-15.85h43.65z" fill="#ea4335"/>
    <path d="m43.65 23.05h33.65l10 17.3-25.3 43.8h-18.35z" fill="#ffba00"/>
  </svg>
);

export const Icons = {
  Upload: UploadCloud,
  Image: ImageIcon,
  Spinner: Loader2,
  Grid,
  Album: FolderOpen,
  Check: CheckCircle2,
  Error: AlertCircle,
  Calendar,
  Tag,
  Search,
  Copy,
  Trash: Trash2,
  Warning: AlertTriangle,
  Cloud,
  GoogleDrive
};
