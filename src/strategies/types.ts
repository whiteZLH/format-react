export interface LanguageStrategy {
  id: string;
  name: string;
  monacoLanguage: string; // The language ID used by Monaco Editor
  
  // Format is usually handled by Monaco itself, but we can expose an override if needed
  // format?: (code: string) => string; 

  compress?: (code: string) => string;
  escape?: (code: string) => string;
  unescape?: (code: string) => string;
  
  // Custom actions
  customActions?: {
    label: string;
    action: (code: string) => string;
  }[];
}
