import { createContext } from 'react'

export type ColorSchemes = 'blue' | 'purple' | 'red'

export interface ColorSchemeInterface {
  colorScheme: ColorSchemes
}

export const ColorSchemeContext = createContext<ColorSchemeInterface>({
  colorScheme: 'blue',
})

export default ColorSchemeContext
