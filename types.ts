
export interface ModelConfig {
  name: string;
  material: 'metallic' | 'matte' | 'glowing';
  primaryColor: string;
  secondaryColor: string;
  description: string;
  complexity: string;
  features: string[];
  lighting: 'dramatic' | 'soft' | 'eerie';
}

export interface AnalysisResult {
  config: ModelConfig;
  blueprint: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  VIEWING = 'VIEWING',
  ERROR = 'ERROR'
}
