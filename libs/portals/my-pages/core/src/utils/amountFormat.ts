import { numberFormat } from './numberFormat'

export const amountFormat = (value?: number | null): string =>
  typeof value === 'number' ? numberFormat(value) + ' kr.' : ''
