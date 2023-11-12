import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLayoutEffect } from "react";

const AutoFocusPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    setTimeout(() => editor.focus(), 1000);
  }, [editor]);

  return null;
};

export default AutoFocusPlugin;
