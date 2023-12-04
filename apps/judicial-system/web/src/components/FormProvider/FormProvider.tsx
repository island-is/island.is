import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import { USERS_ROUTE } from '@island.is/judicial-system/consts'
import { CaseState } from '@island.is/judicial-system/types'
import {
  CaseOrigin,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { TempCase as Case } from '../../types'
import { UserContext } from '../UserProvider/UserProvider'
import CaseQuery from './caseGql'
import LimitedAccessCaseQuery from './limitedAccessCaseGql'

type ProviderState =
  | 'fetch'
  | 'refresh'
  | 'up-to-date'
  | 'ready'
  | 'not-found'
  | undefined

interface FormProvider {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoadingWorkingCase: boolean
  caseNotFound: boolean
  isCaseUpToDate: boolean
  refreshCase: () => void
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshCase: () => {},
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
  const { limitedAccess } = useContext(UserContext)
  const router = useRouter()
  const id = router.query.id

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
  const [path, setPath] = useState<string>()
  const [workingCase, setWorkingCase] = useState<Case>({
    ...initialState,
    type: caseType,
    policeCaseNumbers: caseType === CaseType.INDICTMENT ? [''] : [],
  })

  // Used in exported indicators
  const replacingCase = router.query.id && router.query.id !== caseId
  const replacingPath = router.pathname !== path

  useEffect(() => {
    if (!router.query.id) {
      // Not working on a case
      setState(undefined)
    } else if (router.query.id === caseId) {
      // Working on the same case as the previous page
      setState('refresh')
    } else {
      // Starting work on a different case
      setState('fetch')
    }

    setCaseId(router.query.id as string)
    setPath(router.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, router.pathname])

  const [getCase] = useLazyQuery(CaseQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted: (caseData) => {
      if (caseData && caseData.case) {
        setWorkingCase(caseData.case)

        // The case has been loaded from the server
        setState('up-to-date')
      }
    },
    onError: () => {
      // The case was not found
      setState('not-found')
    },
  })

  const [getLimitedAccessCase] = useLazyQuery(LimitedAccessCaseQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted: (caseData) => {
      if (caseData && caseData.limitedAccessCase) {
        setWorkingCase(caseData.limitedAccessCase)

        // The case has been loaded from the server
        setState('up-to-date')
      }
    },
    onError: () => {
      // The case was not found
      setState('not-found')
    },
  })

  useEffect(() => {
    if (
      limitedAccess !== undefined && // Wait until limitedAccess is defined
      (state === 'fetch' || state === 'refresh')
    ) {
      if (limitedAccess) {
        getLimitedAccessCase({ variables: { input: { id } } })
      } else {
        getCase({ variables: { input: { id } } })
      }
    }
  }, [getCase, getLimitedAccessCase, id, limitedAccess, state])

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
        isCaseUpToDate: state === 'up-to-date',
        refreshCase: () => setState('refresh'),
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export { MaybeFormProvider as FormProvider }
