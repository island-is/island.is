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

  // Set when a grantor approves an incoming delegation request and gets
  // routed into the grant wizard. Threads the originating request through the
  // grant flow so the created delegation can be linked back (fulfill).
  pendingRequestId?: string
  setPendingRequestId: Dispatch<SetStateAction<string | undefined>>

  // Scope names requested in the approved delegation request. Used to
  // pre-select scopes in AccessScopes once the grantable scope list loads.
  requestedScopeNames?: string[]
  setRequestedScopeNames: Dispatch<SetStateAction<string[] | undefined>>

  clearForm: () => void
  skipNextClear: () => void
}

const defaultState: DelegationFormState = {
  identities: [],
  setIdentities: () => undefined,
  selectedScopes: [],
  setSelectedScopes: () => undefined,
  pendingRequestId: undefined,
  setPendingRequestId: () => undefined,
  requestedScopeNames: undefined,
  setRequestedScopeNames: () => undefined,
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
  const [pendingRequestId, setPendingRequestId] = useState<string | undefined>(
    undefined,
  )
  const [requestedScopeNames, setRequestedScopeNames] = useState<
    string[] | undefined
  >(undefined)

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
    setPendingRequestId(undefined)
    setRequestedScopeNames(undefined)
  }, [])

  const value = useMemo(
    () => ({
      identities,
      setIdentities,
      selectedScopes,
      setSelectedScopes,
      pendingRequestId,
      setPendingRequestId,
      requestedScopeNames,
      setRequestedScopeNames,
      clearForm,
      skipNextClear,
    }),
    [
      identities,
      selectedScopes,
      pendingRequestId,
      requestedScopeNames,
      clearForm,
      skipNextClear,
    ],
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
