import React, { createContext, useContext, useReducer } from 'react'
export const StateContext = createContext(null)

type StateProviderTypes = {
  reducer: React.Reducer<any, any>
  initialState: React.ReducerState<any>
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
export const useStateValue = () => useContext(StateContext)
