import { createContext } from 'react'

export type ColorSchemes =
  | 'blue'
  | 'purple'
  | 'red'
  | 'white'
  | 'blueberry'
  | 'dark'
  | null

export interface ColorSchemeProps {
  colorScheme: ColorSchemes
}

export const ColorSchemeContext = createContext<ColorSchemeProps>({
  colorScheme: null,
})
