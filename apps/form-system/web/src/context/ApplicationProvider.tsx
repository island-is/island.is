import { FormSystemApplication } from '@island.is/api/schema'
import { ApplicationStatus } from '@island.is/form-system/enums'
import {
  Action,
  ApplicationDispatch,
  ApplicationState,
} from '@island.is/form-system/ui'
import { useNamespaces } from '@island.is/localization'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Form } from '../components/Form/Form'
import {
  applicationReducer,
  initialReducer,
  initialState,
  uploadNavigationReducer,
} from '../reducers/applicationReducer'
import { fieldReducer } from '../reducers/fieldReducer'

interface ApplicationContextProvider {
  state: ApplicationState
  dispatch: ApplicationDispatch
  validateEligibility: boolean
  enableApplicationPdfDownload: boolean
}

export const ApplicationContext = createContext<ApplicationContextProvider>({
  state: initialState,
  dispatch: () => undefined,
  validateEligibility: false,
  enableApplicationPdfDownload: false,
})

export const useApplicationContext = () => useContext(ApplicationContext)

const reducers = (state: ApplicationState, action: Action) => {
  const newState = applicationReducer(state, action)
  return fieldReducer(newState, action)
}

export const ApplicationProvider: React.FC<{
  application: FormSystemApplication
  validateEligibility: boolean
  enableApplicationPdfDownload: boolean
}> = ({ application, validateEligibility, enableApplicationPdfDownload }) => {
  useNamespaces('form.system')
  const app = useMemo(() => application, [application])
  const [state, reducerDispatch] = useReducer(
    reducers,
    {
      ...initialState,
      submitted: app.status === ApplicationStatus.COMPLETED,
      application: app,
    },
    initialReducer,
  )
  const uploadNavigationState = useRef<
    Pick<ApplicationState, 'pendingUploads' | 'isNavigating' | 'submitted'>
  >({ submitted: app.status === ApplicationStatus.COMPLETED })
  const dispatch = useCallback((action: Action) => {
    // React may batch renders; reserve navigation/uploads synchronously.
    const previous = uploadNavigationState.current
    const next = uploadNavigationReducer(previous, action)
    if (
      (action.type === 'START_NAVIGATION' ||
        action.type === 'START_FILE_UPLOAD') &&
      next === previous
    ) {
      return false
    }
    uploadNavigationState.current = next
    reducerDispatch(action)
    return true
  }, [])
  const methods = useForm({ mode: 'onChange', shouldUnregister: true })
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      validateEligibility,
      enableApplicationPdfDownload,
    }),
    [state, dispatch, validateEligibility, enableApplicationPdfDownload],
  )

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Application state changed:', state)
    }
  }, [state])

  useEffect(() => {
    if (application.status !== ApplicationStatus.COMPLETED) return
    dispatch({
      type: 'SUBMITTED',
      payload: {
        submitted: true,
        screenError: {
          hasError: false,
          title: { is: '', en: '' },
          message: { is: '', en: '' },
        },
      },
    })
  }, [application.status])

  return (
    <ApplicationContext.Provider value={contextValue}>
      <FormProvider {...methods}>{state.application && <Form />}</FormProvider>
    </ApplicationContext.Provider>
  )
}
