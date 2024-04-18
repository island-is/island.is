// import { ContentfulLocale } from './locale.enum'

export const isDefined = <T>(x: T | null | undefined): x is T => x != null

// export const mapStringToLocale = (
//   locale: string | undefined,
// ): ContentfulLocale => {
//   switch (locale) {
//     case "en":
//       return ContentfulLocale.EN;
//     default:
//       return ContentfulLocale.IS;
//   }
// }
