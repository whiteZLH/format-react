import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Navigate } from "react-router-dom";
import MonacoEditor, { type MonacoEditorRef } from "../components/MonacoEditor";
import CustomJsonEditor from "../components/JsonEditor";
import { getStrategy } from "../strategies";
import {
  Play,
  Minimize2,
  Maximize2,
  ArrowLeftRight,
  Wand2,
  Type,
  GripVertical,
} from "lucide-react";
import { cn } from "../lib/utils";

// Button Component
const ToolButton = ({
  onClick,
  children,
  icon: Icon,
  className,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  icon?: any;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-9 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md text-sm font-medium transition-colors flex items-center gap-2 border border-border/50",
      className
    )}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

const UniversalFormatter = () => {
  const { lang } = useParams<{ lang: string }>();
  const strategy = getStrategy(lang || "json");

  const editorRef = useRef<MonacoEditorRef | null>(null);
  const [dataStr, setDataStr] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);

  // Split Pane State
  const [leftWidth, setLeftWidth] = useState(60); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDataStr("");
    setJsonData(null);
    if (strategy?.id === "json") {
      const init = `["Hello This is a format util!"]`;
      setDataStr(init);
      try {
        setJsonData(JSON.parse(init));
      } catch (e) {}
    }
  }, [strategy]);

  // Drag Handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limits
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        setLeftWidth(newLeftWidth);
      }
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // Disable text selection while dragging
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!strategy) {
    return <Navigate to="/format/json" replace />;
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      setJsonData("");
      return;
    }
    if (strategy.id === "json") {
      try {
        const parsed = JSON.parse(value);
        setJsonData(parsed);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleJsonEditorChange = (value: any) => {
    const jsonStr = JSON.stringify(value);
    setDataStr(jsonStr);
    setTimeout(() => editorRef.current?.format(), 0);
  };

  const executeAction = (action: (code: string) => string) => {
    const value = editorRef.current?.getValue();
    if (value === undefined) return;
    const result = action(value);
    setDataStr(result);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center px-6 gap-3 bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="mr-4 text-muted-foreground font-semibold uppercase tracking-wider text-xs">
          {strategy.name} Tool
        </div>

        <ToolButton
          icon={Play}
          onClick={() => editorRef.current?.format()}
          className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
        >
          格式化
        </ToolButton>

        {strategy.compress && (
          <ToolButton
            icon={Minimize2}
            onClick={() => executeAction(strategy.compress!)}
          >
            压缩
          </ToolButton>
        )}
        {strategy.escape && (
          <ToolButton
            icon={ArrowLeftRight}
            onClick={() => executeAction(strategy.escape!)}
          >
            转义
          </ToolButton>
        )}
        {strategy.unescape && (
          <ToolButton
            icon={Maximize2}
            onClick={() => executeAction(strategy.unescape!)}
          >
            去除转义
          </ToolButton>
        )}
        {strategy.customActions?.map((action, index) => (
          <ToolButton
            key={index}
            icon={Wand2}
            onClick={() => executeAction(action.action)}
          >
            {action.label}
          </ToolButton>
        ))}
      </div>

      {/* Editors Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden p-6 flex relative"
        style={{ gap: strategy.id === "json" ? 0 : "1.5rem" }}
      >
        <div
          className={cn(
            "flex flex-col",
            // Disable transition during drag for immediate response
            !isDragging && "transition-all duration-200 ease-out"
          )}
          style={{ width: strategy.id === "json" ? `${leftWidth}%` : "100%" }}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Type className="w-4 h-4" />
              <span>Source Code</span>
            </div>
          </div>

          <div
            className={cn(
              "flex-1 rounded-xl border border-border overflow-hidden shadow-sm bg-card relative",
              strategy.id === "json" ? "rounded-r-none border-r-0" : "" // Merge borders if adjacent
            )}
          >
            <MonacoEditor
              data={dataStr}
              ref={editorRef}
              onChange={handleEditorChange}
              language={strategy.monacoLanguage}
            />
          </div>
        </div>

        {/* Resizer Handle */}
        {strategy.id === "json" && (
          <div
            className="w-4 flex items-center justify-center cursor-col-resize hover:bg-white/5 transition-colors z-20 -ml-[1px] -mr-[1px]"
            onMouseDown={handleMouseDown}
          >
            <div className="w-[1px] h-full bg-border" />
            <GripVertical className="w-4 h-4 text-muted-foreground absolute pointer-events-none bg-card" />
          </div>
        )}

        {strategy.id === "json" && (
          <div
            className="flex flex-col"
            style={{ width: `${100 - leftWidth}%` }}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Type className="w-4 h-4" />
                <span>Visual Editor</span>
              </div>
            </div>
            <div className="flex-1 rounded-xl border border-border overflow-hidden shadow-sm bg-white bg-noise p-0 rounded-l-none border-l-0">
              <CustomJsonEditor
                className="h-full border-none"
                value={jsonData}
                onChange={handleJsonEditorChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalFormatter;
