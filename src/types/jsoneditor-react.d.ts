declare module "jsoneditor-react" {
  import * as React from "react";

  export interface JsonEditorProps {
    value?: any;
    mode?: "tree" | "view" | "form" | "code" | "text";
    onChange?: (value: any) => void;
    mainMenuBar?: boolean;
    navigationBar?: boolean;
    statusBar?: boolean;
    enableSort: boolean;
    enableTransform: boolean;
  }
  export class JsonEditor extends React.Component<JsonEditorProps> {
    jsonEditor: any;
  }
}
