import React, { createContext, useContext, useReducer } from 'react'
import { StoreState, Action } from './store'
export const StateContext = createContext(null)

type StateProviderTypes = {
  reducer: React.Reducer<StoreState, Action>
  initialState: StoreState
  children: React.ReactNode
}

export const StateProvider = ({
  reducer,
  initialState,
  children,
}: StateProviderTypes) => {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  )
}
export const useStore: () => [StoreState, (action: Action) => void] = () =>
  useContext(StateContext)
