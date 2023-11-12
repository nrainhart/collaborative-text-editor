import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import "./styles.css";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { TRANSFORMERS } from "@lexical/markdown";
import AutoLinkPlugin from "./AutoLinkPlugin";
import FixedBottomToolbarPlugin from "./FixedBottomToolbarPlugin";
import { Box, ChakraProvider, Heading } from "@chakra-ui/react";
import { baseStyles, theme } from "./theme";

const initialConfig = {
  namespace: "",
  theme,
  onError: (error) => console.error(error),
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    LinkNode,
    AutoLinkNode,
    CodeNode,
  ],
};

const collaborativeRoom = {
  id: "some-id",
  serverUrl: "ws://localhost:8787/chat",
  userId: "some-user-id",
  username: "Nico",
};

/**
 * TODO:
 *  - style editor
 *  - serve React site from Cloudflare Worker
 */

const App = () => (
  <ChakraProvider>
    <Heading as="h1" mb="16px">
      10Pi-Notes 🌲
    </Heading>
    <Box css={baseStyles}>
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
          editorState: null,
        }}
      >
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={<ContentEditable />}
          placeholder={<div />}
        />
        <CollaborationPlugin
          id={collaborativeRoom.id}
          providerFactory={(id, yjsDocMap) => {
            const doc = new Y.Doc();
            yjsDocMap.set(id, doc);
            return new WebsocketProvider(collaborativeRoom.serverUrl, id, doc, {
              params: { userId: collaborativeRoom.userId },
            });
          }}
          // Optional initial editor state in case collaborative Y.Doc won't
          // have any existing data on server. Then it'll use this value to populate editor.
          // It accepts same type of values as LexicalComposer editorState
          // prop (json string, state object, or a function)
          initialEditorState={null}
          shouldBootstrap={true}
          username={collaborativeRoom.username}
        />
        <ListPlugin />
        <HistoryPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <TabIndentationPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <FixedBottomToolbarPlugin />
      </LexicalComposer>
    </Box>
  </ChakraProvider>
);

export default App;
