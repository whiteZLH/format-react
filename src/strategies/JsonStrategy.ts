import type { LanguageStrategy } from "./types";

export const JsonStrategy: LanguageStrategy = {
  id: "json",
  name: "JSON",
  monacoLanguage: "json",
  
  compress: (code: string) => {
    try {
      const parsed = JSON.parse(code);
      return JSON.stringify(parsed);
    } catch (e) {
      console.error("Compression failed", e);
      return code;
    }
  },

  escape: (code: string) => {
    return code
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");
  },

  unescape: (code: string) => {
    return code
      .replace(/\\u2029/g, "\u2029")
      .replace(/\\u2028/g, "\u2028")
      .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
      .replace(/\\f/g, "\f")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, "\\");
  },

  customActions: [
    {
      label: "中文转 Unicode",
      action: (code: string) => {
        return code
          .split("")
          .map((char) => {
            const codePoint = char.charCodeAt(0);
            if (codePoint >= 0x4e00 && codePoint <= 0x9fff) {
              return "\\u" + codePoint.toString(16).padStart(4, "0");
            }
            return char;
          })
          .join("");
      },
    },
    {
      label: "Unicode 转中文",
      action: (code: string) => {
        return code.replace(/\\u[\dA-F]{4}/gi, (match) =>
          String.fromCharCode(parseInt(match.replace("\\u", ""), 16))
        );
      },
    },
  ],
};
