export type ToolCategory = 'all' | 'optimize' | 'create' | 'edit' | 'convert' | 'security' | 'workflows';

export type StudioType = 'image' | 'pdf' | 'universal';

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  studio: StudioType;
  category: ToolCategory;
  shortDesc: string;
  longDesc: string;
  icon: string;
  badge?: 'New' | 'Popular' | 'Pro' | 'AI';
  acceptedMimeTypes: string[];
  acceptedExtensions: string[];
  defaultOutputFormat: string;
  supportedOutputFormats: string[];
  maxFiles: number;
  maxFileSizeMB: number;
  optionsSchema: Record<string, ToolOptionField>;
}

export interface ToolOptionField {
  type: 'slider' | 'select' | 'boolean' | 'text' | 'number' | 'color';
  label: string;
  default: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  description?: string;
}

export interface StagedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  outputBlob?: Blob;
  outputName?: string;
  outputSize?: number;
  error?: string;
}

export interface FormatMatrixItem {
  format: string;
  category: 'raster' | 'vector' | 'document' | 'raw';
  name: string;
  mime: string;
  convertibleTo: string[];
}
