import React, { createContext, useReducer, Dispatch } from 'react'

export const ModuleContext = createContext([initialState, () => null])

interface ModuleProviderProps {
  reducer: React.Reducer<StoreState, Action>
  initialState: StoreState
  children: React.ReactNode
}

export const ModuleProvider = ({
  reducer,
  initialState,
  children,
}: StateProviderTypes) => {
  return (
    <ModuleProvider.Provider value={useReducer(reducer, initialState)}>
      {children}
    </ModuleProvider.Provider>
  )
}
