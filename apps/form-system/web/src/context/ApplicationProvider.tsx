import { createContext, Dispatch, useContext, useReducer, useMemo, useEffect } from 'react'
import { FormSystemApplication } from '@island.is/api/schema'
import {
  applicationReducer,
  initialReducer,
  initialState,
} from '../reducers/applicationReducer'
import { Action, ApplicationState } from '@island.is/form-system/ui'
import { Form } from '../components/Form/Form'
import { fieldReducer } from '../reducers/fieldReducer'
import { useForm, FormProvider } from 'react-hook-form'

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
      console.log('Application state changed:', state.application)
    }
  }, [state.application])
  return (
    <ApplicationContext.Provider value={contextValue}>
      <FormProvider {...methods}>{state.application && <Form />}</FormProvider>
    </ApplicationContext.Provider>
  )
}
