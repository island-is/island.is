import type { CSSProp } from 'styled-components'
import { Theme } from '@/ui/utils/theme';

export interface Shade {
  background: string
  foreground: string
  shade700: string
  shade600: string
  shade500: string
  shade400: string
  shade300: string
  shade200: string
  shade100: string
}

export interface Color {
  blue600: string
  blue400: string
  blue300: string
  blue200: string
  blue100: string
  dark400: string
  dark300: string
  dark200: string
  dark100: string
  red600: string
  red400: string
  red300: string
  red200: string
  red100: string
  white: string
  blueberry600: string
  blueberry400: string
  blueberry300: string
  blueberry200: string
  blueberry100: string
  purple600: string
  purple400: string
  purple300: string
  purple200: string
  purple100: string
  roseTinted600: string
  roseTinted400: string
  roseTinted300: string
  roseTinted200: string
  roseTinted100: string
  mint800: string
  mint600: string
  mint400: string
  mint200: string
  mint300: string
  mint100: string
  yellow600: string
  yellow400: string
  yellow200: string
  yellow300: string
  yellow100: string
  transparent: string
  currentColor: string
}

export interface ThemeType extends Theme {
  colorScheme: string
  isDark: boolean
  appearanceMode?: string
  shade: Shade
  shades: {
    dark: Shade
    light: Shade
  }
  color: Color
}

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {}
}
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

declare module 'react' {
  interface DOMAttributes<T> {
    css?: CSSProp
  }
}


// import { } from 'styled-components'
// import { Theme } from './ui'

// declare module 'styled-components' {
//   export interface Shade {
//     background: string
//     foreground: string
//     shade700: string
//     shade600: string
//     shade500: string
//     shade400: string
//     shade300: string
//     shade200: string
//     shade100: string
//   }

//   export interface Color {
//     blue600: string
//     blue400: string
//     blue300: string
//     blue200: string
//     blue100: string
//     dark400: string
//     dark300: string
//     dark200: string
//     dark100: string
//     red600: string
//     red400: string
//     red300: string
//     red200: string
//     red100: string
//     white: string
//     blueberry600: string
//     blueberry400: string
//     blueberry300: string
//     blueberry200: string
//     blueberry100: string
//     purple600: string
//     purple400: string
//     purple300: string
//     purple200: string
//     purple100: string
//     roseTinted600: string
//     roseTinted400: string
//     roseTinted300: string
//     roseTinted200: string
//     roseTinted100: string
//     mint800: string
//     mint600: string
//     mint400: string
//     mint200: string
//     mint300: string
//     mint100: string
//     yellow600: string
//     yellow400: string
//     yellow200: string
//     yellow300: string
//     yellow100: string
//     transparent: string
//     currentColor: string
//   }

//   // export interface DefaultTheme extends Theme {
//   //   colorScheme: string
//   //   isDark: boolean
//   //   appearanceMode?: string
//   //   shade: Shade
//   //   shades: {
//   //     dark: Shade
//   //     light: Shade
//   //   }
//   //   color: Color
//   // }

//   // export type StyledProps<P> = P & ExecutionContext

//   type Theme = {
//     colorScheme: string
//     isDark: boolean
//     appearanceMode?: string
//     shade: Shade
//     shades: {
//       dark: Shade
//       light: Shade
//     }
//     color: Color
//   };
//   export interface DefaultTheme extends Theme {}
// }
