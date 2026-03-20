import { numberFormat } from '@island.is/portals/my-pages/core'

export const displayWithUnit = (
  value: string | undefined | null | number,
  unit: 'kg' | 'cc' | 'hö' | 'mm' | 'g/km' | 'km' | 'mi',
  formatNumber?: boolean,
) => {
  //Explict checking because 0 is falsy.
  if (value === null || value === undefined) {
    return ''
  }

  const number = +value

  if (Number.isNaN(number)) {
    return ''
  }

  return `${formatNumber ? numberFormat(number) : value} ${unit}`
}
