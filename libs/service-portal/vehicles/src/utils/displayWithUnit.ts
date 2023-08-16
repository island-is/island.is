import { numberFormat } from '@island.is/service-portal/core'

export const displayWithUnit = (
  value: string | undefined | null,
  unit: 'kg' | 'cc' | 'hö' | 'mm' | 'g/km' | 'km',
  formatNumber?: boolean,
) => {
  if (value) {
    return `${formatNumber ? numberFormat(+value) : value} ${unit}`
  }
  return ''
}
