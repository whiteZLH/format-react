import { Editor, type Monaco } from "@monaco-editor/react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { editor } from "monaco-editor";

type OnChange = (
  value: string | undefined,
  ev: editor.IModelContentChangedEvent
) => void;

type MonacoEditorProps = {
  language: string;
  data: string;
  onChange: OnChange;
};

const MonacoEditor = forwardRef(
  ({ language = "json", data, onChange }: MonacoEditorProps, ref) => {
    const decorationIdsRef = useRef<string[]>([]);
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<Monaco | null>(null);

    // 暴露给父组件的方法
    useImperativeHandle(ref, () => ({
      format: () => {
        if (editorRef.current) {
          editorRef.current.getAction("editor.action.formatDocument")?.run();
        }
      },
      getValue: () => {
        if (editorRef.current) {
          return editorRef.current?.getValue();
        }
      },
    }));

    useEffect(() => {
      monacoRef.current?.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: true,
      });
    }, []);

    const onEditorMount = (
      editor: editor.IStandaloneCodeEditor,
      monaco: Monaco
    ) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // 禁用 F1
      editor.addCommand(monaco.KeyCode.F1, () => { });

      // 禁用 Ctrl/Cmd + Shift + P
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
        () => { }
      );
    };

    function handleEditorValidation(markers: editor.IMarker[]) {
      // 清除旧的 decorations
      const model = editorRef.current?.getModel();
      // decorationIdsRef.current =
      //   model?.deltaDecorations(decorationIdsRef.current, []) ?? [];

      // 创建新的 inline decorations
      const monaco = monacoRef.current;
      const decorations: editor.IModelDeltaDecoration[] = markers.map(
        (marker) => ({
          id: "lineHighlight",
          range: new monaco!.Range(
            marker.startLineNumber,
            1,
            marker.startLineNumber,
            model!.getLineMaxColumn(marker.startLineNumber)
          ),
          options: {
            after: {
              content: `${marker.message}`,
              inlineClassName: "inline-error",
            },
          },
          stickiness:
            monaco?.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        })
      );

      decorationIdsRef.current =
        model?.deltaDecorations(decorationIdsRef.current, decorations) ?? [];
    }

    return (
      <>
        <style>
          {`
          .inline-error {
            color: #f88;
            margin-left: 8px;
            font-size: 0.9em;
          }
        `}
        </style>
        <div className="w-full h-full">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage={language}
            value={data}
            options={{
              minimap: { enabled: false },
              fontSize: 18, // 设置字体大小
              contextmenu: false, // 禁止右键菜单
            }}
            theme="vs-dark"
            onValidate={handleEditorValidation}
            onMount={onEditorMount}
            onChange={onChange}
          />
        </div>
      </>
    );
  }
);

export default MonacoEditor;

// types.ts (或者放在 MonacoEditor.tsx 同文件中)
export interface MonacoEditorRef {
  format: () => void;
  getValue: () => any;
}
