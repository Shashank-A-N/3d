
import React from 'react';
import { UI_ICONS } from '../constants';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isProcessing }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/50 hover:border-blue-500/50 transition-all duration-300">
      <div className="mb-4 text-slate-500 text-4xl">
        {isProcessing ? (
          <i className="fas fa-circle-notch fa-spin text-blue-500"></i>
        ) : (
          <i className="fas fa-images"></i>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">Upload Reference</h3>
      <p className="text-slate-400 text-sm mb-6 text-center max-w-xs">
        Provide a character design or concept art to generate a professional 3D blueprint.
      </p>
      <label className={`
        flex items-center px-6 py-3 rounded-full font-medium cursor-pointer transition-all
        ${isProcessing ? 'bg-slate-700 text-slate-400 pointer-events-none' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
      `}>
        {UI_ICONS.UPLOAD}
        {isProcessing ? 'Analyzing...' : 'Select Image'}
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ImageUploader;
