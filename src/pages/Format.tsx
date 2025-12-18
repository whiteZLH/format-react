import MonacoEditor, { type MonacoEditorRef } from "../components/MonacoEditor";
import "./format.css";
import { Button } from "react-vant";
import { useRef, useState } from "react";
import CustomJsonEditor from "../components/JsonEditor";

function Format() {
  const editorRef = useRef<MonacoEditorRef | null>(null);

  const initValue = `["Hello This is a format util!"]`;

  const [DataStr, setDataStr] = useState(initValue);

  const [data, setData] = useState<any>(JSON.parse(initValue));

  const onEditorChange = (value: string | undefined) => {
    if (!value) {
      setData("");
      return;
    }
    try {
      const data = JSON.parse(value);
      // 合法的 json，同步到 CustomJsonEditor 中进行展示
      setData(data);
    } catch (e) {}
  };

  const onJsonEditorChange = (value: any) => {
    // 同步到 MonacoEditor 中进行展示
    const JsonStr = JSON.stringify(value);
    // 更新 MonacoEditor
    setDataStr(JsonStr);
    editorRef.current?.format();
  };

  // 转义
  const escape = () => {
    // 获得当前的 value 进行 转义后设置
    const value = editorRef.current?.getValue();

    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      // .replace(/\n/g, "\\n")
      // .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\f/g, "\\f");
    // .replace(
    //   /[\x00-\x1F]/g,
    //   (c: any) => "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0")
    // )
    // .replace(/\u2028/g, "\\u2028")
    // .replace(/\u2029/g, "\\u2029");
    setDataStr(escaped);
  };

  const removeEscape = () => {
    // 获得当前的 value 进行 转义后设置
    const value = editorRef.current?.getValue();
    const unescaped = value
      .replace(/\\u2029/g, "\u2029")
      .replace(/\\u2028/g, "\u2028")
      .replace(/\\x([0-9a-fA-F]{2})/g, (_: any, hex: any) =>
        String.fromCharCode(parseInt(hex, 16))
      )
      .replace(/\\f/g, "\f")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, "\\");

    setDataStr(unescaped);
  };

  const ConvertChineseToUnicode = () => {
    const value = editorRef.current?.getValue();

    const result = value.replace(/\\u[\dA-F]{4}/gi, (match: any) =>
      String.fromCharCode(parseInt(match.replace("\\u", ""), 16))
    );
    setDataStr(result);
  };

  const toUnicode = () => {
    const value = editorRef.current?.getValue();

    const result = value
      .split("")
      .map((char: any) => {
        const code = char.charCodeAt(0);
        // 仅转换中文（Unicode 范围：\u4e00-\u9fff）
        if (code >= 0x4e00 && code <= 0x9fff) {
          return "\\u" + code.toString(16).padStart(4, "0");
        }
        return char; // 非中文字符保持原样
      })
      .join("");

    setDataStr(result);
  };

  const compress = () => {
    const value = editorRef.current?.getValue();
    if (!value) return;
    try {
      const parsed = JSON.parse(value);
      setDataStr(JSON.stringify(parsed));
    } catch (e) {
      console.error("Invalid JSON for compression");
    }
  };
  return (
    <>
      <div className="h-svh w-screen min-w-96 flex flex-col bg-gray-100">
        <header className="w-full h-16 bg-white shadow flex items-center justify-between px-8">
          <div className="text-2xl font-bold text-gray-800">ZJson</div>
          <div className="space-x-6">
            {/* <button className="text-gray-600 hover:text-blue-500">Home</button>
            <button className="text-gray-600 hover:text-blue-500">About</button>
            <button className="text-gray-600 hover:text-blue-500">
              Contact
            </button> */}
          </div>
        </header>
        <main className="flex-1 px-8 mt-3 overflow-auto bg-gray-100">
          <div className="content h-full p-3 flex flex-col gap-3">
            <div className="options flex space-x-4">
              <Button
                plain
                hairline
                color="#42B983"
                onClick={() => {
                  editorRef.current?.format();
                }}
              >
                格式化
              </Button>
              <Button plain hairline color="#42B983" onClick={escape}>
                转义
              </Button>
              <Button plain hairline color="#42B983" onClick={removeEscape}>
                去除转义
              </Button>

              <Button plain hairline color="#42B983" onClick={toUnicode}>
                中文转 Unicode
              </Button>
              <Button
                plain
                hairline
                color="#42B983"
                onClick={ConvertChineseToUnicode}
              >
                Unicode 转中文
              </Button>
              <Button plain hairline color="#42B983" onClick={compress}>
                压缩
              </Button>
            </div>

            <div className="content-container h-3/4 flex">
              <div className="editor  w-3/5">
                <div className={`rounded-xl border p-4 h-full shadow bg-white`}>
                  <MonacoEditor
                    data={DataStr}
                    ref={editorRef}
                    onChange={onEditorChange}
                    language="json"
                  />
                </div>
              </div>
              <div className="editor  w-2/5">
                <div className="p-6 h-full">
                  <CustomJsonEditor
                    className="h-full bg-white"
                    value={data}
                    onChange={onJsonEditorChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Format;
