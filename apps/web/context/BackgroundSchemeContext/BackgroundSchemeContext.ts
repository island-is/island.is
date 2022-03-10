import { createContext } from 'react'

export type BackgroundSchemes = 'blue' | 'purple' | 'red' | 'white'

export interface BackgroundSchemeInterface {
  backgroundScheme: BackgroundSchemes
}

export const BackgroundSchemeContext = createContext<BackgroundSchemeInterface>(
  {
    backgroundScheme: 'white',
  },
)

export default BackgroundSchemeContext
