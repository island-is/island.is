import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import {
  CREATE_INDICTMENT_ROUTE,
  CREATE_INVESTIGATION_CASE_ROUTE,
  CREATE_RESTRICTION_CASE_ROUTE,
  CREATE_TRAVEL_BAN_ROUTE,
  USERS_ROUTE,
} from '@island.is/judicial-system/consts'
import {
  Case,
  CaseOrigin,
  CaseState,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { api } from '../../services'
import { UserContext } from '../UserProvider/UserProvider'
import { CaseQuery, useCaseLazyQuery } from './case.generated'
import {
  LimitedAccessCaseQuery,
  useLimitedAccessCaseLazyQuery,
} from './limitedAccessCase.generated'

type ProviderState =
  | 'creating'
  | 'fetch'
  | 'refresh'
  | 'up-to-date'
  | 'ready'
  | 'not-found'
  | undefined

interface FormProvider {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  isLoadingWorkingCase: boolean
  caseNotFound: boolean
  isCaseUpToDate: boolean
  refreshCase: () => void
  getCase: (
    id: string,
    onCompleted: (theCase: Case) => void,
    onError: () => void,
  ) => void
}

interface Props {
  children: ReactNode
}

const initialState: Case = {
  id: '',
  created: '',
  modified: '',
  origin: CaseOrigin.UNKNOWN,
  type: CaseType.CUSTODY,
  state: CaseState.NEW,
  policeCaseNumbers: [],
  defendants: [{ id: '', noNationalId: false } as Defendant],
  defendantWaivesRightToCounsel: false,
}

export const FormContext = createContext<FormProvider>({
  workingCase: initialState,
  setWorkingCase: () => initialState,
  isLoadingWorkingCase: true,
  caseNotFound: false,
  isCaseUpToDate: false,
  refreshCase: () => {
    return
  },
  getCase: () => {
    return
  },
})

const MaybeFormProvider = ({ children }: Props) => {
  const router = useRouter()
  return router.pathname.includes(USERS_ROUTE) ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  ) : (
    <FormProvider>{children}</FormProvider>
  )
}

const FormProvider = ({ children }: Props) => {
  const { isAuthenticated, limitedAccess } = useContext(UserContext)
  const router = useRouter()

  const caseType = router.pathname.includes('farbann')
    ? CaseType.TRAVEL_BAN
    : router.pathname.includes('gaesluvardhald')
    ? CaseType.CUSTODY
    : router.pathname.includes('akaera')
    ? CaseType.INDICTMENT
    : // This is a random case type for the default value.
      // It is updated when the case is created.
      CaseType.OTHER

  const [state, setState] = useState<ProviderState>()
  const [caseId, setCaseId] = useState<string>()
  const [pathname, setPathname] = useState<string>()
  const [workingCase, setWorkingCase] = useState<Case>({
    ...initialState,
    type: caseType,
    policeCaseNumbers: caseType === CaseType.INDICTMENT ? [''] : [],
  })

  // Used in exported indicators
  const id = typeof router.query.id === 'string' ? router.query.id : undefined
  const isCreatingCase = [
    CREATE_RESTRICTION_CASE_ROUTE,
    CREATE_TRAVEL_BAN_ROUTE,
    CREATE_INVESTIGATION_CASE_ROUTE,
    CREATE_INDICTMENT_ROUTE,
  ].includes(router.pathname)
  const replacingCase = id && id !== caseId
  const replacingPath = router.pathname !== pathname

  useEffect(() => {
    if (isCreatingCase) {
      setState('creating')
    } else if (!id) {
      // Not working on a case
      setState(undefined)
    } else if (id === caseId) {
      // Working on the same case as the previous page
      setState('refresh')
    } else {
      // Starting work on a different case
      setState('fetch')
    }

    if (id !== caseId) {
      setCaseId(id)
    }
    if (router.pathname !== pathname) {
      setPathname(router.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, router.pathname])

  const [queryCase] = useCaseLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [queryLimitedAccessCase] = useLimitedAccessCaseLazyQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const getCase = useCallback(
    (id: string, onCompleted: (theCase: Case) => void, onError: () => void) => {
      const promisedCase = limitedAccess
        ? queryLimitedAccessCase({ variables: { input: { id } } })
        : queryCase({ variables: { input: { id } } })

      promisedCase
        .then((caseData) => {
          if (caseData && caseData.data) {
            const data = caseData.data as CaseQuery & LimitedAccessCaseQuery
            const theCase = data[limitedAccess ? 'limitedAccessCase' : 'case']

            if (theCase) {
              onCompleted(theCase)
            } else {
              onError()
            }
          }
        })
        .catch(onError)
    },
    [limitedAccess, queryCase, queryLimitedAccessCase],
  )

  useEffect(() => {
    const isRoot = /^\/?$/.test(window.location.pathname)
    if (!isRoot && !isAuthenticated) {
      window.location.assign(
        `${api.apiUrl}/api/auth/login?redirectRoute=${window.location.pathname}`,
      )
    }

    if (
      limitedAccess !== undefined && // Wait until limitedAccess is defined
      id &&
      (state === 'fetch' || state === 'refresh')
    ) {
      getCase(
        id,
        (theCase: Case) => {
          setWorkingCase(theCase)

          // The case has been loaded from the server
          setState('up-to-date')
        },
        () => {
          // The case was not found
          setState('not-found')
        },
      )
    }
  }, [
    queryCase,
    queryLimitedAccessCase,
    id,
    isAuthenticated,
    limitedAccess,
    state,
    getCase,
    router,
  ])

  useEffect(() => {
    let timeout: undefined | NodeJS.Timeout
    if (state === 'up-to-date') {
      // The case may change on the server so we only stay up to date for a short time
      // The time needs to be long enough to let hooks take appropriate actions, for instance auto fill
      timeout = setTimeout(() => setState('ready'), 1000)
    }
    return () => {
      timeout && clearInterval(timeout)
    }
  }, [state])

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        // Loading when we have just switched cases or we are still fetching
        isLoadingWorkingCase: replacingCase || state === 'fetch',
        // Not found until we navigate to a different page
        caseNotFound: !replacingPath && state === 'not-found',
        isCaseUpToDate:
          isCreatingCase ||
          (!replacingCase && !replacingPath && state === 'up-to-date'),
        refreshCase: () => setState('refresh'),
        getCase,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export { MaybeFormProvider as FormProvider }
