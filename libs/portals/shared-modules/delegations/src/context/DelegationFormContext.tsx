import { AuthApiScope } from '@island.is/api/schema'
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useRef,
  useState,
  useMemo,
} from 'react'

export type ScopeSelection = AuthApiScope & {
  validTo?: Date
  delegationId?: string
}

export type Identity = {
  nationalId: string
  name: string
}

export interface DelegationFormState {
  identities: Identity[]
  setIdentities: Dispatch<SetStateAction<Identity[]>>

  selectedScopes: ScopeSelection[]
  setSelectedScopes: Dispatch<SetStateAction<ScopeSelection[]>>

  clearForm: () => void
  skipNextClear: () => void
}

const defaultState: DelegationFormState = {
  identities: [],
  setIdentities: () => undefined,
  selectedScopes: [],
  setSelectedScopes: () => undefined,
  clearForm: () => undefined,
  skipNextClear: () => undefined,
}

export const DelegationFormContext = createContext<DelegationFormState>(
  defaultState as DelegationFormState,
)

export const DelegationFormProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [identities, setIdentities] = useState<Identity[]>([])
  const [selectedScopes, setSelectedScopes] = useState<ScopeSelection[]>([])

  const skipClearRef = useRef(false)

  const skipNextClear = useCallback(() => {
    skipClearRef.current = true
  }, [])

  const clearForm = useCallback(() => {
    if (skipClearRef.current) {
      skipClearRef.current = false
      return
    }
    setIdentities([])
    setSelectedScopes([])
  }, [])

  const value = useMemo(
    () => ({
      identities,
      setIdentities,
      selectedScopes,
      setSelectedScopes,
      clearForm,
      skipNextClear,
    }),
    [identities, selectedScopes, clearForm, skipNextClear],
  )

  return (
    <DelegationFormContext.Provider value={value}>
      {children}
    </DelegationFormContext.Provider>
  )
}

export const useDelegationForm = () => {
  const context = useContext(DelegationFormContext)
  if (!context) {
    throw new Error(
      'useDelegationForm must be used within a DelegationFormProvider',
    )
  }
  return context
}
