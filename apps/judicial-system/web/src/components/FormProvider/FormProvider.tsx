import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'

interface FormProvider {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoadingWorkingCase: boolean
  caseNotFound: boolean
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
})

const FormProvider = ({ children }: Props) => {
  const router = useRouter()
  const id = router.query.id

  const [workingCase, setWorkingCase] = useState<Case>(initialState)

  const {
    data: workingCaseData,
    loading: isLoadingWorkingCase,
    error,
  } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
    skip: !id,
  })

  useEffect(() => {
    if (workingCaseData) {
      setWorkingCase(workingCaseData.case)
    }
  }, [workingCaseData])

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        isLoadingWorkingCase,
        caseNotFound: error !== undefined,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
