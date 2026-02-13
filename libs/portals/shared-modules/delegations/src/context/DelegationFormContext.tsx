import { AuthApiScope } from '@island.is/api/schema'
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export type ScopeSelection = AuthApiScope & {
  validTo?: Date
}

export interface DelegationFormState {
  // Step 1: Identity/Identities
  identities: string[]
  setIdentities: Dispatch<SetStateAction<string[]>>

  // Step 2: Scope Selection
  selectedScopes: ScopeSelection[]
  setSelectedScopes: Dispatch<SetStateAction<ScopeSelection[]>>

  // Step 3: Validity Period
  validityPeriod: Date | null
  setValidityPeriod: Dispatch<SetStateAction<Date | null>>

  // Option to use same validity for all scopes or per-scope dates
  useSameValidityForAll: boolean
  setUseSameValidityForAll: Dispatch<SetStateAction<boolean>>

  // Helper to clear all form state
  clearForm: () => void
}

const defaultState: Omit<DelegationFormState, 'clearForm'> = {
  identities: [],
  setIdentities: () => undefined,
  selectedScopes: [],
  setSelectedScopes: () => undefined,
  validityPeriod: null,
  setValidityPeriod: () => undefined,
  useSameValidityForAll: true,
  setUseSameValidityForAll: () => undefined,
}

export const DelegationFormContext = createContext<DelegationFormState>(
  defaultState as DelegationFormState,
)

export const DelegationFormProvider: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [identities, setIdentities] = useState<string[]>([])
  const [selectedScopes, setSelectedScopes] = useState<ScopeSelection[]>([])
  const [validityPeriod, setValidityPeriod] = useState<Date | null>(null)
  const [useSameValidityForAll, setUseSameValidityForAll] = useState(true)

  const clearForm = () => {
    setIdentities([])
    setSelectedScopes([])
    setValidityPeriod(null)
    setUseSameValidityForAll(true)
  }

  return (
    <DelegationFormContext.Provider
      value={{
        identities,
        setIdentities,
        selectedScopes,
        setSelectedScopes,
        validityPeriod,
        setValidityPeriod,
        useSameValidityForAll,
        setUseSameValidityForAll,
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
