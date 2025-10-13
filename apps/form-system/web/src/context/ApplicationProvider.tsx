import { useMutation } from '@apollo/client'
import { FormSystemApplication } from '@island.is/api/schema'
import { UPDATE_APPLICATION_DEPENDENCIES } from '@island.is/form-system/graphql'
import { Action, ApplicationState } from '@island.is/form-system/ui'
import { useNamespaces } from '@island.is/localization'
import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Form } from '../components/Form/Form'
import {
  applicationReducer,
  initialReducer,
  initialState,
} from '../reducers/applicationReducer'
import { fieldReducer } from '../reducers/fieldReducer'

interface ApplicationContextProvider {
  state: ApplicationState
  dispatch: Dispatch<Action>
}

export const ApplicationContext = createContext<ApplicationContextProvider>({
  state: initialState,
  dispatch: () => undefined,
})

export const useApplicationContext = () => useContext(ApplicationContext)

const reducers = (state: ApplicationState, action: Action) => {
  const newState = applicationReducer(state, action)
  return fieldReducer(newState, action)
}

export const ApplicationProvider: React.FC<{
  application: FormSystemApplication
}> = ({ application }) => {
  useNamespaces('form.system')
  const app = useMemo(() => application, [application])
  const [state, dispatch] = useReducer(
    reducers,
    {
      ...initialState,
      application: app,
    },
    initialReducer,
  )
  const methods = useForm({ mode: 'onBlur' })
  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Application state changed:', state)
    }
  }, [state])

  const [updateDependencies] = useMutation(UPDATE_APPLICATION_DEPENDENCIES)

  useEffect(() => {
    if (state.application.dependencies) {
      updateDependencies({
        variables: {
          input: {
            id: state.application.id,
            updateApplicationDto: {
              dependencies: state.application.dependencies,
            },
          },
        },
      })
    }
  }, [state.application.dependencies, state.application.id, updateDependencies])

  return (
    <ApplicationContext.Provider value={contextValue}>
      <FormProvider {...methods}>{state.application && <Form />}</FormProvider>
    </ApplicationContext.Provider>
  )
}
