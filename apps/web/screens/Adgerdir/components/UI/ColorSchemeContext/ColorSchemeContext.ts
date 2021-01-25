import { createContext } from 'react'

export type ColorSchemes = 'green' | 'blue'

export interface ColorSchemeInterface {
  colorScheme: ColorSchemes
}

export const ColorSchemeContext = createContext<ColorSchemeInterface>({
  colorScheme: 'green',
})

export default ColorSchemeContext
