
import React, { useState, useCallback } from 'react';
import { AppState, AnalysisResult, ModelConfig } from './types';
import { DEFAULT_MODEL_CONFIG, UI_ICONS } from './constants';
import { analyzeCharacterImage } from './services/geminiService';
import ModelViewer from './components/ModelViewer';
import ImageUploader from './components/ImageUploader';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (base64: string) => {
    setCurrentImage(base64);
    setState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await analyzeCharacterImage(base64);
      setAnalysis(result);
      setState(AppState.VIEWING);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
      setState(AppState.ERROR);
    }
  }, []);

  const reset = () => {
    setCurrentImage(null);
    setAnalysis(null);
    setState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05080f] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
            {UI_ICONS.CUBE}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              VISION3D
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">Neural Architect</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {state !== AppState.IDLE && (
            <button 
              onClick={reset}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              Start Over
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Gemini 3 Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        {state === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight max-w-2xl">
              Turn Concepts into <span className="text-blue-500">3D Blueprints</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mb-12">
              Our advanced Vision AI analyzes your concept art to generate technical specifications, 
              material definitions, and interactive 3D topology previews.
            </p>
            <div className="w-full max-w-md">
              <ImageUploader onImageSelect={handleImageSelect} isProcessing={false} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full text-left">
              {[
                { title: 'Material Extraction', icon: 'fa-layer-group', desc: 'Accurately identifies PBR materials like metals, fabrics, and glowing surfaces.' },
                { title: 'Geometric Analysis', icon: 'fa-shapes', desc: 'Breaks down complex character anatomy into primitive and sculpted subtools.' },
                { title: 'Stylized Previews', icon: 'fa-vr-cardboard', desc: 'Instant interactive 3D prototypes to visualize lighting and volume.' }
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <i className={`fas ${feature.icon} text-blue-500 text-xl mb-4`}></i>
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === AppState.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-blue-500/10 rounded-full flex items-center justify-center">
                {UI_ICONS.MAGIC}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Neural Scan in Progress</h2>
            <p className="text-slate-500 animate-pulse">Gemini 3 is extracting 3D primitives and material nodes...</p>
            
            {currentImage && (
              <div className="mt-12 w-48 aspect-[3/4] rounded-lg overflow-hidden border border-white/10 grayscale opacity-40">
                <img src={currentImage} className="w-full h-full object-cover" alt="Source" />
              </div>
            )}
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md text-center">
              <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-red-500 mb-2">Analysis Failed</h3>
              <p className="text-slate-400 mb-6">{error}</p>
              <button onClick={reset} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors">
                Try Different Image
              </button>
            </div>
          </div>
        )}

        {state === AppState.VIEWING && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
            {/* Left Column: Visuals */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="h-[600px]">
                <ModelViewer config={analysis.config} />
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Source Reference</h3>
                </div>
                {currentImage && (
                  <div className="flex gap-6 items-start">
                    <img src={currentImage} className="w-32 rounded-lg border border-white/10 shadow-xl" alt="Source" />
                    <div>
                      <h4 className="font-bold text-lg">{analysis.config.name}</h4>
                      <p className="text-sm text-slate-500 mb-4">{analysis.config.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.config.features.map((feat, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Data & Blueprint */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {UI_ICONS.CHART}
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Architecture Specs</span>
                  </div>
                  <button className="text-[10px] text-blue-500 font-bold hover:underline">
                    {UI_ICONS.DOWNLOAD} Export JSON
                  </button>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Base Material</p>
                    <p className="font-mono text-sm capitalize text-blue-400">{analysis.config.material}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Est. Complexity</p>
                    <p className="font-mono text-sm text-blue-400">{analysis.config.complexity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Primary Color</p>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm border border-white/20" style={{ backgroundColor: analysis.config.primaryColor }}></div>
                        <p className="font-mono text-xs uppercase">{analysis.config.primaryColor}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Secondary Color</p>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm border border-white/20" style={{ backgroundColor: analysis.config.secondaryColor }}></div>
                        <p className="font-mono text-xs uppercase">{analysis.config.secondaryColor}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="px-4 py-3 bg-black/40 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-yellow-500/80">
                      <i className="fas fa-lightbulb text-xs"></i>
                      <span className="text-[10px] uppercase font-bold tracking-widest">AI Modeling Advice</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "Prioritize the {analysis.config.features[0]} as a separate subtool to allow for dynamic vertex animation. Use decimation master for the armor plates to retain sharp edges while optimizing for real-time rendering."
                    </p>
                  </div>
                </div>
              </div>

              {/* Blueprint Text Area */}
              <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[400px]">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center gap-2">
                  {UI_ICONS.CODE}
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Technical Blueprint</span>
                </div>
                <div className="p-6 overflow-y-auto font-mono text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {analysis.blueprint}
                </div>
                <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">End of Machine-Generated Report</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        &copy; 2024 Vision3D neural architecture systems &bull; Powered by Gemini 3 Flash
      </footer>
    </div>
  );
};

export default App;
