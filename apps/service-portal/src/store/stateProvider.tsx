import React, { createContext, Dispatch,useContext, useReducer } from 'react'

import { Action } from './actions'
import { initialState,StoreState } from './store'
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
