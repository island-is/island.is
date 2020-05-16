declare module 'treat/theme' {
  type MyTheme = import('./types').Theme
  export interface Theme extends MyTheme {}
}
