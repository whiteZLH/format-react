import React, { useEffect, useRef } from "react";
import { JsonEditor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
/* custom-jsoneditor.css */
import "../assets/css/custom-jsoneditor.css";

type Props = {
  value: any;
  onChange: (value: any) => void;
  mode?: "tree" | "view" | "form" | "code" | "text";
  className?: string; // 容器自定义样式
  height?: string; // 高度控制，例如 '500px' 或 '100%'
};

const CustomJsonEditor: React.FC<Props> = ({
  value,
  onChange,
  mode = "tree",
  className = "",
}) => {
  const editorRef = useRef<JsonEditor | null>(null);
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.jsonEditor.update(value);
      editorRef.current.jsonEditor.expandAll();
    }
  }, [value]);

  return (
    <>
      <div className={`rounded-xl border p-4 shadow CustomJsonEditor ${className}`}>
        <JsonEditor
          ref={editorRef}
          value={value}
          mode={mode}
          mainMenuBar={false}
          navigationBar={true}
          statusBar={false}
          onChange={onChange}
          enableSort={false}
          enableTransform={false}
        />
      </div>
    </>
  );
};

export default CustomJsonEditor;
