import React, { createContext, useContext, useReducer, Dispatch } from 'react'
import { StoreState, initialState } from './store'
import { Action } from './actions'
export const StateContext = createContext<[StoreState, Dispatch<Action>]>([
  initialState,
  () => null,
])

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
