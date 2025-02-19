import capitalize from 'lodash/capitalize'

export const capitalizeEveryWord = (str: string): string =>
  str.split(' ').map(capitalize).join(' ')
