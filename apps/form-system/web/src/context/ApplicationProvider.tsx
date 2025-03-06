import { createContext, Dispatch, useContext, useReducer, useEffect, useMemo } from "react"
import { FormSystemApplication } from "@island.is/api/schema"
import { applicationReducer, initialReducer } from "../reducers/applicationReducer"
import { Action, ApplicationState } from '@island.is/form-system/ui'
import { useQuery } from "@apollo/client"
import { GET_APPLICATION, removeTypename } from "../../../../../libs/portals/form-system/graphql/src"
import { ApplicationLoading } from "../components/ApplicationsLoading/ApplicationLoading"
import { Form } from "../components/Form/Form"
import { fieldReducer } from "../reducers/fieldReducer"

interface ApplicationContextProvider {
  state: ApplicationState
  dispatch: Dispatch<Action>
}

interface LoaderProps {
  id: string
}

export const ApplicationContext = createContext<ApplicationContextProvider>({
  state: {
    application: {},
    sections: [],
    screens: [],
    currentSection: { data: {}, index: 0 },
    currentScreen: undefined,
  },
  dispatch: () => undefined,
})

export const useApplicationContext = () => useContext(ApplicationContext)

export const ApplicationLoader = ({ id }: LoaderProps) => {
  const { data, error, loading } = useQuery(GET_APPLICATION, {
    variables: { input: { id } },
    skip: !id,
    fetchPolicy: "cache-first",
  })

  if (loading) {
    return <ApplicationLoading />
  }

  if (error) {
    return <div>Error</div>
  }
  return (
    <ApplicationProvider application={removeTypename(data?.formSystemGetApplication)} />
  )
}

const reducers = (state: ApplicationState, action: Action) => {
  const newState = applicationReducer(state, action)
  return fieldReducer(newState, action)
}

export const ApplicationProvider: React.FC<{ application: FormSystemApplication }> = ({ application }) => {
  const app = useMemo(() => application, [application])

  const [state, dispatch] = useReducer(reducers, {
    application: app,
    sections: [],
    screens: [],
    currentSection: { data: {}, index: 0 },
    currentScreen: undefined
  }, initialReducer)

  const contextValue = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    console.log("state", state)
  }, [state])


  return (
    <ApplicationContext.Provider value={contextValue}>
      <Form />
    </ApplicationContext.Provider>
  )
}


