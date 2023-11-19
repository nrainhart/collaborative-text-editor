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
import AutoFocusPlugin from "./AutoFocusPlugin";
import AutoLinkPlugin from "./AutoLinkPlugin";
import FixedBottomToolbarPlugin from "./FixedBottomToolbarPlugin";
import { Box, ChakraProvider, Heading } from "@chakra-ui/react";
import { baseStyles, theme } from "./theme";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";

// const WS_SERVER_URL = "ws://localhost:8787/chat";
const WS_SERVER_URL = "wss://omniknight.10pines-labs.workers.dev/chat";

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

const randomId = () => Math.floor(Math.random() * 100_000).toString();
const randomUsername = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: " ",
    length: 2,
    style: "capital",
  });

const url = new URL(window.location.href);
const searchParams = url.searchParams;
const roomId = searchParams.get("roomId") || "default-room-id";
const username = searchParams.get("username") || randomUsername();

const collaborativeRoom = {
  id: roomId,
  serverUrl: WS_SERVER_URL,
  userId: randomId(),
  username,
};

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
        <AutoFocusPlugin />
      </LexicalComposer>
    </Box>
  </ChakraProvider>
);

export default App;
