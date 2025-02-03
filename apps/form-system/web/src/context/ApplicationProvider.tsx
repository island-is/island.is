import { createContext, Dispatch, useContext, useState, ReactNode, useReducer } from "react"
import { FormSystemApplication } from "@island.is/api/schema"
import { applicationReducer, initialReducer } from "../reducers/applicationReducer"
import { Action, ApplicationState } from "../reducers/reducerTypes"

interface ApplicationContextProvider {
  state: ApplicationState,
  dispatch: Dispatch<Action>
}

export const ApplicationContext = createContext<ApplicationContextProvider>({
  state: {
    application: {},
    sections: [],
    screens: [],
    currentSection: '',
    currentScreen: '',
  },
  dispatch: () => undefined,
})

export const useApplicationContext = () => useContext(ApplicationContext)

export const ApplicationProvider: React.FC<{ children: ReactNode, application: FormSystemApplication }> = ({ children, application }) => {
  const [state, dispatch] = useReducer(
    applicationReducer,
    {
      application,
      sections: [],
      screens: [],
      currentSection: '',
      currentScreen: undefined,
    },
    initialReducer,
  )
  return (
    <ApplicationContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}