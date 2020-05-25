import { theme } from './theme'

declare module 'treat/theme' {
  type MyTheme = typeof theme
  export type Theme = MyTheme
}
