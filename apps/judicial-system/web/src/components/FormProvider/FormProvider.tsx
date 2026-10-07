import type { Dispatch, ReactNode, SetStateAction } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'

import {
  ADMIN_USERS_ROUTE,
  PROSECUTION_CREATE_CUSTODY_CASE_ROUTE,
  PROSECUTION_CREATE_INDICTMENT_ROUTE,
  PROSECUTION_CREATE_INVESTIGATION_CASE_ROUTE,
  PROSECUTION_CREATE_TRAVEL_BAN_ROUTE,
} from '@island.is/judicial-system/consts'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  CaseOrigin,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { api } from '@island.is/judicial-system-web/src/services'

import type { CaseQuery } from './case.generated'
import { useCaseLazyQuery } from './case.generated'
import type { LimitedAccessCaseQuery } from './limitedAccessCase.generated'
import { useLimitedAccessCaseLazyQuery } from './limitedAccessCase.generated'

// The case as the web fetches it: every field either case query selects, and
// nothing else. Reading a field neither query selects is a compile error, which
// is what keeps the queries from growing to cover the whole schema. The two
// queries serve different roles and select different fields, so a screen that
// reads a field only the other role's query selects gets undefined at runtime.
export type WorkingCase = NonNullable<CaseQuery['case']> &
  NonNullable<LimitedAccessCaseQuery['limitedAccessCase']>

type ProviderState =
  | 'creating'
  | 'fetch'
  | 'refresh'
  | 'up-to-date'
  | 'ready'
  | 'not-found'
  | undefined

interface FormContextValue {
  workingCase: WorkingCase
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>
  isLoadingWorkingCase: boolean
  caseNotFound: boolean
  isCaseUpToDate: boolean
  isCreating: boolean
  refreshCase: () => void
  getCase: (
    id: string,
    onCompleted: (theCase: WorkingCase) => void,
    onError: () => void,
  ) => void
}

interface Props {
  children: ReactNode
}

const initialState: WorkingCase = {
  id: '',
  created: '',
  origin: CaseOrigin.UNKNOWN,
  type: CaseType.CUSTODY,
  state: CaseState.NEW,
  policeCaseNumbers: [],
  defendants: [{ id: '', noNationalId: false }],
  defendantWaivesRightToCounsel: false,
}

export const FormContext = createContext<FormContextValue>({
  workingCase: initialState,
  setWorkingCase: () => initialState,
  isLoadingWorkingCase: true,
  caseNotFound: false,
  isCaseUpToDate: false,
  isCreating: false,
  refreshCase: () => {
    return
  },
  getCase: () => {
    return
  },
})

const MaybeFormProvider = ({ children }: Props) => {
  const router = useRouter()
  return router.pathname.includes(ADMIN_USERS_ROUTE) ? (
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
  const [workingCase, setWorkingCase] = useState<WorkingCase>({
    ...initialState,
    type: caseType,
    policeCaseNumbers: caseType === CaseType.INDICTMENT ? [''] : [],
  })

  // Used in exported indicators
  const id = typeof router.query.id === 'string' ? router.query.id : undefined
  const isCreatingCase = [
    PROSECUTION_CREATE_CUSTODY_CASE_ROUTE,
    PROSECUTION_CREATE_TRAVEL_BAN_ROUTE,
    PROSECUTION_CREATE_INVESTIGATION_CASE_ROUTE,
    PROSECUTION_CREATE_INDICTMENT_ROUTE,
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
    (
      id: string,
      onCompleted: (theCase: WorkingCase) => void,
      onError: () => void,
    ) => {
      const promisedCase = limitedAccess
        ? queryLimitedAccessCase({ variables: { input: { id } } })
        : queryCase({ variables: { input: { id } } })

      promisedCase
        .then((caseData) => {
          if (caseData && caseData.data) {
            // Whichever query ran, its result is a WorkingCase. This is the
            // one place the two query result types meet the shared context type.
            const data = caseData.data as {
              case?: WorkingCase | null
              limitedAccessCase?: WorkingCase | null
            }
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
        (theCase) => {
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
        isCreating: isCreatingCase,
        refreshCase: () => setState('refresh'),
        getCase,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export { MaybeFormProvider as FormProvider }
