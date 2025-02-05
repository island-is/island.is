export enum Locale {
  IS = 'is',
  EN = 'en',
}

export const todoCallGlobalFormatUtilFunction = (value: number): string =>
  `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} kr.`
