export * from '@hugsmidjan/regulations-editor/types'

declare const _Year__Brand: unique symbol
/** Four letter positive integer that might reasonably be a year */
export type Year = number & { [_Year__Brand]: true }
