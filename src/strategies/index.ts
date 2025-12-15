import { JsonStrategy } from "./JsonStrategy";
import { XmlStrategy } from "./XmlStrategy";
import { JavaStrategy } from "./JavaStrategy";
import { CSharpStrategy } from "./CSharpStrategy";
import { CStrategy } from "./CStrategy";
import { CppStrategy } from "./CppStrategy";
import type { LanguageStrategy } from "./types";

const strategies: Record<string, LanguageStrategy> = {
  json: JsonStrategy,
  xml: XmlStrategy,
  java: JavaStrategy,
  csharp: CSharpStrategy,
  c: CStrategy,
  cpp: CppStrategy,
};

export const getStrategy = (id: string): LanguageStrategy | undefined => {
  return strategies[id.toLowerCase()];
};

export const getAllStrategies = () => Object.values(strategies);
