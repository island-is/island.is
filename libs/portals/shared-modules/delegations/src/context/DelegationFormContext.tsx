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

  originalScopes: ScopeSelection[]
  setOriginalScopes: (scopes: ScopeSelection[]) => void

  clearForm: () => void
}

const defaultState: DelegationFormState = {
  identities: [],
  setIdentities: () => undefined,
  selectedScopes: [],
  setSelectedScopes: () => undefined,
  originalScopes: [],
  setOriginalScopes: () => undefined,
  clearForm: () => undefined,
}

export const DelegationFormContext = createContext<DelegationFormState>(
  defaultState as DelegationFormState,
)

export const DelegationFormProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [identities, setIdentities] = useState<Identity[]>([])
  const [selectedScopes, setSelectedScopes] = useState<ScopeSelection[]>([])
  const originalScopesRef = useRef<ScopeSelection[]>([])

  const setOriginalScopes = useCallback((scopes: ScopeSelection[]) => {
    originalScopesRef.current = scopes
  }, [])

  const clearForm = useCallback(() => {
    setIdentities([])
    setSelectedScopes([])
    originalScopesRef.current = []
  }, [])

  return (
    <DelegationFormContext.Provider
      value={{
        identities,
        setIdentities,
        selectedScopes,
        setSelectedScopes,
        originalScopes: originalScopesRef.current,
        setOriginalScopes,
        clearForm,
      }}
    >
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
