import { JsonStrategy } from "./JsonStrategy";
import { XmlStrategy } from "./XmlStrategy";
import { JavaStrategy } from "./JavaStrategy";
import { CSharpStrategy } from "./CSharpStrategy";
import { CStrategy } from "./CStrategy";
import { CppStrategy } from "./CppStrategy";
import { JavaScriptStrategy } from "./JavaScriptStrategy";
import { TypeScriptStrategy } from "./TypeScriptStrategy";
import { PythonStrategy } from "./PythonStrategy";
import { GoStrategy } from "./GoStrategy";
import { RustStrategy } from "./RustStrategy";
import { PhpStrategy } from "./PhpStrategy";
import { SqlStrategy } from "./SqlStrategy";
import { HtmlStrategy } from "./HtmlStrategy";
import { CssStrategy } from "./CssStrategy";
import { YamlStrategy } from "./YamlStrategy";
import { ShellStrategy } from "./ShellStrategy";
import { MarkdownStrategy } from "./MarkdownStrategy";
import type { LanguageStrategy } from "./types";

const strategyList: LanguageStrategy[] = [
  JsonStrategy,
  XmlStrategy,
  JavaStrategy,
  CSharpStrategy,
  CStrategy,
  CppStrategy,
  JavaScriptStrategy,
  TypeScriptStrategy,
  PythonStrategy,
  GoStrategy,
  RustStrategy,
  PhpStrategy,
  SqlStrategy,
  HtmlStrategy,
  CssStrategy,
  YamlStrategy,
  ShellStrategy,
  MarkdownStrategy,
];

const strategies: Record<string, LanguageStrategy> = Object.fromEntries(
  strategyList.map((strategy) => [strategy.id, strategy])
);

export const getStrategy = (id: string): LanguageStrategy | undefined => {
  return strategies[id.toLowerCase()];
};

export const getAllStrategies = () => strategyList;
