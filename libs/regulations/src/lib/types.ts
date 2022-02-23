/* eslint-disable @typescript-eslint/naming-convention */
export * from '@island.is/regulations-tools/types'

declare const _Kennitala__Brand: unique symbol
/** Icelandic national census id number  */
export type Kennitala = string & { [_Kennitala__Brand]: true }
