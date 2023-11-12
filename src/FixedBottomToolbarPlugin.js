import { useState, useCallback, useEffect } from "react";
import {
  ListNode,
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  KEY_MODIFIER_COMMAND,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isHeadingNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Box, Button as CharkraButton } from "@chakra-ui/react";
import { toolbar } from "./theme";
import { icons } from "./icons";

const IS_APPLE = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const HOTKEY_PREFIX_SHORT = IS_APPLE ? "⌘" : "Ctrl";
const HOTKEY_PREFIX = IS_APPLE
  ? HOTKEY_PREFIX_SHORT
  : `${HOTKEY_PREFIX_SHORT}+`;

function Button({ iconName, ...rest }) {
  const Icon = iconName ? icons[iconName] : null;
  return (
    <CharkraButton
      leftIcon={<Icon />}
      paddingRight="0.25rem"
      size="sm"
      marginRight="4px"
      height="24px"
      width="24px"
      {...rest}
    />
  );
}

export function BoldButton({ isActive, onClick }) {
  return (
    <Button
      iconName="bold"
      title={`Bold (${HOTKEY_PREFIX}B)`}
      aria-label={`Format text as bold. Shortcut: ${HOTKEY_PREFIX}B`}
      isActive={isActive}
      onClick={onClick}
    />
  );
}

export function ItalicButton({ isActive, onClick }) {
  return (
    <Button
      iconName="italic"
      isActive={isActive}
      title={`Italic (${HOTKEY_PREFIX}I)`}
      aria-label={`Format text as italic. Shortcut: ${HOTKEY_PREFIX}I`}
      onClick={onClick}
    />
  );
}

export function StrikethroughButton({ isActive, onClick }) {
  return (
    <Button
      iconName="strikethrough"
      title={`Strike through (${HOTKEY_PREFIX_SHORT}+Shift+X)`}
      aria-label={`Format text as strike through. Shortcut: ${HOTKEY_PREFIX_SHORT}+Shift+X`}
      isActive={isActive}
      onClick={onClick}
    />
  );
}

export function BulletListButton({ isDisabled, blockType }) {
  const [editor] = useLexicalComposerContext();
  const isActive = blockType === "bullet";

  const onClick = () => {
    if (isActive) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <Button
      iconName="bullet-list"
      title="Format selection as bullet list"
      aria-label="Format selection as bullet list"
      isActive={isActive}
      isDisabled={isDisabled}
      onClick={onClick}
    />
  );
}

export function OrderedListButton({ isDisabled, blockType }) {
  const [editor] = useLexicalComposerContext();
  const isActive = blockType === "number";

  const onClick = () => {
    if (isActive) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  return (
    <Button
      iconName="ordered-list"
      title="Format selection as ordered list"
      aria-label="Format selection as ordered list"
      isActive={isActive}
      isDisabled={isDisabled}
      onClick={onClick}
    />
  );
}

export default function FixedBottomToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        KEY_MODIFIER_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  return (
    <Box className={toolbar}>
      <BoldButton
        isActive={isBold}
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }
      />

      <ItalicButton
        isActive={isItalic}
        onClick={() =>
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }
      />

      <StrikethroughButton
        isActive={isStrikethrough}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      />

      <BulletListButton blockType={blockType} />
      <OrderedListButton blockType={blockType} />
    </Box>
  );
}
