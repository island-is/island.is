import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from 'react'

import { FieldBaseProps, RepeaterProps } from '@island.is/application/types'
import * as uiFields from '@island.is/application/ui-fields'

type Fields = {
  [key: string]: FC<React.PropsWithChildren<FieldBaseProps | RepeaterProps>>
}
type Dispatch = (fields: Fields) => void
type FieldStateProviderProps = { children: ReactNode }

const FieldStateContext = createContext<[Fields, Dispatch]>([
  uiFields as Fields,
  () => undefined,
])

export const FieldProvider = ({ children }: FieldStateProviderProps) => {
  const [fields, setFields] = useState<Fields>(uiFields as Fields)

  return (
    <FieldStateContext.Provider
      value={[fields, (newFields) => setFields({ ...fields, ...newFields })]}
    >
      {children}
    </FieldStateContext.Provider>
  )
}

export const useFields = () => useContext(FieldStateContext)
