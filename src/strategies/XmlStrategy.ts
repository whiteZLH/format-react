import type { LanguageStrategy } from "./types";

export const XmlStrategy: LanguageStrategy = {
  id: "xml",
  name: "XML",
  monacoLanguage: "xml",
  
  // XML implementation can be added here
  // For now, it relies on Monaco's default XML formatting if available
};
