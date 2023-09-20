import * as React from "react";
import React__default, { ReactNode } from "react";
import { ForegroundColorName } from "chalk";
import { LiteralUnion, Except } from "type-fest";
import { Boxes, BoxStyle } from "cli-boxes";
import { Node } from "yoga-wasm-web/dist/node.js";
import { Client, Container as Container$1 } from "@dagger.io/dagger";
export * from "@dagger.io/dagger";
import { If } from "ts-toolbelt/out/Any/If.d.ts";
import { Is } from "ts-toolbelt/out/Any/Is.d.ts";
import { Length } from "ts-toolbelt/out/List/Length.d.ts";
import { List as List$1 } from "ts-toolbelt/out/List/List.d.ts";
import { Exclude as Exclude$1 } from "ts-toolbelt/out/Union/Exclude.d.ts";
import { ListOf } from "ts-toolbelt/out/Union/ListOf.d.ts";
import {
  ZodType,
  z,
  util,
  ZodDefault,
  ZodNull,
  ZodBoolean,
  ZodLiteral,
  ZodTuple,
  ZodArray,
  ZodDate,
  ZodString,
  ZodNumber,
  ZodVoid,
  ZodObject,
  ZodTypeAny,
  ZodLazy,
  ZodOptional,
  ZodUnion,
} from "zod";
export { z } from "zod";
import { IsLiteral } from "ts-toolbelt/out/Community/IsLiteral.d.ts";

interface Render {
  stop: () => Promise<void>;
  value: () => string;
}
type RenderValue = ReactNode;
type ValueOrPromise<T> = T | Promise<T>;
type FnOrValue<T> = T | (() => T);
type RenderValueParam = FnOrValue<ValueOrPromise<RenderValue>>;
declare const render: (node: RenderValueParam, toString?: boolean) => Promise<Render>;

type OutputTransformer = (s: string, index: number) => string;

type Styles = {
  readonly textWrap?: "wrap" | "end" | "middle" | "truncate-end" | "truncate" | "truncate-middle" | "truncate-start";
  readonly position?: "absolute" | "relative";
  readonly columnGap?: number;
  readonly rowGap?: number;
  readonly gap?: number;
  readonly margin?: number;
  readonly marginX?: number;
  readonly marginY?: number;
  readonly marginTop?: number;
  readonly marginBottom?: number;
  readonly marginLeft?: number;
  readonly marginRight?: number;
  readonly padding?: number;
  readonly paddingX?: number;
  readonly paddingY?: number;
  readonly paddingTop?: number;
  readonly paddingBottom?: number;
  readonly paddingLeft?: number;
  readonly paddingRight?: number;
  readonly flexGrow?: number;
  readonly flexShrink?: number;
  readonly flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  readonly flexBasis?: number | string;
  readonly flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  readonly alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  readonly alignSelf?: "flex-start" | "center" | "flex-end" | "auto";
  readonly justifyContent?: "flex-start" | "flex-end" | "space-between" | "space-around" | "center";
  readonly width?: number | string;
  readonly height?: number | string;
  readonly minWidth?: number | string;
  readonly minHeight?: number | string;
  readonly display?: "flex" | "none";
  readonly borderStyle?: keyof Boxes | BoxStyle;
  readonly borderTop?: boolean;
  readonly borderBottom?: boolean;
  readonly borderLeft?: boolean;
  readonly borderRight?: boolean;
  readonly borderColor?: LiteralUnion<ForegroundColorName, string>;
  readonly borderTopColor?: LiteralUnion<ForegroundColorName, string>;
  readonly borderBottomColor?: LiteralUnion<ForegroundColorName, string>;
  readonly borderLeftColor?: LiteralUnion<ForegroundColorName, string>;
  readonly borderRightColor?: LiteralUnion<ForegroundColorName, string>;
  readonly borderDimColor?: boolean;
  readonly borderTopDimColor?: boolean;
  readonly borderBottomDimColor?: boolean;
  readonly borderLeftDimColor?: boolean;
  readonly borderRightDimColor?: boolean;
  readonly overflow?: "visible" | "hidden";
  readonly overflowX?: "visible" | "hidden";
  readonly overflowY?: "visible" | "hidden";
};

type InkNode = {
  parentNode: DOMElement | undefined;
  yogaNode?: Node;
  internal_static?: boolean;
  style: Styles;
};
type TextName = "#text";
type ElementNames = "ink-root" | "ink-box" | "ink-text" | "ink-virtual-text";
type NodeNames = ElementNames | TextName;
type DOMElement = {
  nodeName: ElementNames;
  attributes: Record<string, DOMNodeAttribute>;
  childNodes: DOMNode[];
  internal_transform?: OutputTransformer;
  isStaticDirty?: boolean;
  staticNode?: DOMElement;
  onComputeLayout?: () => void;
  onRender?: () => void;
  onImmediateRender?: () => void;
} & InkNode;
type TextNode = {
  nodeName: TextName;
  nodeValue: string;
} & InkNode;
type DOMNode<
  T = {
    nodeName: NodeNames;
  },
> = T extends {
  nodeName: infer U;
}
  ? U extends "#text"
    ? TextNode
    : DOMElement
  : never;
type DOMNodeAttribute = boolean | string | number;

type Props$1 = Except<Styles, "textWrap">;
declare const Box: React__default.ForwardRefExoticComponent<
  Props$1 & {
    children?: React__default.ReactNode;
  } & React__default.RefAttributes<DOMElement>
>;

type Props = {
  readonly color?: LiteralUnion<ForegroundColorName, string>;
  readonly backgroundColor?: LiteralUnion<ForegroundColorName, string>;
  readonly dimColor?: boolean;
  readonly bold?: boolean;
  readonly italic?: boolean;
  readonly underline?: boolean;
  readonly strikethrough?: boolean;
  readonly inverse?: boolean;
  readonly wrap?: Styles["textWrap"];
  readonly children?: ReactNode;
};
declare function Text({
  color,
  backgroundColor,
  dimColor,
  bold,
  italic,
  underline,
  strikethrough,
  inverse,
  wrap,
  children,
}: Props): JSX.Element | null;

declare const haltAllRender: () => void;

type Simplify$1<T> = {
  [KeyType in keyof T]: T[KeyType];
} & {};

type AnyElement = ReactNode;
type SpecifixJSX<
  type extends string,
  props extends Record<string, any> | null,
  children extends ReactNode | ReactNode[] | undefined,
> = Simplify$1<
  props extends null
    ? {
        type: type;
      } & {
        children: children;
      }
    : {
        type: type;
      } & props & {
          children: children;
        }
>;

type Color$3 = Parameters<typeof Text>[0]["color"];
type BackgroundColor = Parameters<typeof Text>[0]["color"];
type IBadge = SpecifixJSX<
  "Badge",
  {
    color?: Color$3;
    backgroundColor?: BackgroundColor;
    display?: "ansi" | "markdown" | undefined;
  },
  string
>;
declare const Badge: (props: Omit<IBadge, "type">) => React.ReactNode;

type Color$2 = Parameters<typeof Box>["0"]["borderColor"];
type IContainer = SpecifixJSX<
  "Container",
  {
    color?: Color$2;
    padding?: number;
  },
  ReactNode | ReactNode[] | null | string
>;
declare const Container: (props: Omit<IContainer, "type">) => ReactNode;

type DialogType = "default" | "error" | "success" | "failure";
type DialogProps = {
  dialogType?: DialogType;
  children?: ReactNode | ReactNode[];
  title: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
};
type IDialog = {
  type: "Dialog";
} & DialogProps;
declare const Dialog: (props: Omit<IDialog, "type">) => ReactNode;

type IDivider = {
  type: "Divider";
};
declare const Divider: (_props: Omit<IDivider, "type">) => ReactNode;

interface IError {
  type: "Error";
  title?: string | undefined | null;
  children?: ReactNode | ReactNode[];
}
declare const Error$1: (props: Omit<IError, "type">) => ReactNode;

type IFailure = SpecifixJSX<
  "Failure",
  {
    title?: string;
  },
  ReactNode | ReactNode[]
>;
declare const Failure: (props: Omit<IFailure, "type">) => ReactNode;

type IGroup = SpecifixJSX<
  "Group",
  {
    title: string;
  },
  any | any[]
>;
declare const Group: (props: Omit<IGroup, "type">) => ReactNode;

type IInfo = SpecifixJSX<
  "Info",
  {
    title?: string;
  },
  ReactNode | ReactNode[]
>;
declare const Info: (props: Omit<IInfo, "type">) => ReactNode;

declare const Link: ({ url, children }: { children: string; url: string }) => React__default.ReactNode;

type IList = SpecifixJSX<"List", null, AnyElement[] | AnyElement | null>;
type IListItem = SpecifixJSX<"ListItem", null, AnyElement>;
declare const List: (props: Omit<IList, "type">) => ReactNode;
declare const ListItem: (props: Omit<IListItem, "type">) => ReactNode;

type ILog = SpecifixJSX<"Log", null, string>;
declare const Log: (props: Omit<ILog, "type">) => ReactNode;

type IMask = {
  type: "Mask";
  values: string[] | string;
};
declare const Mask: (props: Omit<IMask, "type">) => ReactNode;

type Color$1 = Parameters<typeof Box>[0]["borderColor"];
type Width = Parameters<typeof Box>[0]["width"];
type IRow = SpecifixJSX<
  "Row",
  {
    color?: Color$1;
    width?: (Width | undefined)[] | undefined;
    display?: "ansi" | "markdown";
  },
  ReactNode | ReactNode[] | undefined
>;
declare const Row: (props: Omit<IRow, "type">) => ReactNode;

type Color = Parameters<typeof Container>[0]["color"];
type ISubtitle = SpecifixJSX<
  "Subtitle",
  {
    emoji?: string;
    color?: Color;
    display?: "ansi" | "markdown" | undefined;
  },
  string
>;
declare const Subtitle: (props: Omit<ISubtitle, "type">) => ReactNode;

type ISuccess = SpecifixJSX<
  "Success",
  {
    title?: string;
  },
  ReactNode | ReactNode[]
>;
declare const Success: (props: Omit<ISuccess, "type">) => ReactNode;

type ITimestamp = {
  type: "Timestamp";
  time?: Date | string | number;
  format?: "ISO" | "American" | "European" | string;
};
declare const Timestamp: (props: Omit<ITimestamp, "type">) => ReactNode;

type ITitle = SpecifixJSX<"Title", null, string>;
declare const Title: (props: Omit<ITitle, "type">) => ReactNode;

type Scalar = string | number | boolean | null | undefined;
type ScalarDict = {
  [key: string]: Scalar;
};
type CellProps = React__default.PropsWithChildren<{
  column: number;
}>;
type TableProps<T extends ScalarDict> = {
  data: T[];
  columns: (keyof T)[];
  padding: number;
  header: (props: React__default.PropsWithChildren<{}>) => JSX.Element;
  cell: (props: CellProps) => JSX.Element;
  skeleton: (props: React__default.PropsWithChildren<{}>) => JSX.Element;
};
declare class Table<T extends ScalarDict> extends React__default.Component<
  Pick<TableProps<T>, "data"> & Partial<TableProps<T>>
> {
  getConfig(): TableProps<T>;
  getDataKeys(): (keyof T)[];
  getColumns(): Column<T>[];
  getHeadings(): Partial<T>;
  header: (props: RowProps<T>) => JSX.Element;
  heading: (props: RowProps<T>) => JSX.Element;
  separator: (props: RowProps<T>) => JSX.Element;
  data: (props: RowProps<T>) => JSX.Element;
  footer: (props: RowProps<T>) => JSX.Element;
  render(): JSX.Element;
}
type RowProps<T extends ScalarDict> = {
  key: string;
  data: Partial<T>;
  columns: Column<T>[];
};
type Column<T> = {
  key: string;
  column: keyof T;
  width: number;
};

declare class DOMError extends Error {
  #private;
  constructor(pipeComponent: ReactNode);
  get: () => ReactNode;
  toString: () => Promise<string>;
}

declare const dom_Badge: typeof Badge;
declare const dom_Container: typeof Container;
type dom_DOMError = DOMError;
declare const dom_DOMError: typeof DOMError;
declare const dom_Dialog: typeof Dialog;
declare const dom_Divider: typeof Divider;
declare const dom_Failure: typeof Failure;
declare const dom_Group: typeof Group;
declare const dom_Info: typeof Info;
declare const dom_Link: typeof Link;
declare const dom_List: typeof List;
declare const dom_ListItem: typeof ListItem;
declare const dom_Log: typeof Log;
declare const dom_Mask: typeof Mask;
declare const dom_Row: typeof Row;
declare const dom_Subtitle: typeof Subtitle;
declare const dom_Success: typeof Success;
type dom_Table<T extends ScalarDict> = Table<T>;
declare const dom_Table: typeof Table;
declare const dom_Text: typeof Text;
declare const dom_Timestamp: typeof Timestamp;
declare const dom_Title: typeof Title;
declare const dom_haltAllRender: typeof haltAllRender;
declare const dom_render: typeof render;
declare namespace dom {
  export {
    dom_Badge as Badge,
    dom_Container as Container,
    dom_DOMError as DOMError,
    dom_Dialog as Dialog,
    dom_Divider as Divider,
    Error$1 as Error,
    dom_Failure as Failure,
    dom_Group as Group,
    dom_Info as Info,
    dom_Link as Link,
    dom_List as List,
    dom_ListItem as ListItem,
    dom_Log as Log,
    dom_Mask as Mask,
    dom_Row as Row,
    dom_Subtitle as Subtitle,
    dom_Success as Success,
    dom_Table as Table,
    dom_Text as Text,
    dom_Timestamp as Timestamp,
    dom_Title as Title,
    dom_haltAllRender as haltAllRender,
    dom_render as render,
  };
}

type ExtendType<T extends Record<string, any>> = Record<string, any> & T;

type addParameters<fn extends (...args: any[]) => any, context, config> = fn extends (...args: infer P) => infer R
  ? (context: context, config: config, ...args: P) => R
  : never;

type ifIsNotZero<T extends number, If, Else> = 0 extends T ? Else : If;

type changeFunctionToPipes<fn extends (...args: any[]) => any> = fn extends (...args: infer P) => infer R
  ? {
      (...args: P): R;
    } & PipesContextCommandBase
  : never;

type isNestedKey<
  Module extends Record<string, any>,
  Key extends string,
  AddKey extends string = "",
> = Key extends keyof Module
  ? `${AddKey}${Key}`
  : Key extends `${infer First}.${infer Rest}`
  ? First extends keyof Module
    ? isNestedKey<Module[First], Rest, `${AddKey}${First}.`>
    : never
  : never;
type getNestedObject<
  Module extends Record<string, any>,
  Key extends string,
  AddKey extends string = "",
> = Key extends keyof Module
  ? Module[Key]
  : Key extends `${infer First}.${infer Rest}`
  ? First extends keyof Module
    ? getNestedObject<Module[First], Rest, `${AddKey}${First}.`>
    : never
  : never;

type Simplify<T> = {
  [KeyType in keyof T]: T[KeyType];
} & {};

type SubsetKeys<T, U extends T> = {
  [K in keyof U]: K extends keyof T ? T[K] : never;
};

type unionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type isTrueOnly<T> = [T] extends [true] ? true : false;
type isFalseOnly<T> = [T] extends [false] ? true : false;
type isTrueAndFalse<T, X = isTrueOnly<T>, Y = isFalseOnly<T>> = T extends boolean
  ? [X, Y] extends [false, false]
    ? true
    : false
  : false;

type combineNullUndefined<T> = T extends null | undefined ? null : T;

type ArrayItem<T extends any[]> = T[number];
type GenericArray<T extends any[]> = Array<ArrayItem<T>>;

type isAny<T> = If<Is<T, any, "equals">, 1, 0>;

type isEmptyList<
  T extends List$1<any>,
  X extends List$1<any> = Exclude$1<T, boolean>,
  XLength = Length<X>,
> = XLength extends 0 ? true : false;

type LiteralToArray<T> = ListOf<T>;
type hasManyItems<
  InitalType,
  T = combineNullUndefined<InitalType>,
  ListArray extends List$1<any> = LiteralToArray<T>,
  ListLength = Length<ListArray>,
  IsModuleName extends boolean = InitalType extends string & {
    __type: "modulename";
  }
    ? true
    : false,
  Bool = isEmptyList<LiteralToArray<Exclude$1<T, boolean>>>,
> = IsModuleName extends true ? false : Bool extends true ? false : ListLength extends 1 ? false : true;

type isTuple<T> = T extends [infer _X, ...infer _XS] ? true : false;

type StoreObj = Record<string, z.ZodType<any> | Function>;
interface Skip<T extends StoreObj, key extends keyof T = keyof T> {
  key: keyof T;
  get: () => T[key] extends z.ZodType<any> ? z.infer<T[key]> : T[key];
  set?: (value: T[key] extends z.ZodType<any> ? z.infer<T[key]> : T[key]) => boolean;
}
type Skips<T extends StoreObj> = Skip<T>[];
type DefaultOutput<T extends StoreObj> = {
  [K in keyof T]: T[K] extends z.ZodType<any> ? z.infer<T[K]> : T[K];
};
declare function createZodStore<T extends StoreObj = StoreObj, Output = DefaultOutput<T>>(
  obj: T,
  skip?: Skips<T>,
): Output;
declare const createZodKeyStore: <T extends ZodType<any, z.ZodTypeDef, any>>(
  type: T,
) => {
  getAll: () => Promise<Record<string, z.TypeOf<T>>>;
  awaitForAvailability(key: string): Promise<z.TypeOf<T>>;
  getKey(key: string): Promise<z.TypeOf<T> | null>;
  setKey(key: string, value: z.TypeOf<T>): Promise<void>;
  getOrSet(key: string, fn: () => z.TypeOf<T> | Promise<z.TypeOf<T>>): Promise<z.TypeOf<T>>;
};
declare const createGlobalZodStore: <T extends StoreObj>(obj: T, key: string) => Promise<DefaultOutput<T>>;
declare const createGlobalZodKeyStore: <T extends ZodType<any, z.ZodTypeDef, any>>(
  obj: T,
  key: string,
) => Promise<{
  getAll: () => Promise<Record<string, z.TypeOf<T>>>;
  awaitForAvailability(key: string): Promise<z.TypeOf<T>>;
  getKey(key: string): Promise<z.TypeOf<T> | null>;
  setKey(key: string, value: z.TypeOf<T>): Promise<void>;
  getOrSet(key: string, fn: () => z.TypeOf<T> | Promise<z.TypeOf<T>>): Promise<z.TypeOf<T>>;
}>;

interface DefaultProps {
  env?: string;
  variables?: string;
  arg?: {
    short?: string | undefined;
    long: string;
    positional?: boolean;
  };
}
declare module "zod" {
  interface ZodType<Output = any, Def extends z.ZodTypeDef = z.ZodTypeDef, Input = Output> {
    default(def?: util.noUndefined<Input>, options?: DefaultProps): ZodDefault<this>;
    default(def?: () => util.noUndefined<Input>, options?: DefaultProps): ZodDefault<this>;
  }
}

type ArrayToZod<T extends Readonly<any[]>> = {
  [K in keyof T]: valueToZod<T[K]>;
};
type ArrayToZodArray<
  U extends Readonly<List$1<any>>,
  AddUnion = 1,
  length extends number = Length<U>,
  head = U[0],
> = length extends 1
  ? valueToZod<head>
  : U extends [...infer R, null]
  ? ZodOptional<ArrayToZodArray<R>> | ZodDefault<ZodOptional<ArrayToZodArray<R>>>
  : U extends [null, ...infer R]
  ? ZodOptional<ArrayToZodArray<R>> | ZodDefault<ZodOptional<ArrayToZodArray<R>>>
  : AddUnion extends 1
  ? ZodDefault<ZodUnion<GenericArray<ArrayToZod<U>>>>
  : ZodType<U> | ArrayToZod<U>;
type ValueToZodArray<T, AddUnion = 1, U extends List$1<any> = ListOf<combineNullUndefined<T>>> = ArrayToZodArray<
  U,
  AddUnion
>;
type List2Tuple<L> = L extends [infer Head, ...infer Tail]
  ? [valueToZod<Head>, ...List2Tuple<Tail>]
  : L extends [infer Head]
  ? [valueToZod<Head>]
  : [];
type zodDefault<T extends ZodTypeAny> = ZodDefault<T> | T;
type zodLazy<T extends ZodTypeAny> = ZodLazy<T> | T;
type valueToZod<T> = {
  modulename: ZodType<ModuleName> | ZodDefault<ZodType<ModuleName>>;
  many: ValueToZodArray<T>;
  nullOrUndefined: zodDefault<ZodNull> | ZodNull;
  boolean: zodDefault<ZodBoolean> | ZodBoolean;
  true: zodDefault<ZodLiteral<true>> | ZodLiteral<true>;
  false: zodDefault<ZodLiteral<false>> | ZodLiteral<false>;
  literal: ZodLiteral<T>;
  tuple: T extends Array<infer _U> ? ZodTuple<List2Tuple<T>> : never;
  array: T extends Array<infer U> ? ZodArray<valueToZod<U>> | ZodDefault<ZodArray<valueToZod<U>>> : never;
  date: zodDefault<ZodDate> | ZodDate;
  string: zodDefault<ZodString> | ZodString;
  number: zodDefault<ZodNumber> | ZodNumber;
  void: ZodVoid;
  object:
    | ZodType<T>
    | zodLazy<
        | ZodObject<
            {
              [k in keyof T]: valueToZod<T[k]>;
            },
            "strip"
          >
        | ZodType<T>
      >
    | zodDefault<
        zodLazy<
          | ZodObject<
              {
                [k in keyof T]: valueToZod<T[k]>;
              },
              "strip"
            >
          | ZodType<T>
        >
      >;
  unknown: never;
}[zodKey<T>];
type zodKey<T> = true extends If<isAny<T>, true>
  ? "unknown"
  : true extends If<Is<T, never, "equals">, true>
  ? "unknown"
  : true extends hasManyItems<T>
  ? "many"
  : true extends If<Is<T, null | undefined, "extends->">, true>
  ? "nullOrUndefined"
  : true extends isTrueAndFalse<T>
  ? "boolean"
  : true extends isTrueOnly<T>
  ? "true"
  : true extends isFalseOnly<T>
  ? "false"
  : T extends string & {
      __type: "modulename";
    }
  ? "modulename"
  : true extends If<IsLiteral<T>, true>
  ? "literal"
  : T extends any[]
  ? isTuple<T> extends true
    ? "tuple"
    : "array"
  : true extends If<Is<T, Date, "equals">, true>
  ? "date"
  : true extends If<Is<T, string, "equals">, true>
  ? "string"
  : true extends If<Is<T, number, "equals">, true>
  ? "number"
  : true extends If<Is<T, void, "equals">, true>
  ? "void"
  : T extends {
      [k: string]: any;
    }
  ? "object"
  : "unknown";

type withoutNever<T> = {
  [P in keyof T as T[P] extends never ? never : P]: T[P];
};

type CreateModule<
  Name extends ModuleName,
  Definition,
  Config extends ModuleConfigValue<Config>,
  RequiredModules extends AnyModule[] = [],
  OptionalModules extends AnyModule[] = [],
  MergedInterface extends ModuleContextInterface<MergedInterface> = MergeOutsideInterface<
    Definition,
    RequiredModules,
    OptionalModules
  >,
  MergedConfig extends Config = MergeConfig<Config, RequiredModules, OptionalModules>,
  NewConfig extends AnyModuleConfig = ModuleConfig<
    Config,
    MergedConfig,
    getConfigImplementation<Config>,
    getConfigImplementation<MergedConfig>
  >,
  OutsideInterface extends ModuleOutsideInterface<MergedInterface> = getOutSideInterface<MergedInterface, MergedConfig>,
  MergedImplement = getImplementation<OutsideInterface, OutsideInterface>,
  Implementation extends SubsetKeys<OutsideInterface, Implementation> = getImplementation<OutsideInterface, Definition>,
  NewContext = ModuleContext<Definition, MergedInterface, OutsideInterface, Implementation, MergedImplement>,
> = Module<Name, Definition, NewConfig, NewContext, RequiredModules, OptionalModules>;
type newModuleName<T> = T;
type moduleNameToString<T> = T;
type ModuleConfigValue<T> = Record<keyof T, Exclude<any, Function>>;
type AnyModuleConfig = ModuleConfig<any, any, any, any>;
type ModuleConfig<
  Config extends ModuleConfigValue<Config>,
  MergedConfig extends Config = Config,
  Implement = Config,
  MergedImplement = Config,
> = {
  Merged: MergedConfig;
  MergedImplement: MergedImplement;
  Incoming: Config;
  Implement: Implement;
};
type ModuleContextInterface<T> = Record<keyof T, any>;
type ModuleOutsideInterface<ContextInterface extends ModuleContextInterface<ContextInterface>> = Record<
  keyof ContextInterface,
  any
>;
type ModuleContext<
  Incoming,
  ContextInterface extends ModuleContextInterface<ContextInterface> = Incoming,
  OutsideInterface extends ModuleOutsideInterface<ContextInterface> = ContextInterface,
  Implement extends SubsetKeys<ContextInterface, Implement> = ContextInterface,
  MergedImplement = OutsideInterface,
> = {
  Incoming: Incoming;
  ContextInterface: ContextInterface;
  OutsideInterface: OutsideInterface;
  Implement: Implement;
  MergedImplement: MergedImplement;
};
type ModuleName = string;
type AnyModule = Module<any, any, any, any, any, any>;
type Module<
  Name extends ModuleName,
  Definition,
  Config extends AnyModuleConfig,
  Context,
  RequiredModules extends AnyModule[] = [],
  OptionalModules extends AnyModule[] = [],
> = {
  ModuleName: Name;
  Config: Config;
  Context: Context;
  Definition: Definition;
  RequiredModules: RequiredModules;
  OptionalModules: OptionalModules;
};
type FunctionKeys<T> = {
  [K in keyof T]: string extends K ? never : T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
type NonFunctionKeys<T> = {
  [K in keyof T]: string extends K ? never : T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];
type ReplaceFunctionKeys<T, Context, Config> = {
  [K in FunctionKeys<T>]: T[K] extends (...args: any[]) => any
    ? changeFunctionToPipes<addParameters<T[K], Context, Config>>
    : never;
} & {
  [K in NonFunctionKeys<T>]: T[K] extends (...args: any[]) => any ? never : T[K];
};
type ReplaceImplementation<T> = {
  [K in NonFunctionKeys<T>]: string extends K
    ? never
    : T[K] extends (...args: any[]) => any
    ? never
    : valueToZod<T[K]> | T[K];
} & {
  [K in FunctionKeys<T>]: string extends K ? never : T[K] extends (...args: any[]) => any ? T[K] : never;
};
type ReplaceConfigImplementation<T> = {
  [K in NonFunctionKeys<T>]: T[K] extends (...args: any[]) => any ? never : valueToZod<T[K]> | T[K];
} & {
  [K in FunctionKeys<T>]: T[K] extends (...args: any[]) => any ? never : never;
};
type getConfigImplementation<T> = Simplify<withoutNever<ReplaceConfigImplementation<T>>>;
type getOutSideInterface<T extends ModuleContextInterface<T>, Config> = ReplaceFunctionKeys<
  T,
  T,
  Config
> extends ModuleOutsideInterface<T>
  ? ReplaceFunctionKeys<T, T, Config>
  : never;
type getImplementation<T extends ModuleContextInterface<T>, K extends SubsetKeys<T, K>> = withoutNever<
  ReplaceImplementation<SubsetKeys<T, K>>
>;
type MergeStateHelper<
  Definition extends string,
  NewState,
  PrevModules extends AnyModule[] = [],
  PossibleModules extends AnyModule[] = [],
> = Definition extends isNestedKey<AnyModule, Definition>
  ? Simplify<
      unionToIntersection<
        NewState &
          withoutNever<
            ifIsNotZero<
              PossibleModules["length"],
              ifIsNotZero<
                PrevModules["length"],
                Omit<
                  Partial<getNestedObject<PossibleModules[number], Definition>>,
                  keyof getNestedObject<PrevModules[number], Definition>
                >,
                Partial<getNestedObject<PossibleModules[number], Definition>>
              >,
              NewState
            > &
              ifIsNotZero<PrevModules["length"], getNestedObject<PrevModules[number], Definition>, NewState>
          >
      >
    >
  : never;
type MergeOutsideInterface<
  NewState,
  PrevModules extends AnyModule[] = [],
  PossibleModules extends AnyModule[] = [],
  MergedState = MergeStateHelper<"Definition", NewState, PrevModules, PossibleModules>,
> = MergedState extends ModuleOutsideInterface<NewState> ? MergedState : never;
type MergeConfig<
  NewState extends Record<string, any>,
  PrevModules extends AnyModule[] = [],
  PossibleModules extends AnyModule[] = [],
  MergedState = MergeStateHelper<"Config.Incoming", NewState, PrevModules, PossibleModules>,
> = MergedState extends NewState ? MergedState : never;
type MergeModules<
  PrevModules extends AnyModule[] = [],
  MergedConfig = PrevModules extends [infer X, ...infer R]
    ? X extends AnyModule
      ? R extends AnyModule[]
        ? MergeStateHelper<"Config.Incoming", X["Config"]["Incoming"], R, []>
        : never
      : never
    : PrevModules extends [infer X]
    ? X extends AnyModule
      ? MergeStateHelper<"Config.Incoming", X["Config"]["Incoming"], [], []>
      : never
    : never,
  MergedContext = PrevModules extends [infer X, ...infer R]
    ? X extends AnyModule
      ? R extends AnyModule[]
        ? MergeStateHelper<"Context.Incoming", X["Context"]["Incoming"], R, []>
        : never
      : never
    : PrevModules extends [infer X]
    ? X extends AnyModule
      ? MergeStateHelper<"Context.Incoming", X["Context"]["Incoming"], [], []>
      : never
    : never,
  Name extends newModuleName<"CurrentState"> = newModuleName<"CurrentState">,
> = CreateModule<Name, MergedContext, MergedConfig>;

declare const PipesContextCommandSymbol: unique symbol;
type PipesContextCommandImplementation<
  Context extends Record<string, any>,
  Config extends Record<string, any>,
  Value,
  Output,
> = Value extends undefined
  ? (context: ExtendType<Context>, config: ExtendType<Config>) => Output
  : (context: ExtendType<Context>, config: ExtendType<Config>, value: Value) => Output;
type PipesContextCommandBase = {
  _isPipesCommand: true;
  _fn: any;
  _wrapper: (fn: any) => any;
  _implement: any;
  [PipesContextCommandSymbol]?: never;
};
type PipesContextCommand<Module extends AnyModule, Value, Output> = PipesContextCommandBase &
  PipesContextCommandImplementation<Module["Context"]["ContextInterface"], Module["Config"]["Merged"], Value, Output>;

declare const createPipesContextCommand: <
  BaseModule extends Module<any, any, any, any, any, any>,
  Value = undefined,
  Output = undefined,
  _BaseContext extends ModuleContext<any, any, any> = BaseModule["Context"],
  BaseContext extends ModuleContextInterface<BaseContext> = _BaseContext["ContextInterface"],
  _BaseConfig extends ModuleConfig<any, any, any> = BaseModule["Config"],
  BaseConfig extends ModuleConfigValue<BaseConfig> = _BaseConfig["Merged"],
  ValueSchema extends valueToZod<Value> | undefined = undefined extends Value ? undefined : valueToZod<Value>,
  OutputSchema extends valueToZod<Output> = valueToZod<Output>,
>({
  value,
  output,
  implement,
}: {
  value?: ValueSchema | undefined;
  output?: OutputSchema | undefined;
  implement: (context: BaseContext, config: BaseConfig, _value: Value) => Output;
}) => PipesContextCommand<BaseModule, Value, Output>;

declare function createConfig<Module extends AnyModule, ConfigImplement = Module["Config"]["Implement"]>(
  fn: (prop: { z: typeof z }) => ConfigImplement,
): (prop: { z: typeof z }) => ConfigImplement;
declare function createContext<Module extends AnyModule, ContextImplement = Module["Context"]["Implement"]>(
  fn: (prop: {
    z: typeof z;
    fn: <Value = undefined, Output = undefined>(
      props: Parameters<typeof createPipesContextCommand<Module, Value, Output>>[0],
    ) => ReturnType<typeof createPipesContextCommand<Module, Value, Output>>;
  }) => ContextImplement,
): typeof fn;
declare function createModule<
  NewModule extends AnyModule,
  ConfigImplement = NewModule["Config"]["Implement"],
  ContextImplement = NewModule["Context"]["Implement"],
  RequiredNames extends ModuleName[] = NewModule["RequiredModules"][number]["ModuleName"] extends never
    ? []
    : moduleNameToString<NewModule["RequiredModules"][number]["ModuleName"]>[],
  OptionalNames extends ModuleName[] = NewModule["OptionalModules"][number]["ModuleName"] extends never
    ? []
    : moduleNameToString<NewModule["OptionalModules"][number]["ModuleName"]>[],
>(param: {
  name: moduleNameToString<NewModule["ModuleName"]>;
  config: (value: { z: typeof z }) => ConfigImplement;
  context: (value: {
    z: typeof z;
    fn: <Value = undefined, Output = undefined>(
      props: Parameters<typeof createPipesContextCommand<NewModule, Value, Output>>[0],
    ) => ReturnType<typeof createPipesContextCommand<NewModule, Value, Output>>;
  }) => ContextImplement;
  required?: RequiredNames;
  optional?: OptionalNames;
}): {
  name: NewModule["ModuleName"];
  config: ConfigImplement;
  context: ContextImplement;
  required: RequiredNames;
  optional: OptionalNames;
};
type createModuleDef<
  Name extends string,
  Definition,
  Config extends ModuleConfigValue<Config>,
  RequiredModules extends AnyModule[] = [],
  OptionalModules extends AnyModule[] = [],
> = CreateModule<newModuleName<Name>, Definition, Config, RequiredModules, OptionalModules>;

interface IPipesCoreContext {
  startTime: Date;
  getDurationInMs: () => number;
  client: Client;
  haltAll: () => void;
  modules: ModuleName[];
  stack: string[];
  hasModule: <Module extends AnyModule>(name: moduleNameToString<Module["ModuleName"]>) => boolean;
  imageStore: Promise<ReturnType<typeof createZodKeyStore<z.ZodType<Container>>>>;
  addEnv: (prop: { container: Container$1; env: [string, string][] }) => Container$1;
}
interface IPipesCoreConfig {
  appName: string;
  isCI: boolean;
  isPR: boolean;
  env: "github" | "gitlab" | "local";
}
type PipesCoreModule = createModuleDef<"PipesCore", IPipesCoreContext, IPipesCoreConfig>;

declare const internalStateSchema: z.ZodDefault<
  z.ZodUnion<
    [
      z.ZodLiteral<"running">,
      z.ZodLiteral<"waiting">,
      z.ZodLiteral<"waiting_for_dependency">,
      z.ZodLiteral<"finished">,
      z.ZodLiteral<"failed">,
    ]
  >
>;
declare const loaderStateSchema: z.ZodDefault<
  z.ZodUnion<
    [z.ZodLiteral<"initializing">, z.ZodLiteral<"starting">, z.ZodLiteral<"running">, z.ZodLiteral<"finished">]
  >
>;

type InternalState = z.infer<typeof internalStateSchema>;
type LoaderState = z.infer<typeof loaderStateSchema>;
type TaskSet = symbol[];
type InternalStateStore = {
  state: InternalState;
  name: string;
};
type LoaderStateStore = {
  symbolsOfTasksCompleted: TaskSet;
  symbolsOfTasksFailed: TaskSet;
  symbolsOfTasks: TaskSet;
  state: LoaderState;
};

declare class PipesCoreClass<
  Modules extends AnyModule[] = [PipesCoreModule],
  CurrentState extends MergeModules<Modules> = MergeModules<Modules>,
  CurrentConfig extends CurrentState["Config"] = CurrentState["Config"],
  CurrentContext extends CurrentState["Context"] = CurrentState["Context"],
  ScriptFn extends fn$1<CurrentContext["ContextInterface"], CurrentConfig["Merged"]> = fn$1<
    CurrentContext["ContextInterface"],
    CurrentConfig["Merged"]
  >,
> {
  #private;
  get symbol(): symbol;
  addDependency(value: PipesCoreClass<any> | symbol): this;
  removeDependency(value: PipesCoreClass<any> | symbol): this;
  addScript(fn: ScriptFn): this;
  set haltAll(value: () => void | Promise<void>);
  get haltAll(): () => void;
  config: CurrentConfig["Merged"];
  context: {
    [key in keyof CurrentContext["OutsideInterface"]]: CurrentContext["OutsideInterface"][key] extends PipesContextCommandBase
      ? Diff<CurrentContext["OutsideInterface"][key], PipesContextCommandBase>
      : CurrentContext["OutsideInterface"][key];
  };
  constructor({
    modules,
    schemas: { config, context },
  }: {
    modules: ModuleName[];
    schemas: {
      config: CurrentConfig["MergedImplement"];
      context: CurrentContext["MergedImplement"];
    };
  });
  get isReady(): boolean;
  get modules(): ModuleName[];
  hasModule(moduleName: string): boolean;
  addModule<T extends AnyModule>(module: ModuleReturnType<T>): PipesCoreClass<[T, ...Modules]>;
  set client(client: Client);
  get client(): Client;
  run(state?: LoaderStateStore, internalState?: InternalStateStore): Promise<void>;
}
declare const createPipesCore: () => PipesCoreClass<[PipesCoreModule]>;
declare const ContextHasModule: <T extends unknown, K extends keyof T, Context extends Partial<T>>(
  context: unknown,
  key: K,
) => context is Required<Pick<Context, keyof T>> & Omit<Context, keyof T> extends infer T_1
  ? { [KeyType_1 in keyof T_1]: (Required<Pick<Context, keyof T>> & Omit<Context, keyof T>)[KeyType_1] }
  : never;
declare const ConfigHasModule: <T extends unknown, K extends keyof T, Config extends Partial<T>>(
  config: unknown,
  key: K,
) => config is Required<Pick<Config, keyof T>> & Omit<Config, keyof T> extends infer T_1
  ? { [KeyType_1 in keyof T_1]: (Required<Pick<Config, keyof T>> & Omit<Config, keyof T>)[KeyType_1] }
  : never;
type ModuleReturnType<NewModule extends AnyModule> = {
  name: NewModule["ModuleName"];
  config: NewModule["Config"]["Implement"];
  context: NewModule["Context"]["Implement"];
  required: NewModule["RequiredModules"][number]["ModuleName"] extends never
    ? []
    : NewModule["RequiredModules"][number]["ModuleName"][];
  optional: NewModule["OptionalModules"][number]["ModuleName"] extends never
    ? []
    : NewModule["OptionalModules"][number]["ModuleName"][];
};
type fn$1<Context extends any, Config extends any> = (context: Context, config: Config) => Promise<void> | void;
type Diff<T, U> = T extends any & U ? (T extends infer R & U ? R : never) : never;

declare function onCleanup(callback: () => void): (call?: boolean) => void;

declare class PipesCoreRunner {
  #private;
  addContext(value: PipesCoreClass): () => void;
  removeContext(value: PipesCoreClass): void;
  run(): Promise<void>;
}
interface CreatePipeProps {
  z: typeof z;
  createPipesCore: typeof createPipesCore;
  createConfig: typeof createConfig;
  createModule: typeof createModule;
  createContext: typeof createContext;
  contextHasModule: typeof ContextHasModule;
  configHasModule: typeof ConfigHasModule;
}
interface PipeBase {
  run: (value: any, state: any) => Promise<any> | any;
  client: Client | null | undefined;
}
declare const createPipe: (
  fn: ({ z, createPipesCore }: CreatePipeProps) => Promise<PipeBase[]> | PipeBase[],
) => Promise<void>;

export {
  PipesCoreClass,
  type PipesCoreModule,
  PipesCoreRunner,
  dom as PipesDOM,
  type Simplify,
  createConfig,
  createContext,
  createGlobalZodKeyStore,
  createGlobalZodStore,
  createModule,
  type createModuleDef,
  createPipe,
  createZodKeyStore,
  createZodStore,
  onCleanup,
  render,
};
