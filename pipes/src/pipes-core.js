import { Container as Container$1, Client, connect } from "@dagger.io/dagger";
export * from "@dagger.io/dagger";
import process$1, { cwd } from "node:process";
import autoBind from "auto-bind";
import originalIsCi from "is-ci";
import throttle from "lodash/throttle.js";
import { observable, autorun, runInAction, createAtom, when, reaction } from "mobx";
import * as React from "react";
import React__default, { forwardRef, createContext as createContext$1, useContext, PureComponent } from "react";
import initYoga from "yoga-wasm-web";
import { EventEmitter } from "node:events";
import * as fs from "node:fs";
import codeExcerpt from "code-excerpt";
import StackUtils from "stack-utils";
import chalk from "chalk";
import widestLine from "widest-line";
import cliTruncate from "cli-truncate";
import wrapAnsi from "wrap-ansi";
import createReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants.js";
import { styledCharsFromTokens, tokenize, styledCharsToString } from "@alcalzone/ansi-tokenize";
import sliceAnsi from "slice-ansi";
import stringWidth from "string-width";
import indentString from "indent-string";
import cliBoxes from "cli-boxes";
import ciinfo from "ci-info";
import terminalLink from "terminal-link";
import formatDate from "date-fns/format/index.js";
import enGB from "date-fns/locale/en-GB/index.js";
import enUS from "date-fns/locale/en-US/index.js";
import { sha1 } from "object-hash";
import { parseArgs } from "node:util";
import { ZodType, z } from "zod";
export { z } from "zod";
import { Writable } from "node:stream";


const Yoga = await initYoga(
  fs.readFileSync('./node_modules/yoga-wasm-web/dist/yoga.wasm')
)

/**
 * `<Box>` is an essential Ink component to build your layout. It's like `<div style="display: flex">` in the browser.
 */ const Box = /*#__PURE__*/ forwardRef(({ children, ...style }, ref) => {
  return /*#__PURE__*/ React__default.createElement(
    "ink-box",
    {
      ref: ref,
      style: {
        ...style,
        overflowX: style.overflowX ?? style.overflow ?? "visible",
        overflowY: style.overflowY ?? style.overflow ?? "visible",
      },
    },
    children,
  );
});
Box.displayName = "Box";
Box.defaultProps = {
  flexWrap: "nowrap",
  flexDirection: "row",
  flexGrow: 0,
  flexShrink: 1,
};

const rgbRegex = /^rgb\(\s?(\d+),\s?(\d+),\s?(\d+)\s?\)$/;
const ansiRegex = /^ansi256\(\s?(\d+)\s?\)$/;
const isNamedColor = (color) => {
  return color in chalk;
};
const colorize = (str, color, type) => {
  if (!color) {
    return str;
  }
  if (isNamedColor(color)) {
    if (type === "foreground") {
      return chalk[color](str);
    }
    const methodName = `bg${color[0].toUpperCase() + color.slice(1)}`;
    return chalk[methodName](str);
  }
  if (color.startsWith("#")) {
    return type === "foreground" ? chalk.hex(color)(str) : chalk.bgHex(color)(str);
  }
  if (color.startsWith("ansi256")) {
    const matches = ansiRegex.exec(color);
    if (!matches) {
      return str;
    }
    const value = Number(matches[1]);
    return type === "foreground" ? chalk.ansi256(value)(str) : chalk.bgAnsi256(value)(str);
  }
  if (color.startsWith("rgb")) {
    const matches = rgbRegex.exec(color);
    if (!matches) {
      return str;
    }
    const firstValue = Number(matches[1]);
    const secondValue = Number(matches[2]);
    const thirdValue = Number(matches[3]);
    return type === "foreground"
      ? chalk.rgb(firstValue, secondValue, thirdValue)(str)
      : chalk.bgRgb(firstValue, secondValue, thirdValue)(str);
  }
  return str;
};

/**
 * This component can display text, and change its style to make it colorful, bold, underline, italic or strikethrough.
 */ function Text({
  color,
  backgroundColor,
  dimColor = false,
  bold = false,
  italic = false,
  underline = false,
  strikethrough = false,
  inverse = false,
  wrap = "wrap",
  children,
}) {
  if (children === undefined || children === null) {
    return null;
  }
  const transform = (children) => {
    if (dimColor) {
      children = chalk.dim(children);
    }
    if (color) {
      children = colorize(children, color, "foreground");
    }
    if (backgroundColor) {
      children = colorize(children, backgroundColor, "background");
    }
    if (bold) {
      children = chalk.bold(children);
    }
    if (italic) {
      children = chalk.italic(children);
    }
    if (underline) {
      children = chalk.underline(children);
    }
    if (strikethrough) {
      children = chalk.strikethrough(children);
    }
    if (inverse) {
      children = chalk.inverse(children);
    }
    return children;
  };
  return /*#__PURE__*/ React__default.createElement(
    "ink-text",
    {
      style: {
        flexGrow: 0,
        flexShrink: 1,
        flexDirection: "row",
        textWrap: wrap,
      },
      internal_transform: transform,
    },
    children,
  );
}

// Error's source file is reported as file:///home/user/file.js
// This function removes the file://[cwd] part
const cleanupPath = (path) => {
  return path?.replace(`file://${cwd()}/`, "");
};
const stackUtils = new StackUtils({
  cwd: cwd(),
  internals: StackUtils.nodeInternals(),
});
function ErrorOverview({ error }) {
  const stack = error.stack ? error.stack.split("\n").slice(1) : undefined;
  const origin = stack ? stackUtils.parseLine(stack[0]) : undefined;
  const filePath = cleanupPath(origin?.file);
  let excerpt;
  let lineWidth = 0;
  if (filePath && origin?.line && fs.existsSync(filePath)) {
    const sourceCode = fs.readFileSync(filePath, "utf8");
    excerpt = codeExcerpt(sourceCode, origin.line);
    if (excerpt) {
      for (const { line } of excerpt) {
        lineWidth = Math.max(lineWidth, String(line).length);
      }
    }
  }
  return /*#__PURE__*/ React__default.createElement(
    Box,
    {
      flexDirection: "column",
      padding: 1,
    },
    /*#__PURE__*/ React__default.createElement(
      Box,
      null,
      /*#__PURE__*/ React__default.createElement(
        Text,
        {
          backgroundColor: "red",
          color: "white",
        },
        " ",
        "ERROR",
        " ",
      ),
      /*#__PURE__*/ React__default.createElement(Text, null, " ", error.message),
    ),
    origin &&
      filePath &&
      /*#__PURE__*/ React__default.createElement(
        Box,
        {
          marginTop: 1,
        },
        /*#__PURE__*/ React__default.createElement(
          Text,
          {
            dimColor: true,
          },
          filePath,
          ":",
          origin.line,
          ":",
          origin.column,
        ),
      ),
    origin &&
      excerpt &&
      /*#__PURE__*/ React__default.createElement(
        Box,
        {
          marginTop: 1,
          flexDirection: "column",
        },
        excerpt.map(({ line, value }) =>
          /*#__PURE__*/ React__default.createElement(
            Box,
            {
              key: line,
            },
            /*#__PURE__*/ React__default.createElement(
              Box,
              {
                width: lineWidth + 1,
              },
              /*#__PURE__*/ React__default.createElement(
                Text,
                {
                  dimColor: line !== origin.line,
                  backgroundColor: line === origin.line ? "red" : undefined,
                  color: line === origin.line ? "white" : undefined,
                },
                String(line).padStart(lineWidth, " "),
                ":",
              ),
            ),
            /*#__PURE__*/ React__default.createElement(
              Text,
              {
                key: line,
                backgroundColor: line === origin.line ? "red" : undefined,
                color: line === origin.line ? "white" : undefined,
              },
              ` ${value}`,
            ),
          ),
        ),
      ),
    error.stack &&
      /*#__PURE__*/ React__default.createElement(
        Box,
        {
          marginTop: 1,
          flexDirection: "column",
        },
        error.stack
          .split("\n")
          .slice(1)
          .map((line) => {
            const parsedLine = stackUtils.parseLine(line);
            // If the line from the stack cannot be parsed, we print out the unparsed line.
            if (!parsedLine) {
              return /*#__PURE__*/ React__default.createElement(
                Box,
                {
                  key: line,
                },
                /*#__PURE__*/ React__default.createElement(
                  Text,
                  {
                    dimColor: true,
                  },
                  "- ",
                ),
                /*#__PURE__*/ React__default.createElement(
                  Text,
                  {
                    dimColor: true,
                    bold: true,
                  },
                  line,
                ),
              );
            }
            return /*#__PURE__*/ React__default.createElement(
              Box,
              {
                key: line,
              },
              /*#__PURE__*/ React__default.createElement(
                Text,
                {
                  dimColor: true,
                },
                "- ",
              ),
              /*#__PURE__*/ React__default.createElement(
                Text,
                {
                  dimColor: true,
                  bold: true,
                },
                parsedLine.function,
              ),
              /*#__PURE__*/ React__default.createElement(
                Text,
                {
                  dimColor: true,
                  color: "gray",
                },
                " ",
                "(",
                cleanupPath(parsedLine.file) ?? "",
                ":",
                parsedLine.line,
                ":",
                parsedLine.column,
                ")",
              ),
            );
          }),
      ),
  );
}

const getWidth = () => {
  const isTest = import.meta.url.includes(".spec.");
  return isTest ? 80 : Math.min(process.stdout.columns ?? 80, 80);
};
const WidthContext = createContext$1(getWidth());
const useWidthContext = () => {
  return useContext(WidthContext);
};

// Root component for all Ink apps
// It renders stdin and stdout contexts, so that children can access them if needed
// It also handles Ctrl+C exiting and cursor visibility
class App extends PureComponent {
  static displayName = "InternalApp";
  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }
  state = {
    isFocusEnabled: true,
    activeFocusId: undefined,
    focusables: [],
    error: undefined,
  };
  // Count how many components enabled raw mode to avoid disabling
  // raw mode until all components don't need it anymore
  rawModeEnabledCount = 0;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  internal_eventEmitter = new EventEmitter();
  render() {
    return /*#__PURE__*/ React__default.createElement(
      WidthContext.Provider,
      {
        value: getWidth(),
      },
      this.state.error
        ? /*#__PURE__*/ React__default.createElement(ErrorOverview, {
            error: this.state.error,
          })
        : this.props.children,
    );
  }
  componentDidMount() {}
  componentWillUnmount() {}
}

const cache$1 = {};
const measureText = (text) => {
  if (text.length === 0) {
    return {
      width: 0,
      height: 0,
    };
  }
  const cachedDimensions = cache$1[text];
  if (cachedDimensions) {
    return cachedDimensions;
  }
  const width = widestLine(text);
  const height = text.split("\n").length;
  cache$1[text] = {
    width,
    height,
  };
  return {
    width,
    height,
  };
};

// Squashing text nodes allows to combine multiple text nodes into one and write
// to `Output` instance only once. For example, <Text>hello{' '}world</Text>
// is actually 3 text nodes, which would result 3 writes to `Output`.
//
// Also, this is necessary for libraries like ink-link (https://github.com/sindresorhus/ink-link),
// which need to wrap all children at once, instead of wrapping 3 text nodes separately.
const squashTextNodes = (node) => {
  let text = "";
  for (let index = 0; index < node.childNodes.length; index++) {
    const childNode = node.childNodes[index];
    if (childNode === undefined) {
      continue;
    }
    let nodeText = "";
    if (childNode.nodeName === "#text") {
      nodeText = childNode.nodeValue;
    } else {
      if (childNode.nodeName === "ink-text" || childNode.nodeName === "ink-virtual-text") {
        nodeText = squashTextNodes(childNode);
      }
      // Since these text nodes are being concatenated, `Output` instance won't be able to
      // apply children transform, so we have to do it manually here for each text node
      if (nodeText.length > 0 && typeof childNode.internal_transform === "function") {
        nodeText = childNode.internal_transform(nodeText, index);
      }
    }
    text += nodeText;
  }
  return text;
};

const cache = {};
const wrapText = (text, maxWidth, wrapType) => {
  const cacheKey = text + String(maxWidth) + String(wrapType);
  const cachedText = cache[cacheKey];
  if (cachedText) {
    return cachedText;
  }
  let wrappedText = text;
  if (wrapType === "wrap") {
    wrappedText = wrapAnsi(text, maxWidth, {
      trim: false,
      hard: true,
    });
  }
  if (wrapType.startsWith("truncate")) {
    let position = "end";
    if (wrapType === "truncate-middle") {
      position = "middle";
    }
    if (wrapType === "truncate-start") {
      position = "start";
    }
    wrappedText = cliTruncate(text, maxWidth, {
      position,
    });
  }
  cache[cacheKey] = wrappedText;
  return wrappedText;
};

const createNode = (nodeName) => {
  const node = {
    nodeName,
    style: {},
    attributes: {},
    childNodes: [],
    parentNode: undefined,
    yogaNode: nodeName === "ink-virtual-text" ? undefined : Yoga.Node.create(),
  };
  if (nodeName === "ink-text") {
    node.yogaNode?.setMeasureFunc(measureTextNode.bind(null, node));
  }
  return node;
};
const appendChildNode = (node, childNode) => {
  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode);
  }
  childNode.parentNode = node;
  node.childNodes.push(childNode);
  if (childNode.yogaNode) {
    node.yogaNode?.insertChild(childNode.yogaNode, node.yogaNode.getChildCount());
  }
  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};
const insertBeforeNode = (node, newChildNode, beforeChildNode) => {
  if (newChildNode.parentNode) {
    removeChildNode(newChildNode.parentNode, newChildNode);
  }
  newChildNode.parentNode = node;
  const index = node.childNodes.indexOf(beforeChildNode);
  if (index >= 0) {
    node.childNodes.splice(index, 0, newChildNode);
    if (newChildNode.yogaNode) {
      node.yogaNode?.insertChild(newChildNode.yogaNode, index);
    }
    return;
  }
  node.childNodes.push(newChildNode);
  if (newChildNode.yogaNode) {
    node.yogaNode?.insertChild(newChildNode.yogaNode, node.yogaNode.getChildCount());
  }
  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};
const removeChildNode = (node, removeNode) => {
  if (removeNode.yogaNode) {
    removeNode.parentNode?.yogaNode?.removeChild(removeNode.yogaNode);
  }
  removeNode.parentNode = undefined;
  const index = node.childNodes.indexOf(removeNode);
  if (index >= 0) {
    node.childNodes.splice(index, 1);
  }
  if (node.nodeName === "ink-text" || node.nodeName === "ink-virtual-text") {
    markNodeAsDirty(node);
  }
};
const setAttribute = (node, key, value) => {
  node.attributes[key] = value;
};
const setStyle = (node, style) => {
  node.style = style;
};
const createTextNode = (text) => {
  const node = {
    nodeName: "#text",
    nodeValue: text,
    yogaNode: undefined,
    parentNode: undefined,
    style: {},
  };
  setTextNodeValue(node, text);
  return node;
};
const measureTextNode = function (node, width) {
  const text = node.nodeName === "#text" ? node.nodeValue : squashTextNodes(node);
  const dimensions = measureText(text);
  // Text fits into container, no need to wrap
  if (dimensions.width <= width) {
    return dimensions;
  }
  // This is happening when <Box> is shrinking child nodes and Yoga asks
  // if we can fit this text node in a <1px space, so we just tell Yoga "no"
  if (dimensions.width >= 1 && width > 0 && width < 1) {
    return dimensions;
  }
  const textWrap = node.style?.textWrap ?? "wrap";
  const wrappedText = wrapText(text, width, textWrap);
  return measureText(wrappedText);
};
const findClosestYogaNode = (node) => {
  if (!node?.parentNode) {
    return undefined;
  }
  return node.yogaNode ?? findClosestYogaNode(node.parentNode);
};
const markNodeAsDirty = (node) => {
  // Mark closest Yoga node as dirty to measure text dimensions again
  const yogaNode = findClosestYogaNode(node);
  yogaNode?.markDirty();
};
const setTextNodeValue = (node, text) => {
  if (typeof text !== "string") {
    text = String(text);
  }
  node.nodeValue = text;
  markNodeAsDirty(node);
};

const applyPositionStyles = (node, style) => {
  if ("position" in style) {
    node.setPositionType(style.position === "absolute" ? Yoga.POSITION_TYPE_ABSOLUTE : Yoga.POSITION_TYPE_RELATIVE);
  }
};
const applyMarginStyles = (node, style) => {
  if ("margin" in style) {
    node.setMargin(Yoga.EDGE_ALL, style.margin ?? 0);
  }
  if ("marginX" in style) {
    node.setMargin(Yoga.EDGE_HORIZONTAL, style.marginX ?? 0);
  }
  if ("marginY" in style) {
    node.setMargin(Yoga.EDGE_VERTICAL, style.marginY ?? 0);
  }
  if ("marginLeft" in style) {
    node.setMargin(Yoga.EDGE_START, style.marginLeft || 0);
  }
  if ("marginRight" in style) {
    node.setMargin(Yoga.EDGE_END, style.marginRight || 0);
  }
  if ("marginTop" in style) {
    node.setMargin(Yoga.EDGE_TOP, style.marginTop || 0);
  }
  if ("marginBottom" in style) {
    node.setMargin(Yoga.EDGE_BOTTOM, style.marginBottom || 0);
  }
};
const applyPaddingStyles = (node, style) => {
  if ("padding" in style) {
    node.setPadding(Yoga.EDGE_ALL, style.padding ?? 0);
  }
  if ("paddingX" in style) {
    node.setPadding(Yoga.EDGE_HORIZONTAL, style.paddingX ?? 0);
  }
  if ("paddingY" in style) {
    node.setPadding(Yoga.EDGE_VERTICAL, style.paddingY ?? 0);
  }
  if ("paddingLeft" in style) {
    node.setPadding(Yoga.EDGE_LEFT, style.paddingLeft || 0);
  }
  if ("paddingRight" in style) {
    node.setPadding(Yoga.EDGE_RIGHT, style.paddingRight || 0);
  }
  if ("paddingTop" in style) {
    node.setPadding(Yoga.EDGE_TOP, style.paddingTop || 0);
  }
  if ("paddingBottom" in style) {
    node.setPadding(Yoga.EDGE_BOTTOM, style.paddingBottom || 0);
  }
};
const applyFlexStyles = (node, style) => {
  if ("flexGrow" in style) {
    node.setFlexGrow(style.flexGrow ?? 0);
  }
  if ("flexShrink" in style) {
    node.setFlexShrink(typeof style.flexShrink === "number" ? style.flexShrink : 1);
  }
  if ("flexWrap" in style) {
    if (style.flexWrap === "nowrap") {
      node.setFlexWrap(Yoga.WRAP_NO_WRAP);
    }
    if (style.flexWrap === "wrap") {
      node.setFlexWrap(Yoga.WRAP_WRAP);
    }
    if (style.flexWrap === "wrap-reverse") {
      node.setFlexWrap(Yoga.WRAP_WRAP_REVERSE);
    }
  }
  if ("flexDirection" in style) {
    if (style.flexDirection === "row") {
      node.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
    }
    if (style.flexDirection === "row-reverse") {
      node.setFlexDirection(Yoga.FLEX_DIRECTION_ROW_REVERSE);
    }
    if (style.flexDirection === "column") {
      node.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
    }
    if (style.flexDirection === "column-reverse") {
      node.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN_REVERSE);
    }
  }
  if ("flexBasis" in style) {
    if (typeof style.flexBasis === "number") {
      node.setFlexBasis(style.flexBasis);
    } else if (typeof style.flexBasis === "string") {
      node.setFlexBasisPercent(Number.parseInt(style.flexBasis, 10));
    } else {
      // This should be replaced with node.setFlexBasisAuto() when new Yoga release is out
      node.setFlexBasis(Number.NaN);
    }
  }
  if ("alignItems" in style) {
    if (style.alignItems === "stretch" || !style.alignItems) {
      node.setAlignItems(Yoga.ALIGN_STRETCH);
    }
    if (style.alignItems === "flex-start") {
      node.setAlignItems(Yoga.ALIGN_FLEX_START);
    }
    if (style.alignItems === "center") {
      node.setAlignItems(Yoga.ALIGN_CENTER);
    }
    if (style.alignItems === "flex-end") {
      node.setAlignItems(Yoga.ALIGN_FLEX_END);
    }
  }
  if ("alignSelf" in style) {
    if (style.alignSelf === "auto" || !style.alignSelf) {
      node.setAlignSelf(Yoga.ALIGN_AUTO);
    }
    if (style.alignSelf === "flex-start") {
      node.setAlignSelf(Yoga.ALIGN_FLEX_START);
    }
    if (style.alignSelf === "center") {
      node.setAlignSelf(Yoga.ALIGN_CENTER);
    }
    if (style.alignSelf === "flex-end") {
      node.setAlignSelf(Yoga.ALIGN_FLEX_END);
    }
  }
  if ("justifyContent" in style) {
    if (style.justifyContent === "flex-start" || !style.justifyContent) {
      node.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
    }
    if (style.justifyContent === "center") {
      node.setJustifyContent(Yoga.JUSTIFY_CENTER);
    }
    if (style.justifyContent === "flex-end") {
      node.setJustifyContent(Yoga.JUSTIFY_FLEX_END);
    }
    if (style.justifyContent === "space-between") {
      node.setJustifyContent(Yoga.JUSTIFY_SPACE_BETWEEN);
    }
    if (style.justifyContent === "space-around") {
      node.setJustifyContent(Yoga.JUSTIFY_SPACE_AROUND);
    }
  }
};
const applyDimensionStyles = (node, style) => {
  if ("width" in style) {
    if (typeof style.width === "number") {
      node.setWidth(style.width);
    } else if (typeof style.width === "string") {
      node.setWidthPercent(Number.parseInt(style.width, 10));
    } else {
      node.setWidthAuto();
    }
  }
  if ("height" in style) {
    if (typeof style.height === "number") {
      node.setHeight(style.height);
    } else if (typeof style.height === "string") {
      node.setHeightPercent(Number.parseInt(style.height, 10));
    } else {
      node.setHeightAuto();
    }
  }
  if ("minWidth" in style) {
    if (typeof style.minWidth === "string") {
      node.setMinWidthPercent(Number.parseInt(style.minWidth, 10));
    } else {
      node.setMinWidth(style.minWidth ?? 0);
    }
  }
  if ("minHeight" in style) {
    if (typeof style.minHeight === "string") {
      node.setMinHeightPercent(Number.parseInt(style.minHeight, 10));
    } else {
      node.setMinHeight(style.minHeight ?? 0);
    }
  }
};
const applyDisplayStyles = (node, style) => {
  if ("display" in style) {
    node.setDisplay(style.display === "flex" ? Yoga.DISPLAY_FLEX : Yoga.DISPLAY_NONE);
  }
};
const applyBorderStyles = (node, style) => {
  if ("borderStyle" in style) {
    const borderWidth = style.borderStyle ? 1 : 0;
    if (style.borderTop !== false) {
      node.setBorder(Yoga.EDGE_TOP, borderWidth);
    }
    if (style.borderBottom !== false) {
      node.setBorder(Yoga.EDGE_BOTTOM, borderWidth);
    }
    if (style.borderLeft !== false) {
      node.setBorder(Yoga.EDGE_LEFT, borderWidth);
    }
    if (style.borderRight !== false) {
      node.setBorder(Yoga.EDGE_RIGHT, borderWidth);
    }
  }
};
const applyGapStyles = (node, style) => {
  if ("gap" in style) {
    node.setGap(Yoga.GUTTER_ALL, style.gap ?? 0);
  }
  if ("columnGap" in style) {
    node.setGap(Yoga.GUTTER_COLUMN, style.columnGap ?? 0);
  }
  if ("rowGap" in style) {
    node.setGap(Yoga.GUTTER_ROW, style.rowGap ?? 0);
  }
};
const styles = (node, style = {}) => {
  applyPositionStyles(node, style);
  applyMarginStyles(node, style);
  applyPaddingStyles(node, style);
  applyFlexStyles(node, style);
  applyDimensionStyles(node, style);
  applyDisplayStyles(node, style);
  applyBorderStyles(node, style);
  applyGapStyles(node, style);
};

const diff = (before, after) => {
  if (before === after) {
    return;
  }
  if (!before) {
    return after;
  }
  const changed = {};
  let isChanged = false;
  for (const key of Object.keys(before)) {
    const isDeleted = after ? !Object.hasOwnProperty.call(after, key) : true;
    if (isDeleted) {
      changed[key] = undefined;
      isChanged = true;
    }
  }
  if (after) {
    for (const key of Object.keys(after)) {
      if (after[key] !== before[key]) {
        changed[key] = after[key];
        isChanged = true;
      }
    }
  }
  return isChanged ? changed : undefined;
};
const cleanupYogaNode = (node) => {
  node?.unsetMeasureFunc();
  node?.freeRecursive();
};
function createInkReconciler(callback) {
  return createReconciler({
    getRootHostContext: () => ({
      isInsideText: false,
    }),
    prepareForCommit: () => null,
    preparePortalMount: () => null,
    clearContainer: () => false,
    resetAfterCommit(rootNode) {
      if (typeof rootNode.onComputeLayout === "function") {
        rootNode.onComputeLayout();
      }
      // Since renders are throttled at the instance level and <Static> component children
      // are rendered only once and then get deleted, we need an escape hatch to
      // trigger an immediate render to ensure <Static> children are written to output before they get erased
      if (rootNode.isStaticDirty) {
        rootNode.isStaticDirty = false;
        if (typeof rootNode.onImmediateRender === "function") {
          rootNode.onImmediateRender();
        }
        return;
      }
      if (typeof rootNode.onRender === "function") {
        rootNode.onRender();
      }
    },
    getChildHostContext(parentHostContext, type) {
      const previousIsInsideText = parentHostContext.isInsideText;
      const isInsideText = type === "ink-text" || type === "ink-virtual-text";
      if (previousIsInsideText === isInsideText) {
        return parentHostContext;
      }
      return {
        isInsideText,
      };
    },
    shouldSetTextContent: () => false,
    createInstance(originalType, newProps, _root, hostContext) {
      if (hostContext.isInsideText && originalType === "ink-box") {
        throw new Error(`<Box> can’t be nested inside <Text> component`);
      }
      const type = originalType === "ink-text" && hostContext.isInsideText ? "ink-virtual-text" : originalType;
      const node = createNode(type);
      for (const [key, value] of Object.entries(newProps)) {
        if (key === "children") {
          continue;
        }
        if (key === "style") {
          setStyle(node, value);
          if (node.yogaNode) {
            styles(node.yogaNode, value);
          }
          continue;
        }
        if (key === "internal_transform") {
          node.internal_transform = value;
          continue;
        }
        if (key === "internal_static") {
          node.internal_static = true;
          continue;
        }
        setAttribute(node, key, value);
      }
      return node;
    },
    createTextInstance(text, _root, hostContext) {
      if (!hostContext.isInsideText) {
        throw new Error(`Text string "${text}" must be rendered inside <Text> component`);
      }
      return createTextNode(text);
    },
    resetTextContent() {},
    hideTextInstance(node) {
      setTextNodeValue(node, "");
    },
    unhideTextInstance(node, text) {
      setTextNodeValue(node, text);
    },
    getPublicInstance: (instance) => instance,
    hideInstance(node) {
      node.yogaNode?.setDisplay(Yoga.DISPLAY_NONE);
    },
    unhideInstance(node) {
      node.yogaNode?.setDisplay(Yoga.DISPLAY_FLEX);
    },
    appendInitialChild: appendChildNode,
    appendChild: appendChildNode,
    insertBefore: insertBeforeNode,
    finalizeInitialChildren(node, _type, _props, rootNode) {
      if (node.internal_static) {
        rootNode.isStaticDirty = true;
        // Save reference to <Static> node to skip traversal of entire
        // node tree to find it
        rootNode.staticNode = node;
      }
      return false;
    },
    isPrimaryRenderer: true,
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    noTimeout: -1,
    getCurrentEventPriority: () => DefaultEventPriority,
    beforeActiveInstanceBlur() {},
    afterActiveInstanceBlur() {},
    detachDeletedInstance() {},
    getInstanceFromNode: () => null,
    prepareScopeUpdate() {},
    getInstanceFromScope: () => null,
    appendChildToContainer: appendChildNode,
    insertInContainerBefore: insertBeforeNode,
    removeChildFromContainer(node, removeNode) {
      removeChildNode(node, removeNode);
      cleanupYogaNode(removeNode.yogaNode);
    },
    prepareUpdate(node, _type, oldProps, newProps, rootNode) {
      if (node.internal_static) {
        rootNode.isStaticDirty = true;
      }
      const props = diff(oldProps, newProps);
      const style = diff(oldProps["style"], newProps["style"]);
      if (!props && !style) {
        return null;
      }
      return {
        props,
        style,
      };
    },
    commitUpdate(node, { props, style }) {
      if (props) {
        for (const [key, value] of Object.entries(props)) {
          if (key === "style") {
            setStyle(node, value);
            continue;
          }
          if (key === "internal_transform") {
            node.internal_transform = value;
            continue;
          }
          if (key === "internal_static") {
            node.internal_static = true;
            continue;
          }
          setAttribute(node, key, value);
        }
      }
      if (style && node.yogaNode) {
        styles(node.yogaNode, style);
      }
      callback();
    },
    commitTextUpdate(node, _oldText, newText) {
      setTextNodeValue(node, newText);
      callback();
    },
    removeChild(node, removeNode) {
      removeChildNode(node, removeNode);
      cleanupYogaNode(removeNode.yogaNode);
    },
  });
}

class Output {
  width;
  height;
  operations = [];
  constructor(options) {
    const { width, height } = options;
    this.width = width;
    this.height = height;
  }
  write(x, y, text, options) {
    const { transformers } = options;
    if (!text) {
      return;
    }
    this.operations.push({
      type: "write",
      x,
      y,
      text,
      transformers,
    });
  }
  clip(clip) {
    this.operations.push({
      type: "clip",
      clip,
    });
  }
  unclip() {
    this.operations.push({
      type: "unclip",
    });
  }
  get() {
    // Initialize output array with a specific set of rows, so that margin/padding at the bottom is preserved
    const output = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push({
          type: "char",
          value: " ",
          fullWidth: false,
          styles: [],
        });
      }
      output.push(row);
    }
    const clips = [];
    for (const operation of this.operations) {
      if (operation.type === "clip") {
        clips.push(operation.clip);
      }
      if (operation.type === "unclip") {
        clips.pop();
      }
      if (operation.type === "write") {
        const { text, transformers } = operation;
        let { x, y } = operation;
        let lines = text.split("\n");
        const clip = clips[clips.length - 1];
        if (clip) {
          const clipHorizontally = typeof clip?.x1 === "number" && typeof clip?.x2 === "number";
          const clipVertically = typeof clip?.y1 === "number" && typeof clip?.y2 === "number";
          // If text is positioned outside of clipping area altogether,
          // skip to the next operation to avoid unnecessary calculations
          if (clipHorizontally) {
            const width = widestLine(text);
            if (x + width < clip.x1 || x > clip.x2) {
              continue;
            }
          }
          if (clipVertically) {
            const height = lines.length;
            if (y + height < clip.y1 || y > clip.y2) {
              continue;
            }
          }
          if (clipHorizontally) {
            lines = lines.map((line) => {
              const from = x < clip.x1 ? clip.x1 - x : 0;
              const width = stringWidth(line);
              const to = x + width > clip.x2 ? clip.x2 - x : width;
              return sliceAnsi(line, from, to);
            });
            if (x < clip.x1) {
              x = clip.x1;
            }
          }
          if (clipVertically) {
            const from = y < clip.y1 ? clip.y1 - y : 0;
            const height = lines.length;
            const to = y + height > clip.y2 ? clip.y2 - y : height;
            lines = lines.slice(from, to);
            if (y < clip.y1) {
              y = clip.y1;
            }
          }
        }
        let offsetY = 0;
        // eslint-disable-next-line prefer-const
        for (let [index, line] of lines.entries()) {
          const currentLine = output[y + offsetY];
          // Line can be missing if `text` is taller than height of pre-initialized `this.output`
          if (!currentLine) {
            continue;
          }
          for (const transformer of transformers) {
            line = transformer(line, index);
          }
          const characters = styledCharsFromTokens(tokenize(line));
          let offsetX = x;
          for (const character of characters) {
            currentLine[offsetX] = character;
            // Some characters take up more than one column. In that case, the following
            // pixels need to be cleared to avoid printing extra characters
            const isWideCharacter = character.fullWidth || character.value.length > 1;
            if (isWideCharacter) {
              currentLine[offsetX + 1] = {
                type: "char",
                value: "",
                fullWidth: false,
                styles: character.styles,
              };
            }
            offsetX += isWideCharacter ? 2 : 1;
          }
          offsetY++;
        }
      }
    }
    const generatedOutput = output
      .map((line) => {
        // See https://github.com/vadimdemedes/ink/pull/564#issuecomment-1637022742
        const lineWithoutEmptyItems = line.filter((item) => item !== undefined);
        return styledCharsToString(lineWithoutEmptyItems).trimEnd();
      })
      .join("\n");
    return {
      output: generatedOutput,
      height: output.length,
    };
  }
}

function getMaxWidth(yogaNode) {
  return (
    yogaNode.getComputedWidth() -
    yogaNode.getComputedPadding(Yoga.EDGE_LEFT) -
    yogaNode.getComputedPadding(Yoga.EDGE_RIGHT) -
    yogaNode.getComputedBorder(Yoga.EDGE_LEFT) -
    yogaNode.getComputedBorder(Yoga.EDGE_RIGHT)
  );
}

const renderBorder = (x, y, node, output) => {
  if (node.style.borderStyle) {
    const width = node.yogaNode.getComputedWidth();
    const height = node.yogaNode.getComputedHeight();
    const box = typeof node.style.borderStyle === "string" ? cliBoxes[node.style.borderStyle] : node.style.borderStyle;
    const topBorderColor = node.style.borderTopColor ?? node.style.borderColor;
    const bottomBorderColor = node.style.borderBottomColor ?? node.style.borderColor;
    const leftBorderColor = node.style.borderLeftColor ?? node.style.borderColor;
    const rightBorderColor = node.style.borderRightColor ?? node.style.borderColor;
    const dimTopBorderColor = node.style.borderTopDimColor ?? node.style.borderDimColor;
    const dimBottomBorderColor = node.style.borderBottomDimColor ?? node.style.borderDimColor;
    const dimLeftBorderColor = node.style.borderLeftDimColor ?? node.style.borderDimColor;
    const dimRightBorderColor = node.style.borderRightDimColor ?? node.style.borderDimColor;
    const showTopBorder = node.style.borderTop !== false;
    const showBottomBorder = node.style.borderBottom !== false;
    const showLeftBorder = node.style.borderLeft !== false;
    const showRightBorder = node.style.borderRight !== false;
    const contentWidth = width - (showLeftBorder ? 1 : 0) - (showRightBorder ? 1 : 0);
    let topBorder = showTopBorder
      ? colorize(
          (showLeftBorder ? box.topLeft : "") + box.top.repeat(contentWidth) + (showRightBorder ? box.topRight : ""),
          topBorderColor,
          "foreground",
        )
      : undefined;
    if (showTopBorder && dimTopBorderColor) {
      topBorder = chalk.dim(topBorder);
    }
    let verticalBorderHeight = height;
    if (showTopBorder) {
      verticalBorderHeight -= 1;
    }
    if (showBottomBorder) {
      verticalBorderHeight -= 1;
    }
    let leftBorder = `${colorize(box.left, leftBorderColor, "foreground")}\n`.repeat(verticalBorderHeight);
    if (dimLeftBorderColor) {
      leftBorder = chalk.dim(leftBorder);
    }
    let rightBorder = `${colorize(box.right, rightBorderColor, "foreground")}\n`.repeat(verticalBorderHeight);
    if (dimRightBorderColor) {
      rightBorder = chalk.dim(rightBorder);
    }
    let bottomBorder = showBottomBorder
      ? colorize(
          (showLeftBorder ? box.bottomLeft : "") +
            box.bottom.repeat(contentWidth) +
            (showRightBorder ? box.bottomRight : ""),
          bottomBorderColor,
          "foreground",
        )
      : undefined;
    if (showBottomBorder && dimBottomBorderColor) {
      bottomBorder = chalk.dim(bottomBorder);
    }
    const offsetY = showTopBorder ? 1 : 0;
    if (topBorder) {
      output.write(x, y, topBorder, {
        transformers: [],
      });
    }
    if (showLeftBorder) {
      output.write(x, y + offsetY, leftBorder, {
        transformers: [],
      });
    }
    if (showRightBorder) {
      output.write(x + width - 1, y + offsetY, rightBorder, {
        transformers: [],
      });
    }
    if (bottomBorder) {
      output.write(x, y + height - 1, bottomBorder, {
        transformers: [],
      });
    }
  }
};

// If parent container is `<Box>`, text nodes will be treated as separate nodes in
// the tree and will have their own coordinates in the layout.
// To ensure text nodes are aligned correctly, take X and Y of the first text node
// and use it as offset for the rest of the nodes
// Only first node is taken into account, because other text nodes can't have margin or padding,
// so their coordinates will be relative to the first node anyway
const applyPaddingToText = (node, text) => {
  const yogaNode = node.childNodes[0]?.yogaNode;
  if (yogaNode) {
    const offsetX = yogaNode.getComputedLeft();
    const offsetY = yogaNode.getComputedTop();
    text = "\n".repeat(offsetY) + indentString(text, offsetX);
  }
  return text;
};
// After nodes are laid out, render each to output object, which later gets rendered to terminal
const renderNodeToOutput = (node, output, options) => {
  const { offsetX = 0, offsetY = 0, transformers = [], skipStaticElements } = options;
  if (skipStaticElements && node.internal_static) {
    return;
  }
  const { yogaNode } = node;
  if (yogaNode) {
    if (yogaNode.getDisplay() === Yoga.DISPLAY_NONE) {
      return;
    }
    // Left and top positions in Yoga are relative to their parent node
    const x = offsetX + yogaNode.getComputedLeft();
    const y = offsetY + yogaNode.getComputedTop();
    // Transformers are functions that transform final text output of each component
    // See Output class for logic that applies transformers
    let newTransformers = transformers;
    if (typeof node.internal_transform === "function") {
      newTransformers = [node.internal_transform, ...transformers];
    }
    if (node.nodeName === "ink-text") {
      let text = squashTextNodes(node);
      if (text.length > 0) {
        const currentWidth = widestLine(text);
        const maxWidth = getMaxWidth(yogaNode);
        if (currentWidth > maxWidth) {
          const textWrap = node.style.textWrap ?? "wrap";
          text = wrapText(text, maxWidth, textWrap);
        }
        text = applyPaddingToText(node, text);
        output.write(x, y, text, {
          transformers: newTransformers,
        });
      }
      return;
    }
    let clipped = false;
    if (node.nodeName === "ink-box") {
      renderBorder(x, y, node, output);
      const clipHorizontally = node.style.overflowX === "hidden" || node.style.overflow === "hidden";
      const clipVertically = node.style.overflowY === "hidden" || node.style.overflow === "hidden";
      if (clipHorizontally || clipVertically) {
        const x1 = clipHorizontally ? x + yogaNode.getComputedBorder(Yoga.EDGE_LEFT) : undefined;
        const x2 = clipHorizontally
          ? x + yogaNode.getComputedWidth() - yogaNode.getComputedBorder(Yoga.EDGE_RIGHT)
          : undefined;
        const y1 = clipVertically ? y + yogaNode.getComputedBorder(Yoga.EDGE_TOP) : undefined;
        const y2 = clipVertically
          ? y + yogaNode.getComputedHeight() - yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM)
          : undefined;
        output.clip({
          x1,
          x2,
          y1,
          y2,
        });
        clipped = true;
      }
    }
    if (node.nodeName === "ink-root" || node.nodeName === "ink-box") {
      for (const childNode of node.childNodes) {
        renderNodeToOutput(childNode, output, {
          offsetX: x,
          offsetY: y,
          transformers: newTransformers,
          skipStaticElements,
        });
      }
      if (clipped) {
        output.unclip();
      }
    }
  }
};

const renderer = (node) => {
  if (node.yogaNode) {
    const output = new Output({
      width: node.yogaNode.getComputedWidth(),
      height: node.yogaNode.getComputedHeight(),
    });
    renderNodeToOutput(node, output, {
      skipStaticElements: true,
    });
    let { output: generatedOutput } = output.get();
    let staticOutput;
    if (node.staticNode?.yogaNode) {
      staticOutput = new Output({
        width: node.staticNode.yogaNode.getComputedWidth(),
        height: node.staticNode.yogaNode.getComputedHeight(),
      });
      renderNodeToOutput(node.staticNode, staticOutput, {
        skipStaticElements: false,
      });
    }
    if (staticOutput) {
      generatedOutput = `${staticOutput.get().output}\n${generatedOutput}`;
    }
    return generatedOutput;
  }
  return "";
};

const _RENDER_STATE = {
  force_stop: false,
};
const haltAllRender = () => {
  _RENDER_STATE.force_stop = true;
};
class WriteTo {
  static #locked = false;
  static #lockPromises = [];
  static #newLockPromise = () => {
    const value = new Promise((resolve) => {
      this.#lockPromises.push(resolve);
    });
    return value;
  };
  static #getFirstResolve = () => {
    const val = this.#lockPromises.shift();
    return val;
  };
  static lock = async (fn) => {
    if (this.#locked) {
      await this.#newLockPromise();
    }
    this.#locked = true;
    try {
      await fn(this.#write);
    } finally {
      const val = this.#getFirstResolve();
      if (val) {
        val();
      } else {
        this.#locked = false;
      }
    }
  };
  static #write(msg, output = "stdout") {
    if (_RENDER_STATE.force_stop) {
      return;
    }
    process$1[output].write(msg);
  }
}

const isCi = process$1.env["CI"] === "false" ? false : originalIsCi;
const noop = () => {};
const _THROTTLE_MS = 500;
class Ink {
  toString;
  // Ignore last render after unmounting a tree to prevent empty output before exit
  #isUnmounted;
  #container;
  #rootNode;
  #_renderCB;
  #renderCB;
  #rec;
  #unsubscribeResize;
  constructor(toString) {
    this.toString = toString;
    this.#_renderCB = () => {};
    this.#renderCB = () => {
      this.#_renderCB();
    };
    this.#rec = createInkReconciler(this.#renderCB);
    this.resized = () => {
      this.calculateLayout();
    };
    this.#autorunDispenser = null;
    this.prevValues = "";
    this.calculateLayout = () => {
      // The 'columns' property can be undefined or 0 when not using a TTY.
      // In that case we fall back to 80.
      const terminalWidth = getWidth();
      this.#rootNode.yogaNode.setWidth(terminalWidth);
      this.#rootNode.yogaNode.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR);
    };
    autoBind(this);
    this.#rootNode = createNode("ink-root");
    this.#rootNode.onComputeLayout = this.calculateLayout;
    // Ignore last render after unmounting a tree to prevent empty output before exit
    this.#isUnmounted = false;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.#container = this.#rec.createContainer(
      this.#rootNode, // Legacy mode
      0,
      null,
      false,
      null,
      "id",
      () => {},
      null,
    );
    if (!isCi) {
      process$1.stdout.on("resize", this.resized);
      this.#unsubscribeResize = () => {
        process$1.stdout.off("resize", this.resized);
      };
    }
  }
  resized;
  #autorunDispenser;
  #getRenderedOutput() {
    return renderer(this.#rootNode);
  }
  prevValues;
  #setupAutorun(fn) {
    if (this.#autorunDispenser) {
      this.#autorunDispenser();
    }
    const updateStore = observable({
      value: "",
    });
    const forceUpdate = () =>
      runInAction(() => {
        updateStore.value = this.#getRenderedOutput();
      });
    this.#_renderCB = forceUpdate;
    const update = throttle(
      async (value) => {
        if (this.#isUnmounted) {
          return;
        }
        if (value !== this.prevValues) {
          this.prevValues = value;
          if (!this.toString) {
            await WriteTo.lock((write) => {
              write(`\n${value}\n`, "stdout");
            });
          }
        }
      },
      _THROTTLE_MS,
      {
        leading: true,
        trailing: true,
      },
    );
    this.#autorunDispenser = autorun(async () => {
      updateStore.value;
      const nodeValue = await (() => {
        if (typeof fn === "function") {
          return fn();
        }
        return fn;
      })();
      const node = /*#__PURE__*/ React__default.createElement(App, null, nodeValue);
      this.#rec.updateContainer(node, this.#container, null, noop);
      const value = this.#getRenderedOutput();
      await update(value);
    });
  }
  calculateLayout;
  async render(node, now = false) {
    if (now) {
      const x = await (typeof node === "function" ? node() : node);
      this.#rec.updateContainer(x, this.#container, null, noop);
      const value = this.#getRenderedOutput();
      if (!this.toString) {
        await WriteTo.lock((write) => {
          write(`\n${value}\n`, "stdout");
        });
      }
      return;
    }
    if (this.#autorunDispenser) {
      const x = await (typeof node === "function" ? node() : node);
      this.#rec.updateContainer(x, this.#container, null, noop);
      return;
    }
    this.#setupAutorun(node);
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  unmount(_error) {
    if (this.#isUnmounted) {
      return;
    }
    this.calculateLayout();
    if (this.#autorunDispenser) {
      this.#autorunDispenser();
    }
    if (typeof this.#unsubscribeResize === "function") {
      this.#unsubscribeResize();
    }
    this.#isUnmounted = true;
    this.#rec.updateContainer(null, this.#container, null, noop);
  }
}

/**
 * Mount a component and render the output.
 */ const render = async (node, toString = false) => {
  const instance = new Ink(toString);
  await instance.render(node);
  return {
    stop: async () => {
      await instance.render(node);
      instance.unmount();
    },
    value: () => instance.prevValues,
  };
};

/**
 * Transform a string representation of React components before they are written to output.
 * For example, you might want to apply a gradient to text, add a clickable link or create some text effects.
 * These use cases can't accept React nodes as input, they are expecting a string.
 * That's what <Transform> component does,
 * it gives you an output string of its child components and lets you transform it in any way.
 */ function Transform({ children, transform }) {
  if (children === undefined || children === null) {
    return null;
  }
  return /*#__PURE__*/ React__default.createElement(
    "ink-text",
    {
      style: {
        flexGrow: 0,
        flexShrink: 1,
        flexDirection: "row",
      },
      internal_transform: transform,
    },
    children,
  );
}

const Badge = (props) => {
  const type = props.display ?? "ansi";
  return renderBadge[type]({
    type: "Badge",
    ...props,
  });
};
const renderBadge = {
  ansi: (component) => {
    const val = component.children.trim().split("")[0] ?? "X";
    return /*#__PURE__*/ React.createElement(
      Box,
      {
        height: 1,
        marginLeft: 1,
        marginRight: 1,
        width: 4,
      },
      /*#__PURE__*/ React.createElement(
        Text,
        {
          wrap: "truncate",
          bold: true,
          color: component.color,
          backgroundColor: component.backgroundColor,
        },
        "[",
        val,
        "]",
      ),
    );
  },
  markdown: (_component) => {
    throw new Error("Not implemented");
  },
};

const Container = (props) => {
  return renderContainer.ansi({
    type: "Container",
    ...props,
  });
};
const renderContainer = {
  ansi: (component) => {
    const color = component.color ?? undefined;
    return /*#__PURE__*/ React__default.createElement(
      Box,
      {
        borderColor: color,
        alignSelf: "center",
        paddingLeft: component.padding ?? 0,
        paddingRight: component.padding ?? 0,
      },
      component.children,
    );
  },
  markdown: (_component) => {
    throw new Error("Not implemented");
  },
};

const Row = (props) => {
  const type = props.display ?? "ansi";
  return renderRow[type]({
    type: "Row",
    ...props,
  });
};
const renderRow = {
  ansi: (component) => {
    const color = component.color ?? "gray";
    const children = Array.isArray(component.children) ? component.children : [component.children];
    const widths = Array(children.length)
      .fill(0)
      .map((_e) => {
        return `${Math.floor(100 / children.length)}%`;
      });
    return /*#__PURE__*/ React.createElement(
      Box,
      {
        flexDirection: "row",
        width: "100%",
        borderTop: false,
        borderBottom: false,
        borderLeft: false,
        borderRight: false,
        borderStyle: "single",
        borderColor: color,
        borderDimColor: true,
      },
      children.map((e, index) => {
        const child = typeof e === "string" ? /*#__PURE__*/ React.createElement(Text, null, e) : e;
        return /*#__PURE__*/ React.createElement(
          Box,
          {
            key: index,
            alignSelf: "flex-start",
            paddingLeft: 1,
            paddingRight: 1,
            width: widths[index],
          },
          child,
        );
      }),
    );
  },
  markdown: (_component) => {
    throw new Error("Not implemented");
  },
};

const Subtitle = (props) => {
  const type = props.display ?? "ansi";
  return renderSubtitle[type]({
    type: "Subtitle",
    ...props,
  });
};
const renderSubtitle = {
  ansi: (component) => {
    const color = component.color ?? "blue";
    const label = component.emoji
      ? /*#__PURE__*/ React__default.createElement(
          Badge,
          {
            color: "white",
            backgroundColor: color,
          },
          component.emoji,
        )
      : /*#__PURE__*/ React__default.createElement(React__default.Fragment, null);
    return /*#__PURE__*/ React__default.createElement(
      Container,
      {
        color: color,
      },
      label,
      /*#__PURE__*/ React__default.createElement(
        Text,
        {
          backgroundColor: color,
          color: "white",
          bold: true,
        },
        " ".repeat(2),
        component.children.toUpperCase(),
        " ".repeat(2),
      ),
    );
  },
  markdown: (component) => {
    throw new Error("Not implemented");
  },
};

const Dialog = (props) => {
  const emojiType = {
    default: "",
    error: "X",
    success: "✔",
    failure: "!",
  }[props.dialogType ?? "default"];
  const borderColor = {
    default: "blue",
    error: "red",
    success: "green",
    failure: "red",
  }[props.dialogType ?? "default"];
  const allIsString = React__default.Children.toArray(props.children).every(
    (e) => typeof e === "string" || typeof e === "number",
  );
  let children = React__default.Children.map(React__default.Children.toArray(props.children), (e) => {
    if (allIsString) {
      return e;
    }
    if (typeof e === "string" || typeof e === "number") {
      return /*#__PURE__*/ React__default.createElement(Text, null, `${e}`.trim());
    }
    return e;
  });
  if (allIsString) {
    children = [
      /*#__PURE__*/ React__default.createElement(
        Text,
        {
          key: "text",
        },
        children.join(""),
      ),
    ];
  }
  if (children.length === 0) {
    return /*#__PURE__*/ React__default.createElement(React__default.Fragment, null);
  }
  return /*#__PURE__*/ React__default.createElement(
    Row,
    null,
    typeof props.dialogType === "string" && props.dialogType !== "default"
      ? /*#__PURE__*/ React__default.createElement(
          Subtitle,
          {
            color: borderColor,
            emoji: emojiType,
          },
          props.title,
        )
      : /*#__PURE__*/ React__default.createElement(
          Container,
          null,
          /*#__PURE__*/ React__default.createElement(React__default.Fragment, null),
        ),
    /*#__PURE__*/ React__default.createElement(Container, null, children),
  );
};

const Divider = (_props) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return RenderDivider();
};
const RenderDivider = () => {
  const totalWidths = useWidthContext();
  return /*#__PURE__*/ React__default.createElement(Box, {
    width: totalWidths,
    minWidth: totalWidths,
    height: 1,
    borderTop: false,
    borderLeft: false,
    borderRight: false,
    borderBottom: true,
    borderStyle: "single",
  });
};

const Error$1 = (props) => {
  return renderError.ansi({
    type: "Error",
    ...props,
  });
};
const renderError = {
  ansi: (component) => {
    return /*#__PURE__*/ React__default.createElement(
      Dialog,
      {
        title: component.title ?? "Error",
        dialogType: "error",
      },
      component.children,
    );
  },
  markdown: (_component) => {
    throw "Not implemented";
  },
};

const Failure = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return renderFailure.ansi({
    type: "Failure",
    ...props,
  });
};
const renderFailure = {
  ansi: (component) => {
    return /*#__PURE__*/ React__default.createElement(
      Dialog,
      {
        title: component.title ?? "Failure",
        dialogType: "failure",
      },
      component.children,
    );
  },
  markdown: (_component) => {
    throw new Error(`Not implemented`);
  },
};

const CMD_STRING = "::";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function toCommandValue(input) {
  if (input === null || input === undefined) {
    return "";
  } else if (typeof input === "string" || input instanceof String) {
    return input;
  }
  return JSON.stringify(input);
}
function escapeData(s) {
  return toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
function escapeProperty(s) {
  return toCommandValue(s)
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A")
    .replace(/:/g, "%3A")
    .replace(/,/g, "%2C");
}
class Command {
  command;
  message;
  properties;
  constructor(command, properties, message) {
    if (!command) {
      command = "missing.command";
    }
    this.command = command;
    this.properties = properties;
    this.message = message;
  }
  toString() {
    let cmdStr = CMD_STRING + this.command;
    if (this.properties && Object.keys(this.properties).length > 0) {
      cmdStr += " ";
      let first = true;
      for (const key in this.properties) {
        if (this.properties.hasOwnProperty(key)) {
          const val = this.properties[key];
          if (val) {
            if (first) {
              first = false;
            } else {
              cmdStr += ",";
            }
            cmdStr += `${key}=${escapeProperty(val)}`;
          }
        }
      }
    }
    cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
    return cmdStr;
  }
}

const Group = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return renderGroup.ansi({
    type: "Group",
    ...props,
  });
};
const renderGroup = {
  ansi: (component) => {
    if (React__default.Children.toArray(component.children).length === 0) {
      return /*#__PURE__*/ React__default.createElement(React__default.Fragment, null);
    }
    if (ciinfo.GITHUB_ACTIONS) {
      const startGroup = new Command("group", {}, component.title).toString();
      const endGroup = new Command("endgroup", {}, "").toString();
      return /*#__PURE__*/ React__default.createElement(
        React__default.Fragment,
        null,
        /*#__PURE__*/ React__default.createElement(Text, null, startGroup),
        component.children,
        /*#__PURE__*/ React__default.createElement(Text, null, endGroup),
      );
    }
    return /*#__PURE__*/ React__default.createElement(
      React__default.Fragment,
      null,
      /*#__PURE__*/ React__default.createElement(
        Box,
        {
          width: "100%",
          alignItems: "flex-end",
        },
        /*#__PURE__*/ React__default.createElement(
          Text,
          {
            color: "white",
            underline: true,
          },
          component.title.trim(),
        ),
      ),
      component.children,
    );
  },
  markdown: (component, _width) => {
    return component.children;
  },
};

const Info = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return renderInfo({
    type: "Info",
    ...props,
  });
};
const renderInfo = (props) => {
  return /*#__PURE__*/ React__default.createElement(
    Dialog,
    {
      title: props.title ?? "Info",
    },
    props.children,
  );
};

const Link = ({ url, children }) => {
  return /*#__PURE__*/ React__default.createElement(
    Transform,
    {
      transform: (children) =>
        terminalLink(children, url, {
          fallback: true,
        }),
    },
    /*#__PURE__*/ React__default.createElement(Text, null, children),
  );
};

const List = (props) => {
  return /*#__PURE__*/ React__default.createElement(
    Container,
    {
      padding: 2,
    },
    props.children,
  );
};
const ListItem = (props) => {
  const child = ["string", "number"].includes(typeof props.children)
    ? /*#__PURE__*/ React__default.createElement(Text, null, props.children)
    : props.children;
  return /*#__PURE__*/ React__default.createElement(
    Box,
    {
      width: "100%",
      flexDirection: "row",
    },
    /*#__PURE__*/ React__default.createElement(Text, null, "- "),
    child,
  );
};

const Log = (props) => {
  return /*#__PURE__*/ React__default.createElement(
    Box,
    {
      width: "100%",
      flexDirection: "row",
    },
    /*#__PURE__*/ React__default.createElement(Text, null, props.children),
  );
};

const Mask = (props) => {
  if (!ciinfo.GITHUB_ACTIONS) {
    return /*#__PURE__*/ React__default.createElement(React__default.Fragment, null);
  }
  const values = [props.values].flat();
  return /*#__PURE__*/ React__default.createElement(
    Transform,
    {
      transform: (line) => {
        return `${new Command("add-mask", {}, line).toString()}\n`;
      },
    },
    values.map((value) => value),
  );
};

const Success = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return renderSuccess.ansi({
    type: "Success",
    ...props,
  });
};
const renderSuccess = {
  ansi: (component) => {
    return /*#__PURE__*/ React__default.createElement(
      Dialog,
      {
        dialogType: "success",
        title: component.title ?? "Success",
      },
      component.children,
    );
  },
  markdown: (_component) => {
    throw new Error("Not implemented");
  },
};

const Timestamp = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return renderTimestamp.ansi({
    type: "Timestamp",
    ...props,
  });
};
const invalidTime = /*#__PURE__*/ React__default.createElement(
  Text,
  {
    color: "red",
  },
  "Invalid date",
);
const invalidDateFormat = /*#__PURE__*/ React__default.createElement(
  Text,
  {
    color: "red",
  },
  "Invalid date format",
);
const renderTimestamp = {
  ansi: (component) => {
    let date;
    if (component.time) {
      if (typeof component.time === "string" || typeof component.time === "number") {
        date = new Date(component.time);
      } else {
        date = component.time;
      }
    } else {
      date = new Date();
    }
    if (isNaN(date.getTime())) {
      return invalidTime;
    }
    const format = component.format || "ISO";
    let formattedDate;
    switch (format) {
      case "ISO":
        formattedDate = date.toISOString();
        break;
      case "European":
        formattedDate = formatDate(date, "PPpp", {
          locale: enGB,
        });
        break;
      case "American":
        formattedDate = formatDate(date, "PPpp", {
          locale: enUS,
        });
        break;
      default:
        try {
          formattedDate = formatDate(date, format);
        } catch (e) {
          return invalidDateFormat;
        }
    }
    return /*#__PURE__*/ React__default.createElement(
      Text,
      {
        color: "white",
        backgroundColor: "blue",
      },
      formattedDate,
    );
  },
  markdown: (_component) => {
    throw new Error("Not implemented");
  },
};

const Title = (props) => {
  return /*#__PURE__*/ React__default.createElement(
    Box,
    {
      width: "100%",
      marginTop: 1,
      marginBottom: 1,
      alignItems: "center",
    },
    /*#__PURE__*/ React__default.createElement(Text, null, props.children),
  );
};

/* Table */ class Table extends React__default.Component {
  /* Config */ /**
   * Merges provided configuration with defaults.
   */ getConfig() {
    return {
      data: this.props.data,
      columns: this.props.columns || this.getDataKeys(),
      padding: this.props.padding || 2,
      header: this.props.header || Header,
      cell: this.props.cell || Cell,
      skeleton: this.props.skeleton || Skeleton,
    };
  }
  /**
   * Gets all keyes used in data by traversing through the data.
   */ getDataKeys() {
    const keys = new Set();
    // Collect all the keys.
    for (const data of this.props.data) {
      for (const key in data) {
        keys.add(key);
      }
    }
    return Array.from(keys);
  }
  /**
   * Calculates the width of each column by finding
   * the longest value in a cell of a particular column.
   *
   * Returns a list of column names and their widths.
   */ getColumns() {
    const { columns, padding } = this.getConfig();
    const widths = columns.map((key) => {
      const header = String(key).length;
      /* Get the width of each cell in the column */ const data = this.props.data.map((data) => {
        const value = data[key];
        if (value == undefined || value == null) return 0;
        return String(value).length;
      });
      const width = Math.max(...data, header) + padding * 2;
      /* Construct a cell */ return {
        column: key,
        width: width,
        key: String(key),
      };
    });
    return widths;
  }
  /**
   * Returns a (data) row representing the headings.
   */ getHeadings() {
    const { columns } = this.getConfig();
    const headings = columns.reduce(
      (acc, column) => ({
        ...acc,
        [column]: column,
      }),
      {},
    );
    return headings;
  }
  /* Rendering utilities */ // The top most line in the table.
  header = row({
    cell: this.getConfig().skeleton,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      // chars
      line: "─",
      left: "┌",
      right: "┐",
      cross: "┬",
    },
  });
  // The line with column names.
  heading = row({
    cell: this.getConfig().header,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      // chars
      line: " ",
      left: "│",
      right: "│",
      cross: "│",
    },
  });
  // The line that separates rows.
  separator = row({
    cell: this.getConfig().skeleton,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      // chars
      line: "─",
      left: "├",
      right: "┤",
      cross: "┼",
    },
  });
  // The row with the data.
  data = row({
    cell: this.getConfig().cell,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      // chars
      line: " ",
      left: "│",
      right: "│",
      cross: "│",
    },
  });
  // The bottom most line of the table.
  footer = row({
    cell: this.getConfig().skeleton,
    padding: this.getConfig().padding,
    skeleton: {
      component: this.getConfig().skeleton,
      // chars
      line: "─",
      left: "└",
      right: "┘",
      cross: "┴",
    },
  });
  /* Render */ render() {
    /* Data */ const columns = this.getColumns();
    const headings = this.getHeadings();
    /**
     * Render the table line by line.
     */ return /*#__PURE__*/ React__default.createElement(
      Box,
      {
        flexDirection: "column",
        width: "100%",
      },
      this.header({
        key: "header",
        columns,
        data: {},
      }),
      this.heading({
        key: "heading",
        columns,
        data: headings,
      }),
      this.props.data.map((row, index) => {
        // Calculate the hash of the row based on its value and position
        const key = `row-${sha1(row)}-${index}`;
        // Construct a row.
        return /*#__PURE__*/ React__default.createElement(
          Box,
          {
            flexDirection: "column",
            key: key,
          },
          this.separator({
            key: `separator-${key}`,
            columns,
            data: {},
          }),
          this.data({
            key: `data-${key}`,
            columns,
            data: row,
          }),
        );
      }),
      this.footer({
        key: "footer",
        columns,
        data: {},
      }),
    );
  }
}
/**
 * Constructs a Row element from the configuration.
 */ function row(config) {
  /* This is a component builder. We return a function. */ const skeleton = config.skeleton;
  /* Row */ return (props) =>
    /*#__PURE__*/ React__default.createElement(
      Box,
      {
        flexDirection: "row",
      },
      /*#__PURE__*/ React__default.createElement(skeleton.component, null, skeleton.left),
      ...intersperse(
        (i) => {
          const key = `${props.key}-hseparator-${i}`;
          // The horizontal separator.
          return /*#__PURE__*/ React__default.createElement(
            skeleton.component,
            {
              key: key,
            },
            skeleton.cross,
          );
        }, // Values.
        props.columns.map((column, colI) => {
          // content
          const value = props.data[column.column];
          if (value == undefined || value == null) {
            const key = `${props.key}-empty-${column.key}`;
            return /*#__PURE__*/ React__default.createElement(
              config.cell,
              {
                key: key,
                column: colI,
              },
              skeleton.line.repeat(column.width),
            );
          } else {
            const key = `${props.key}-cell-${column.key}`;
            // margins
            const ml = config.padding;
            const mr = column.width - String(value).length - config.padding;
            return /* prettier-ignore */ /*#__PURE__*/ React__default.createElement(config.cell, {
                    key: key,
                    column: colI
                }, `${skeleton.line.repeat(ml)}${String(value)}${skeleton.line.repeat(mr)}`);
          }
        }),
      ),
      /*#__PURE__*/ React__default.createElement(skeleton.component, null, skeleton.right),
    );
}
/**
 * Renders the header of a table.
 */ function Header(props) {
  return /*#__PURE__*/ React__default.createElement(
    Text,
    {
      bold: true,
      color: "whiteBright",
    },
    props.children,
  );
}
/**
 * Renders a cell in the table.
 */ function Cell(props) {
  return /*#__PURE__*/ React__default.createElement(Text, null, props.children);
}
/**
 * Redners the scaffold of the table.
 */ function Skeleton(props) {
  return /*#__PURE__*/ React__default.createElement(
    Text,
    {
      dimColor: true,
      color: "gray",
    },
    props.children,
  );
}
/* Utility functions */ /**
 * Intersperses a list of elements with another element.
 */ function intersperse(intersperser, elements) {
  // Intersparse by reducing from left.
  const interspersed = elements.reduce((acc, element, index) => {
    // Only add element if it's the first one.
    if (acc.length === 0) return [element];
    // Add the intersparser as well otherwise.
    return [...acc, intersperser(index), element];
  }, []);
  return interspersed;
}

class DOMError extends Error {
  #message;
  constructor(pipeComponent) {
    super("Pipes Error"); // Ensure that pipeComponent can be converted to a string
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DOMError);
    }
    this.name = this.constructor.name;
    this.#message = /*#__PURE__*/ React__default.createElement(
      React__default.Fragment,
      null,
      pipeComponent,
      /*#__PURE__*/ React__default.createElement(Error$1, null, this.stack),
    );
    void render(this.#message);
  }
  get = () => {
    return this.#message;
  };
  toString = async () => {
    const value = await render(this.#message, true);
    return value.value();
  };
}

var dom = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  Badge: Badge,
  Container: Container,
  DOMError: DOMError,
  Dialog: Dialog,
  Divider: Divider,
  Error: Error$1,
  Failure: Failure,
  Group: Group,
  Info: Info,
  Link: Link,
  List: List,
  ListItem: ListItem,
  Log: Log,
  Mask: Mask,
  Row: Row,
  Subtitle: Subtitle,
  Success: Success,
  Table: Table,
  Text: Text,
  Timestamp: Timestamp,
  Title: Title,
  haltAllRender: haltAllRender,
  render: render,
});

const generateRandomString = (length = 10) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

class AtomMap {
  #atom = new Map();
  get(key) {
    if (!this.#atom.has(key)) {
      const randomStr = generateRandomString();
      const value = createAtom(`${randomStr}:${key}`);
      this.#atom.set(key, value);
      return value;
    }
    return this.#atom.get(key);
  }
}
const createAtomMap = () => new AtomMap();
function createBasicZodStore(v) {
  let currentValue = undefined;
  const atom = createAtom(generateRandomString());
  return new Proxy(
    {
      value: currentValue,
    },
    {
      get: (_target, prop) => {
        if (prop === "value") {
          atom.reportObserved();
          if (currentValue == undefined) {
            return v.parse(currentValue);
          }
          return currentValue;
        }
      },
      set: (_target, prop, value) => {
        if (prop === "value") {
          currentValue = v.parse(value);
          atom.reportChanged();
          return true;
        }
        return false;
      },
    },
  );
}
function createZodStore(obj, skip = []) {
  return new (class {
    /** @ts-expect-error: this is accessed */ #values = {};
    constructor() {
      const observables = createAtomMap();
      const skipped = skip.map(({ key }) => key);
      for (const { key, get, set } of skip) {
        // So we can get all keys with Object.keys
        this[key] = undefined;
        Object.defineProperty(this, key, {
          get,
          set: set ?? undefined,
        });
      }
      for (const key of Object.keys(obj)) {
        if (skipped.includes(key)) {
          continue;
        }
        if ("safeParse" in obj[key] && typeof obj[key] !== "function") {
          const newValue = obj[key].safeParse(undefined);
          if (newValue.success) {
            this.#values[key] = newValue.data;
          }
        }
        // So we can get all keys with Object.keys
        this[key] = true;
        Object.defineProperty(this, key, {
          get: () => {
            observables.get(key).reportObserved();
            if (typeof this.#values[key] === "undefined") {
              if (typeof obj[key] === "function") {
                this.#values[key] = obj[key];
              } else {
                this.#values[key] = obj[key].parse(undefined);
              }
            }
            return this.#values[key];
          },
          set: (value) => {
            if (typeof obj[key] === "function") {
              observables.get(key).reportChanged();
              this.#values[key] = obj[key]._wrapper(value);
              return true;
            }
            this.#values[key] = obj[key].parse(value);
            observables.get(key).reportChanged();
            return true;
          },
        });
      }
    }
  })();
}
const wrapContext = (obj, config, stack = [config.appName]) => {
  const functionParams = Object.entries(obj).filter(([_key, value]) => typeof value === "function");
  const skip = [
    {
      key: "stack",
      get: () => stack,
    },
    ...functionParams.map(([key, value]) => {
      return {
        key,
        get: () => {
          return (val) => {
            const newContext = wrapContext(obj, config, [...stack, key]);
            return value(newContext, config, val);
          };
        },
      };
    }),
  ];
  return new (class {
    /** @ts-expect-error: this is accessed */ #values = {};
    constructor() {
      const skipped = skip.map(({ key }) => key);
      for (const { key, get } of skip) {
        // So we can get all keys with Object.keys
        this[key] = undefined;
        Object.defineProperty(this, key, {
          get,
        });
      }
      for (const key of Object.keys(obj)) {
        if (skipped.includes(key)) {
          continue;
        }
        // So we can get all keys with Object.keys
        this[key] = true;
        Object.defineProperty(this, key, {
          get: () => {
            return obj[key];
          },
          set: (value) => {
            obj[key] = value;
            return true;
          },
        });
      }
    }
  })();
};
const createLockStore = () => {
  return new (class {
    #atom = createAtomMap();
    #map = new Map();
    #lockKey = (key) => {
      this.#map.set(key, true);
      this.#atom.get(key).reportChanged();
    };
    #unlock = (key) => {
      this.#map.set(key, false);
      this.#atom.get(key).reportChanged();
    };
    isLocked(key) {
      this.#atom.get(key).reportObserved();
      return this.#map.has(key) ? this.#map.get(key) === true : false;
    }
    waitForLock(key) {
      return new Promise((resolve) => {
        const fn = {};
        fn.stopWait = autorun(() => {
          this.#atom.get(key).reportObserved();
          const isLocked = this.isLocked(key);
          if (!isLocked) {
            resolve();
            if (!fn.stopWait) {
              return;
            }
            fn.stopWait();
          }
        });
      });
    }
    async lock(key, fn) {
      await this.waitForLock(key);
      this.#lockKey(key);
      let value;
      try {
        value = await fn();
      } catch (e) {
        this.#unlock(key);
        throw e;
      }
      this.#unlock(key);
      return value;
    }
  })();
};
const createZodKeyStore = (type) => {
  return new (class {
    #type;
    #atom = createAtomMap();
    #map = new Map();
    #lock = createLockStore();
    #allKeys = new Set();
    constructor() {
      this.#type = type;
    }
    async getAll() {
      const values = {};
      this.#atom.get("#getAll").reportObserved();
      for (const key of Array.from(this.#allKeys)) {
        const value = await this.getKey(key);
        values[key] = value;
      }
      return values;
    }
    awaitForAvailability(key) {
      return new Promise((resolve) => {
        const fn = {};
        fn.stopWaiting = autorun(async () => {
          this.#atom.get(key).reportObserved();
          const value = await this.getKey(key);
          if (value !== null) {
            resolve(value);
            if (!fn.stopWaiting) {
              return;
            }
            fn.stopWaiting();
          }
        });
      });
    }
    async getKey(key) {
      this.#atom.get(key).reportObserved();
      const value = await this.#lock.lock(key, () => {
        this.#atom.get(key).reportObserved();
        if (!this.#map.has(key)) {
          const value = this.#type.safeParse(undefined);
          if (value.success) {
            return value.data;
          }
        }
        return !this.#map.has(key) ? null : this.#map.get(key);
      });
      return value;
    }
    async setKey(key, value) {
      await this.#lock.lock(key, () => {
        this.#map.set(key, this.#type.parse(value));
        this.#allKeys.add(key);
        this.#atom.get(key).reportChanged();
        this.#atom.get("#getAll").reportChanged();
      });
    }
    async getOrSet(key, fn) {
      this.#atom.get(key).reportObserved();
      const value = await this.#lock.lock(key, async () => {
        if (!this.#map.has(key)) {
          const newValue = await fn();
          this.#atom.get(key).reportChanged();
          this.#atom.get("#getAll").reportChanged();
          this.#allKeys.add(key);
          this.#map.set(key, newValue);
          return newValue;
        }
        return this.#map.get(key);
      });
      return value;
    }
  })();
};
const globalstore = {};
const globalLock = createLockStore();
const createGlobalZodStore = (obj, key) => {
  return globalLock.lock(key, () => {
    if (globalstore[key]) {
      return globalstore[key];
    }
    globalstore[key] = createZodStore(obj);
    return globalstore[key];
  });
};
const createGlobalZodKeyStore = (obj, key) => {
  return globalLock.lock(key, () => {
    if (globalstore[key]) {
      return globalstore[key];
    }
    globalstore[key] = createZodKeyStore(obj);
    return globalstore[key];
  });
};
const globalSymbol = new Map();
let currentKey = 0;
const createZodSymbolStore = (obj) => {
  const getSymbolKey = (symbol) => {
    let hashKey;
    if (globalSymbol.has(symbol)) {
      hashKey = globalSymbol.get(symbol);
    } else {
      hashKey = `Symbol(id: ${currentKey++})`;
      globalSymbol.set(symbol, hashKey);
    }
    return hashKey;
  };
  const store = createZodKeyStore(obj);
  const allKeys = {};
  return {
    awaitForAvailability: (symbol) => {
      const key = getSymbolKey(symbol);
      return store.awaitForAvailability(key);
    },
    getAll: async () => {
      const values = await store.getAll();
      const obj = {};
      for (const key of Object.keys(values)) {
        const symbol = allKeys[key];
        obj[symbol] = values[key];
      }
      return obj;
    },
    getKey: (symbol) => {
      const key = getSymbolKey(symbol);
      return store.getKey(key);
    },
    getOrSet: (symbol, fn) => {
      const key = getSymbolKey(symbol);
      allKeys[key] = symbol;
      return store.getOrSet(key, fn);
    },
    setKey: (symbol, value) => {
      const key = getSymbolKey(symbol);
      allKeys[key] = symbol;
      return store.setKey(key, value);
    },
  };
};

const getMostInnerZodType = (schema, prev = null) => {
  // Check if the current schema has an innerType
  if (schema instanceof z.ZodString) {
    return "string";
  }
  if (schema instanceof z.ZodNumber) {
    return "number";
  }
  if (schema instanceof z.ZodBoolean) {
    return "boolean";
  }
  if (schema instanceof z.ZodLiteral) {
    return "literal";
  }
  if (schema instanceof z.ZodArray) {
    return `array:${getMostInnerZodType(schema._def.type, "array")}`;
  }
  if (schema instanceof z.ZodUnion) {
    return `union:literal`;
  }
  const inner = schema._def?.innerType;
  if (inner) {
    return getMostInnerZodType(inner);
  }
  throw new Error("Not implemented yet for env");
};
const oldDefault = ZodType.prototype.default;
const getArgv = (context, options) => {
  if (
    options === undefined || // Arg overwrites env
    options.arg === undefined
  ) {
    return null;
  }
  const fn = oldDefault.bind(context);
  const zodType = getMostInnerZodType(context);
  const argOptions = {
    type: zodType === "boolean" || zodType === "array:boolean" ? "boolean" : "string",
    multiple: zodType.startsWith("array:"),
  };
  if (options.arg.short !== undefined) {
    argOptions.short = options.arg.short;
  }
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      [options.arg.long]: argOptions,
    },
    allowPositionals: true,
    strict: false,
  });
  const value = (() => {
    if (options.arg?.positional && positionals.length !== 0) {
      return positionals;
    }
    return values[options.arg.long];
  })();
  if (value != undefined) {
    switch (zodType) {
      case "string":
      case "literal":
      case `union:literal`:
        if (Array.isArray(value)) {
          return fn(value[0]);
        }
        return fn(value);
      case "number":
        if (Array.isArray(value)) {
          return fn(Number(value[0]));
        }
        return fn(Number(value));
      case "boolean":
        if (Array.isArray(value)) {
          return fn(value[0]);
        }
        return fn(value);
      case `array:string`:
      case `array:literal`:
        if (Array.isArray(value)) {
          return fn(value);
        }
        if (typeof value === "string") {
          return fn(value.split(","));
        }
        return fn(undefined);
      case `array:number`:
        if (Array.isArray(value) && value.every((v) => !Number.isNaN(Number(v)))) {
          return fn(value.map(Number));
        }
        if (typeof value === "string") {
          return fn(value.split(",").map(Number));
        }
        return fn(undefined);
      case `array:boolean`:
        return fn(value);
      default:
        throw new Error(`Not implemented yet for this type ${zodType}`);
    }
  }
  return null;
};
const getEnv = (context, options) => {
  if (options === undefined || options.env === undefined) {
    return null;
  }
  const fn = oldDefault.bind(context);
  const value = process.env[options.env];
  if (value !== undefined) {
    const zodType = getMostInnerZodType(context);
    switch (zodType) {
      case "string":
      case `union:literal`:
      case "literal":
        return fn(value);
      case "number":
        return fn(Number(value));
      case "boolean":
        return fn(value === "true");
      case `array:string`:
        return fn(value.split(","));
      case `array:number`:
        return fn(value.split(",").map(Number));
      case `array:boolean`:
        return fn(value.split(",").map((v) => v === "true"));
      default:
        throw new Error(`Not implemented yet for this type ${zodType}`);
    }
  }
  return null;
};
/** @ts-expect-error - Patching */ ZodType.prototype.default = function (def, options) {
  const fn = oldDefault.bind(this);
  return getArgv(this, options) || getEnv(this, options) || fn(def);
};

const internalStateSchema = z
  .union([
    z.literal("running"),
    z.literal("waiting"),
    z.literal("waiting_for_dependency"),
    z.literal("finished"),
    z.literal("failed"),
  ])
  .default("waiting");
const taskSchema = z.array(z.symbol()).default([]);
const loaderStateSchema = z
  .union([z.literal("initializing"), z.literal("starting"), z.literal("running"), z.literal("finished")])
  .default("initializing");
const internalStateStoreSchema = z.object({
  name: z.string().default("Unnamed"),
  state: internalStateSchema,
});
function createInternalState() {
  return createZodStore({
    state: internalStateSchema,
    name: z.string().default("Unnamed"),
  });
}
function createState() {
  return createZodStore({
    symbolsOfTasksCompleted: taskSchema,
    symbolsOfTasksFailed: taskSchema,
    symbolsOfTasks: taskSchema,
    state: loaderStateSchema,
  });
}

function isErr(e) {
  return e instanceof Error$1;
}
function unknownToString(e) {
  if (e instanceof DOMError) {
    return e.get();
  }
  if (isErr(e)) {
    return `${e.message}\n${e.stack || ""}`;
  } else if (typeof e === "string") {
    return e;
  } else if (typeof e === "number" || typeof e === "boolean" || e === null) {
    return String(e);
  } else if (typeof e === "undefined") {
    return "Unknown Error";
  } else if (typeof e === "object") {
    if ("message" in e) {
      return JSON.stringify(e.message);
    }
    return JSON.stringify(e);
  } else if (e == null) {
    return "Unknown error";
  }
  return JSON.stringify(e);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const throwJSXError = (context, config, errorMSG, shouldRender = true) => {
  const { stack } = context;
  const { appName } = config;
  const jsxSTACK = stack.map((e, index) =>
    /*#__PURE__*/ React__default.createElement(
      Error$1,
      {
        key: index,
      },
      e,
    ),
  );
  const jsx = /*#__PURE__*/ React__default.createElement(
    Container,
    null,
    /*#__PURE__*/ React__default.createElement(Error$1, null, "Error in context: ", appName),
    jsxSTACK,
    /*#__PURE__*/ React__default.createElement(Error$1, null, unknownToString(errorMSG)),
  );
  if (shouldRender) {
    void render(() => jsx, true);
  }
  throw new DOMError(jsx);
};

const createPipesContextCommand = ({ value = undefined, output = z.void(), implement }) => {
  // Skip validating context and config
  const configSchema = z.custom();
  const contextSchema = z.custom();
  const _fn = (__fn) => {
    if (value === undefined) {
      return z
        .function()
        .args(contextSchema.describe("Context"), configSchema.describe("Config"))
        .returns(output)
        .implement(__fn);
    }
    return z
      .function()
      .args(contextSchema.describe("Context"), configSchema.describe("Config"), value)
      .returns(output)
      .implement(__fn);
  };
  const __fn = _fn(implement);
  const fn = (...args) => {
    try {
      return fn._fn(...args);
    } catch (e) {
      // args[0] is context
      // args[1] is config
      throwJSXError(args[0], args[1], e);
    }
  };
  const wrapper = (newFn) => _fn(newFn);
  fn._wrapper = wrapper;
  fn._implement = _fn;
  fn._fn = __fn;
  fn._isPipesCommand = true;
  return fn;
};

function createModuleName(name) {
  return name;
}
function createConfig(fn) {
  return fn;
}
function createContext(fn) {
  return fn;
}
const _createModule = ({ name, config, context, required = [], optional = [] }) => {
  const fn = (props) => createPipesContextCommand(props);
  return {
    name,
    config: config({
      z,
    }),
    context: context({
      z,
      fn,
    }),
    required: required.map((e) => createModuleName(e)),
    optional: optional.map((e) => createModuleName(e)),
  };
};
// NOTICE: We reintroduce alot of typing here so modules can be safely isolated.
function createModule(param) {
  return _createModule(param);
}

const PipesCoreConfig = createConfig(({ z }) => ({
  appName: z.string().default("pipes").describe("The name of the context"),
  env: z
    .union([z.literal("github"), z.literal("gitlab"), z.literal("local")])
    .default(() => {
      if (ciinfo.GITLAB) {
        return "gitlab";
      }
      if (ciinfo.GITHUB_ACTIONS) {
        return "github";
      }
      return "local";
    })
    .describe("The environment the code is running in"),
  isCI: z
    .boolean()
    .default(ciinfo.isCI, {
      env: "ci",
      arg: {
        long: "isCI",
        short: "c",
      },
    })
    .describe("Is the current environment a CI environment"),
  isPR: z
    .boolean()
    .default(ciinfo.isPR || false)
    .describe("Is the current environment a PR environment"),
}));
const PipesCoreContext = createContext(({ z, fn }) => ({
  startTime: z.date().default(new Date()),
  getDurationInMs: fn({
    output: z.number(),
    implement: (context) => {
      const currentTime = new Date();
      return currentTime.getTime() - context.startTime.getTime();
    },
  }),
  haltAll: fn({
    implement: () => {},
  }),
  addEnv: fn({
    output: z.custom(),
    value: z.object({
      container: z.custom(),
      env: z.array(z.tuple([z.string(), z.string()])),
    }),
    implement: (_context, _config, { container, env }) => {
      let newContainer = container;
      for (const [key, value] of env) {
        newContainer = newContainer.withEnvVariable(key, value);
      }
      return newContainer;
    },
  }),
  modules: z.array(z.string()).default([]).describe("The modules to load"),
  stack: z.array(z.string()).default([]).describe("The caller stack"),
  imageStore: z.custom(() => {
    return createGlobalZodKeyStore(
      z.custom((val) => {
        if (val instanceof Container$1) {
          return val;
        }
        throw new Error("Invalid value");
      }),
      "PIPES-IMAGE-STORE",
    );
  }),
  client: z.custom((val) => {
    if (val instanceof Client) {
      return val;
    }
    throw new Error("Provided client is not an instance of the expected Client class.");
  }),
  hasModule: fn({
    output: z.boolean(),
    value: z.string(),
    implement: (context, _config, value) => {
      return context.modules.includes(value);
    },
  }),
}));
const PipesCore = createModule({
  name: "PipesCore",
  config: PipesCoreConfig,
  context: PipesCoreContext,
});

/**
 * Represents the core class for contexts and modules.
 * @class
 */ class PipesCoreClass {
  /**
   * A private array to store scripts.
   * @private
   */ #scripts = [];
  #symbol;
  get symbol() {
    return this.#symbol;
  }
  #dependencies = new Set();
  addDependency(value) {
    if (value instanceof PipesCoreClass) {
      this.#dependencies.add(value.symbol);
      return this;
    }
    this.#dependencies.add(value);
    return this;
  }
  removeDependency(value) {
    if (value instanceof PipesCoreClass) {
      this.#dependencies.delete(value.symbol);
      return this;
    }
    this.#dependencies.add(value);
    return this;
  }
  /**
   * Adds a new script to the core.
   */ addScript(fn) {
    const _fn = async (context, config) => {
      try {
        await fn(context, config);
      } catch (e) {
        throwJSXError(context, config, e);
      }
    };
    this.#scripts.push(_fn);
    return this;
  }
  #haltAll = () => {};
  set haltAll(value) {
    this.#haltAll = value;
  }
  get haltAll() {
    return this.#haltAll;
  }
  /**
   * Private state management related to the readiness and modules of the core.
   */ #internalStatesStore = {
    modules: ["PipesCoreModule"],
    isReady: {
      state: "NOT_READY",
      reason: "Dagger Client has not been injected",
    },
  };
  #internalStates = new Proxy(this.#internalStatesStore, {
    set: (target, prop, value) => {
      if (prop === "client") {
        if (value && value instanceof Client) {
          target.client = value;
          target.isReady.state = "READY";
          delete target.isReady.reason;
          return true;
        } else {
          delete target.client;
          target.isReady.state = "NOT_READY";
          target.isReady.reason = "Dagger Client has not been injected";
        }
        return true;
      }
      return false;
    },
  });
  // Private Zod schemas to parse configurations and contexts.
  #configSchema;
  #contextSchema;
  // Public instances for config and context.
  config;
  context;
  constructor({ modules, schemas: { config, context } }) {
    this.#internalStatesStore.modules = modules;
    this.#symbol = Symbol();
    this.#configSchema = config;
    this.#contextSchema = context;
    this.config = createZodStore(this.#configSchema);
    this.context = createZodStore(this.#contextSchema, [
      {
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ key: "imageStore",
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ get: () => {
          return createGlobalZodKeyStore(
            z.custom((val) => {
              if (val instanceof Container$1) {
                return val;
              }
              console.log(val);
              throwJSXError(this.context, this.config, "Incorrect container");
            }),
            "PIPES-IMAGE-STORE",
          );
        },
      },
      {
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ key: "haltAll",
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ get: () => {
          try {
            return this.haltAll;
          } catch (e) {
            throwJSXError(this.context, this.config, e);
          }
        },
      },
      {
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ key: "client",
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ get: () => {
          try {
            return this.client;
          } catch (e) {
            throwJSXError(this.context, this.config, e);
          }
        },
      },
      {
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ key: "modules",
        /** @ts-expect-error - For simplification this is not hardcoded into the generic. */ get: () => {
          try {
            return this.modules;
          } catch (e) {
            throwJSXError(this.context, this.config, e);
          }
        },
      },
    ]);
  }
  // Public getter to check if the core is ready.
  get isReady() {
    return this.#internalStates.isReady.state === "READY";
  }
  // Public getter to fetch the current modules.
  get modules() {
    return this.#internalStates.modules;
  }
  /**
   * Method to check if a specific module is present.
   */ hasModule(moduleName) {
    return this.modules.includes(moduleName);
  }
  /**
   * Method to add a new module to the core.
   */ addModule(module) {
    if (this.isReady) {
      throw new Error(`Cannot add module when in ready state`);
    }
    const requiredModules = module.required ?? [];
    for (const requiredModule of requiredModules) {
      if (!this.hasModule(requiredModule)) {
        throw new Error(`Missing required module ${requiredModule}`);
      }
    }
    const newConfigSchema = {
      ...this.#configSchema,
      ...module.config,
    };
    const newContextSchema = {
      ...this.#contextSchema,
      ...module.context,
    };
    const modules = [...this.modules, module.name];
    return new PipesCoreClass({
      modules,
      schemas: {
        config: newConfigSchema,
        context: newContextSchema,
      },
    });
  }
  // Setter/getter for client
  set client(client) {
    this.#internalStates.client = client;
  }
  get client() {
    if (!this.isReady) {
      throw new Error("Client not ready");
    }
    return this.#internalStates.client;
  }
  // Method to run all the scripts stored in the core.
  async run(state = createState(), internalState = createInternalState()) {
    if (this.#internalStates.isReady.state === "NOT_READY") {
      throw new Error(this.#internalStates.isReady.reason);
    }
    internalState.name = this.config.appName;
    this.context.startTime = new Date();
    await when(() => {
      if (state.state !== "running") {
        return false;
      }
      if (state.state === "running") {
        const hasNotDep = Array.from(this.#dependencies).some((item) => !state.symbolsOfTasks.includes(item));
        if (hasNotDep) {
          return true;
        }
      }
      if (this.#dependencies.size === 0) {
        return true;
      }
      internalState.state = "waiting_for_dependency";
      for (const dep of this.#dependencies) {
        if (!state.symbolsOfTasksCompleted.includes(dep) && !state.symbolsOfTasksFailed.includes(dep)) {
          return false;
        }
      }
      return true;
    });
    const hasNot = Array.from(this.#dependencies).some((item) => !state.symbolsOfTasks.includes(item));
    if (hasNot) {
      internalState.state = "failed";
      throw new Error("A dependency was not included in runner");
    }
    const hasFailedDeps = !!state.symbolsOfTasksFailed.some((item) => this.#dependencies.has(item));
    if (hasFailedDeps) {
      internalState.state = "failed";
      throw new Error("A dependency has failed");
    }
    internalState.state = "running";
    const context = wrapContext(this.context, this.config);
    await Promise.all(
      this.#scripts.map(async (fn) => {
        const value = await fn(context, this.config);
        return value;
      }),
    ).catch((e) => {
      internalState.state = "failed";
      throw e;
    });
    internalState.state = "finished";
  }
}
/**
 * Factory function to create a new instance of the `PipesCoreClass`.
 */ const createPipesCore = () => {
  const core = new PipesCoreClass({
    modules: [PipesCore.name],
    schemas: {
      config: PipesCore.config,
      context: PipesCore.context,
    },
  });
  return core;
};
/**
 * Type guard that checks if context has module
 */ const ContextHasModule = (context, key) => {
  return !!(context && typeof context === "object" && key in context);
};
/**
 * Type guard that checks if config has module
 */ const ConfigHasModule = (config, key) => {
  return !!(config && typeof config === "object" && key in config);
};

const PipesConfig = {
  isDev: z
    .boolean()
    .default(ciinfo.isCI, {
      env: "IS_DEV",
      arg: {
        long: "show-dev-logs",
      },
    })
    .parse(undefined),
};

class PipesStream extends Writable {
  dataChunks;
  constructor(options) {
    super(options);
    // Initialize an array to store data chunks
    this.dataChunks = [];
  }
  _write(chunk, encoding, callback) {
    const utf8String = chunk.toString("utf8");
    this.dataChunks.push(utf8String);
    callback();
  }
  getData() {
    return this.dataChunks;
  }
}

function onCleanup(callback) {
  let called = false;
  const executeCallback = () => {
    if (!called) {
      called = true;
      callback();
    }
  };
  const sigintHandler = () => {
    executeCallback();
    process.exit(2);
  };
  const sigusr1Handler = () => {
    executeCallback();
    process.exit(3);
  };
  const sigusr2Handler = () => {
    executeCallback();
    process.exit(4);
  };
  const uncaughtExceptionHandler = (err) => {
    // eslint-disable-next-line no-console
    console.error("Uncaught exception:", err);
    executeCallback();
    process.exit(99);
  };
  process.on("exit", executeCallback);
  process.on("SIGINT", sigintHandler);
  process.on("SIGUSR1", sigusr1Handler);
  process.on("SIGUSR2", sigusr2Handler);
  process.on("uncaughtException", uncaughtExceptionHandler);
  return (call = true) => {
    if (call) {
      callback();
    }
    process.removeListener("exit", executeCallback);
    process.removeListener("SIGINT", sigintHandler);
    process.removeListener("SIGUSR1", sigusr1Handler);
    process.removeListener("SIGUSR2", sigusr2Handler);
    process.removeListener("uncaughtException", uncaughtExceptionHandler);
  };
}

class PipesCoreRunner {
  #context = new Set();
  addContext(value) {
    this.#context.add(value);
    return () => {
      this.removeContext(value);
    };
  }
  removeContext(value) {
    this.#context.delete(value);
  }
  async run() {
    const pipesStream = new PipesStream();
    const tasks = createBasicZodStore(taskSchema);
    const store = createState();
    const taskState = createZodSymbolStore(internalStateStoreSchema);
    const daggerState = createBasicZodStore(
      z
        .union([
          z.literal("Connecting"),
          z.literal("Connected"),
          z.literal("Finished"),
          z.object({
            type: z.literal("Failed"),
            error: z.any(),
          }),
        ])
        .default("Connecting"),
    );
    await render(() => {
      return /*#__PURE__*/ React__default.createElement(
        Group,
        {
          title: "Dagger state",
        },
        /*#__PURE__*/ React__default.createElement(
          Container,
          null,
          ((daggerState) => {
            if (daggerState.value === "Connecting") {
              return /*#__PURE__*/ React__default.createElement(Log, null, "Connecting to Dagger");
            }
            if (daggerState.value === "Connected") {
              return /*#__PURE__*/ React__default.createElement(Info, null, "Connected to Dagger");
            }
            if (daggerState.value === "Finished") {
              return /*#__PURE__*/ React__default.createElement(Success, null, "Dagger Finished");
            }
            if (typeof daggerState.value === "object" && daggerState.value.type === "Failed") {
              return /*#__PURE__*/ React__default.createElement(Error$1, null, daggerState.value.error);
            }
          })(daggerState),
        ),
      );
    });
    await connect(
      async (client) => {
        daggerState.value = "Connected";
        await render(async () => {
          const currentTasks = [...tasks.value];
          const obj = [];
          const values = await taskState.getAll();
          for (const task of currentTasks) {
            const value = values[task];
            if (value) {
              obj.push(value);
            }
          }
          const getState = (state) =>
            state.split("_").reduce((a, b, index) => {
              if (index === 0) {
                return b
                  .split("")
                  .map((e, index) => {
                    return index === 0 ? e.toUpperCase() : e;
                  })
                  .join("");
              }
              return `${a} ${b}`;
            }, "");
          const tableValues = obj.map((e) => ({
            Name: e.name,
            State: getState(e.state),
          }));
          if (tableValues.length === 0) {
            return /*#__PURE__*/ React__default.createElement(React__default.Fragment, null);
          }
          return /*#__PURE__*/ React__default.createElement(
            React__default.Fragment,
            null,
            /*#__PURE__*/ React__default.createElement(
              Group,
              {
                title: "Pipes tasks changes",
              },
              /*#__PURE__*/ React__default.createElement(
                Container,
                null,
                /*#__PURE__*/ React__default.createElement(Table, {
                  data: tableValues,
                }),
              ),
            ),
          );
        });
        const _haltObj = {};
        const halt = () => {
          if (_haltObj.halt) {
            void _haltObj.halt("Forced quit");
            // Give clean-up time force quit if not
            setTimeout(() => {
              process.exit(1);
            }, 5000);
          } else {
            process.exit(1);
          }
        };
        const fakePromise = new Promise((_resolve, reject) => {
          _haltObj.halt = reject;
        });
        for (const context of this.#context) {
          context.client = client;
          context.haltAll = halt;
        }
        const contextPromises = Promise.all(
          Array.from(this.#context).map(async (value) => {
            const internalState = createInternalState();
            tasks.value = [...tasks.value, value.symbol];
            store.symbolsOfTasks = [...store.symbolsOfTasks, value.symbol];
            reaction(
              () => {
                return {
                  name: internalState.name,
                  state: internalState.state,
                };
              },
              async () => {
                const name = internalState.name;
                const state = internalState.state;
                await taskState.setKey(value.symbol, {
                  name,
                  state,
                });
              },
            );
            void when(() => internalState.state === "finished" || internalState.state === "failed").then(() => {
              if (internalState.state === "finished") {
                store.symbolsOfTasksCompleted = [...store.symbolsOfTasksCompleted, value.symbol];
                return;
              }
              if (internalState.state === "failed") {
                store.symbolsOfTasksFailed = [...store.symbolsOfTasksFailed, value.symbol];
              }
            });
            await value.run(store, internalState).catch(async (e) => {
              internalState.state = "failed";
              if (e instanceof DOMError) {
                await render(e.get);
              }
              halt();
            });
          }),
        );
        store.state = "running";
        await Promise.race([fakePromise, contextPromises]);
      },
      {
        LogOutput: pipesStream,
      },
    )
      .catch((e) => {
        daggerState.value = {
          type: "Failed",
          error: e,
        };
      })
      .then(() => {
        if (daggerState.value === "Connected") {
          daggerState.value = "Finished";
        }
      })
      .finally(async () => {
        if (PipesConfig.isDev) {
          const value = pipesStream.getData();
          await render(
            () =>
              /*#__PURE__*/ React__default.createElement(
                Group,
                {
                  title: "Raw Dagger log",
                },
                /*#__PURE__*/ React__default.createElement(Text, null, value),
              ),
            true,
          );
        }
        if (daggerState.value === "Finished") {
          process.exit(0);
        }
        setTimeout(() => {
          // Give time render and jobs to quit safely.
          process.exit(1);
        }, 500);
      });
  }
}
const createPipe = async (
  // eslint-disable-next-line no-shadow
  fn,
) => {
  const core = new PipesCoreRunner();
  const values = await fn({
    z,
    createPipesCore,
    createConfig,
    createContext,
    createModule,
    contextHasModule: ContextHasModule,
    configHasModule: ConfigHasModule,
  });
  for (const value of values) {
    // If we define this better we get circular errors…
    core.addContext(value);
  }
  await core.run();
};

export {
  PipesCoreRunner,
  dom as PipesDOM,
  createConfig,
  createContext,
  createGlobalZodKeyStore,
  createGlobalZodStore,
  createModule,
  createPipe,
  createZodKeyStore,
  createZodStore,
  onCleanup,
  render,
};
//# sourceMappingURL=pipes-core.js.map
