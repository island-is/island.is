import { createContext } from 'react'
import { ILayoutContext } from '../types/interfaces'

const LayoutContext = createContext<ILayoutContext>({
  info: {
    organization: '',
    applicationName: '',
  },
  infoDispatch: function (_value: unknown): void {
    throw new Error('Function not implemented.')
  },
})

export default LayoutContext
