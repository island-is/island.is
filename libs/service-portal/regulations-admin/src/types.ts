declare const _RegName__Brand: unique symbol
/** Regulation name – `0123/2012` */
export type RegName = string & { [_RegName__Brand]: true }

declare const _RegNameQuery__Brand: unique symbol
/** Regulation name formatted for URL param insertion – `0123-2012` */
export type RegQueryName = string & { [_RegNameQuery__Brand]: true }

declare const _ISODate__Brand: unique symbol
/** Valid ISODate string – e.g. `2012-09-30` */
export type ISODate = string & { [_ISODate__Brand]: true }

declare const _HTMLText__Brand: unique symbol
/** HTMLText string – e.g. `I &lt;3 You ` */
export type HTMLText = string & { [_HTMLText__Brand]: true }

/** Plain-text string – e.g. `I <3 You ` */
export type PlainText = string & { [_HTMLText__Brand]?: false }

declare const _Year__Brand: unique symbol
/** Four letter positive integer that might reasonably be a year */
export type Year = number & { [_Year__Brand]: true }

// ---------------------------------------------------------------------------

// TODO: add link to original DOC/PDF file in Stjórnartíðindi's data store.
/** Regulations are roughly classified based on whether they contain
 * any original text/stipulations, or whether they **only**  prescribe
 * changes to other regulations.
 *
 * `base` = Stofnreglugerð
 * `amending` = Breytingareglugerð
 */
export type RegulationType = 'base' | 'amending'

// TODO: add link to original DOC/PDF file in Stjórnartíðindi's data store.
/** Regulations are roughly classified based on whether they contain
 * any original text/stipulations, or whether they **only**  prescribe
 * changes to other regulations.
 *
 * `draft` = The regulation is still being drafted. Do NOT edit and/or publish!
 * `proposal` = The regulation is ready for a final review/tweaking by an editor.
 * `shipped` = The regulation has been sent to Stjórnartíðindi and is awaiting formal publication.
 */
export type DraftingStatus = 'draft' | 'proposal' | 'shipped'

// ---------------------------------------------------------------------------

export type UserRole = 'author' | 'editor'

// ---------------------------------------------------------------------------

declare const _Kennitala__Brand: unique symbol
/** Icelandic national census id number  */
export type Kennitala = string & { [_Kennitala__Brand]: true }
