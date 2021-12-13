import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'

import { CaseData } from '../../types'

interface FormProvider {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoadingWorkingCase: boolean
  caseNotFound: boolean
  isCaseUpToDate: boolean
}

interface Props {
  children: ReactNode
}

const initialState: Case = {
  id: '',
  created: '',
  modified: '',
  type: CaseType.CUSTODY,
  state: CaseState.NEW,
  policeCaseNumber: '',
  accusedNationalId: '',
}

export const FormContext = createContext<FormProvider>({
  workingCase: initialState,
  setWorkingCase: () => initialState,
  isLoadingWorkingCase: true,
  caseNotFound: false,
  isCaseUpToDate: false,
})

const FormProvider = ({ children }: Props) => {
  const router = useRouter()
  const id = router.query.id
  const caseType = router.pathname.includes('farbann')
    ? CaseType.TRAVEL_BAN
    : router.pathname.includes('gaesluvardhald')
    ? CaseType.CUSTODY
    : // This is just a random investigation case type for the default value. This
      // is updated when the case is created.
      CaseType.OTHER

  const [workingCase, setWorkingCase] = useState<Case>({
    ...initialState,
    type: caseType,
  })
  const [isLoadingWorkingCase, setIsLoadingWorkingCase] = useState(false)
  const [caseNotFound, setCaseNotFound] = useState(false)
  const [isCaseUpToDate, setIsCaseUpToDate] = useState(false)

  const [getCase] = useLazyQuery<CaseData>(CaseQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (caseData) => {
      if (caseData?.case) {
        setWorkingCase(caseData.case)
        setIsLoadingWorkingCase(false)
        setIsCaseUpToDate(true)
      }
    },
    onError: () => {
      setCaseNotFound(true)
      setIsLoadingWorkingCase(false)
    },
  })

  useEffect(() => {
    if (
      id &&
      (router.pathname.startsWith('/krafa') ||
        router.pathname.startsWith('/domur'))
    ) {
      setIsLoadingWorkingCase(true)
      getCase({ variables: { input: { id } } })
    }
  }, [id, router.pathname, getCase])

  useEffect(() => {
    if (isCaseUpToDate) {
      setIsCaseUpToDate(false)
    }
  }, [isCaseUpToDate])

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        isLoadingWorkingCase,
        caseNotFound,
        isCaseUpToDate,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
