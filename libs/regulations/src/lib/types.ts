declare const _RegName__Brand: unique symbol
/** Regulation name – `0123/2012` */
export type RegName = string & { [_RegName__Brand]: true }

declare const _RegNameQuery__Brand: unique symbol
/** Regulation name formatted for URL param insertion – `0123-2012` */
export type RegQueryName = string & { [_RegNameQuery__Brand]: true }

declare const _ISODate__Brand: unique symbol
/** Valid ISODate string – e.g. `2012-09-30` */
export type ISODate = string & { [_ISODate__Brand]: true }

declare const _ISODateTime__Brand: unique symbol
/** Valid UTC ISODateTime string – e.g. `2012-09-30T12:00:00` */
export type ISODateTime = string & { [_ISODateTime__Brand]: true }

declare const _HTMLText__Brand: unique symbol
/** HTMLText string – e.g. `I &lt;3 You ` */
export type HTMLText = string & { [_HTMLText__Brand]: true }

/** Plain-text string – e.g. `I <3 You ` */
export type PlainText = string & { [_HTMLText__Brand]?: false }

declare const _Year__Brand: unique symbol
/** Four letter positive integer that might reasonably be a year */
export type Year = number & { [_Year__Brand]: true }

// ---------------------------------------------------------------------------
