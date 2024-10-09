import { numberFormat } from '@island.is/portals/my-pages/core'

export const displayWithUnit = (
  value: string | undefined | null | number,
  unit: 'kg' | 'cc' | 'hö' | 'mm' | 'g/km' | 'km',
  formatNumber?: boolean,
) => {
  if (value) {
    return `${formatNumber ? numberFormat(+value) : value} ${unit}`
  }
  return ''
}
