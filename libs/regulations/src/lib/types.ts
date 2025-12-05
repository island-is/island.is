/* eslint-disable @typescript-eslint/naming-convention */
export * from '@dmr.is/regulations-tools/types'

declare const _Kennitala__Brand: unique symbol
/** Icelandic national census id number — e.g. `1234567890` */
export type Kennitala = string & { [_Kennitala__Brand]: true }
