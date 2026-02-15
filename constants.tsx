
import React from 'react';
import { ModelConfig } from './types';

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  name: "Skeleton King Alpha",
  material: 'metallic',
  primaryColor: '#2d3436',
  secondaryColor: '#636e72',
  description: "A dark lord clad in jagged obsidian armor, bearing a crown of bone and steel.",
  complexity: "Extremely High (2.4M Polygons)",
  features: ["Tattered Cape", "Soul-lit Eyes", "Spiked Pauldrons", "Bone Crown"],
  lighting: 'eerie'
};

export const UI_ICONS = {
  CUBE: <i className="fas fa-cube mr-2"></i>,
  UPLOAD: <i className="fas fa-cloud-upload-alt mr-2"></i>,
  MAGIC: <i className="fas fa-magic mr-2"></i>,
  CHART: <i className="fas fa-project-diagram mr-2"></i>,
  CODE: <i className="fas fa-terminal mr-2"></i>,
  DOWNLOAD: <i className="fas fa-download mr-2"></i>
};
