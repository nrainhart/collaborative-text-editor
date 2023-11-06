const colors = {
  gray: {
    900: "#141434",
  },
  blue: {
    600: "#0057AD",
  },
};

const fontWeights = {
  semibold: 600,
};

export const toolbar = "editor-toolbar";
export const placeholder = "editor-placeholder";
const paragraph = "editor-text-paragraph";
const bold = "editor-text-bold";
const italic = "editor-text-italic";
const strikethrough = "editor-text-strikethrough";

const h1 = "editor-heading-h1";
const h2 = "editor-heading-h2";
const link = "editor-link";
const quote = "editor-quote";

const ul1 = "editor-ul-1";
const ul2 = "editor-ul-2";
const ul3 = "editor-ul-3";

const ol1 = "editor-ol-1";
const ol2 = "editor-ol-2";
const ol3 = "editor-ol-3";
const li = "editor-li";
const nestedLi = "editor-nested-li";
const code = "editor-code";

export const theme = {
  link,
  quote,
  paragraph,
  code,
  heading: { h1, h2 },
  // text code is inline code
  text: { code, bold, italic, strikethrough },
  list: {
    listitem: li,
    olDepth: [ol1, ol2, ol3],
    ulDepth: [ul1, ul2, ul3],
    nested: { listitem: nestedLi },
  },
};

const baseList = {
  padding: 0,
  margin: 0,
  marginLeft: 20,
  listStylePosition: "outside",
};

const baseText = {
  fontSize: "0.875rem",
  lineHeight: "1.25rem",
};

export const baseStyles = {
  "> *": { outline: "none" },

  [`.${paragraph}`]: baseText,

  [`.${code}`]: {
    backgroundColor: "rgb(240, 242, 245)",
    padding: "1px 0.25rem",
    fontFamily: "Menlo, Consolas, Monaco, monospace",
    fontSize: "94%",
  },

  [`.${bold}`]: { fontWeight: "bold" },
  [`.${italic}`]: { fontStyle: "italic" },
  [`.${strikethrough}`]: { textDecoration: "line-through" },

  [`.${h1}`]: {
    color: colors.gray[900],
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: fontWeights.semibold,
    letterSpacing: "-0.4px",
  },
  [`.${h2}`]: {
    color: colors.gray[900],
    fontSize: "1.25rem",
    lineHeight: "2rem",
    fontWeight: fontWeights.semibold,
    letterSpacing: "-0.4px",
  },

  [`.${quote}`]: {
    ...baseText,
    borderLeft: "2px solid rgb(220, 225, 230)",
    marginLeft: "0px",
    marginRight: "0px",
    paddingLeft: "0.5rem",
    color: "rgb(97, 112, 128)",
  },

  [`.${li}`]: {
    ...baseText,
    paddingBottom: "0.25rem",
  },

  [`.${ul1}`]: { ...baseList, listStyleType: "disc" },
  [`.${ul2}`]: { ...baseList, listStyleType: "circle" },
  [`.${ul3}`]: { ...baseList, listStyleType: "square" },

  [`.${ol1}`]: { ...baseList, listStyleType: "decimal" },
  [`.${ol2}`]: { ...baseList, listStyleType: "lower-alpha" },
  [`.${ol3}`]: { ...baseList, listStyleType: "lower-roman" },

  [`.${nestedLi}`]: { listStyleType: "none" },
  [`.${nestedLi}:after`]: { display: "none" },
  [`.${nestedLi}:before`]: { display: "none" },

  [`.${link}`]: {
    color: colors.blue[600],
    textDecoration: "underline",
    cursor: "pointer",
  },
};
