import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useState,
} from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import * as uiFields from '@island.is/application/ui-fields'

type Fields = { [key: string]: FC<FieldBaseProps> }

type Dispatch = (fields: Fields) => void
type FieldStateProviderProps = { children: ReactNode }

const FieldStateContext = createContext<[Fields, Dispatch]>([
  uiFields as Fields,
  () => undefined,
])

const FieldProvider = ({ children }: FieldStateProviderProps) => {
  const [fields, setFields] = useState<Fields>(uiFields as Fields)
  return (
    <FieldStateContext.Provider
      value={[fields, (newFields) => setFields({ ...fields, ...newFields })]}
    >
      {children}
    </FieldStateContext.Provider>
  )
}

const useFields = () => useContext(FieldStateContext)

export { FieldProvider, useFields }
