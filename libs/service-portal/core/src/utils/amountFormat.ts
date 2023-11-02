import { numberFormat } from './numberFormat'

export const amountFormat = (value: number): string =>
  numberFormat(value) + ' kr.'
