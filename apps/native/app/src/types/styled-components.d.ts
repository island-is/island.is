import type { CSSProp } from 'styled-components'
import { Theme } from '@/ui/utils/theme'
import { Tokens } from '@/ui/utils/tokens'

export interface ThemeType extends Theme {
  colorScheme: string
  isDark: boolean
  appearanceMode?: string
  tokens: Tokens
  tokenModes: {
    light: Tokens
    dark: Tokens
  }
}

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {}
  export type StyledProps<P> = P & ExecutionContext
}
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
  export type StyledProps<P> = P & ExecutionContext
}

declare module 'react' {
  interface DOMAttributes<T> {
    css?: CSSProp
  }
}
