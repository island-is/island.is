/* eslint-disable @typescript-eslint/naming-convention */
export * from '@hugsmidjan/regulations-editor/types'

declare const _Year__Brand: unique symbol
/** Four letter positive integer that might reasonably be a year */
export type Year = number & { [_Year__Brand]: true }

declare const _Kennitala__Brand: unique symbol
/** Icelandic national census id number  */
export type Kennitala = string & { [_Kennitala__Brand]: true }
