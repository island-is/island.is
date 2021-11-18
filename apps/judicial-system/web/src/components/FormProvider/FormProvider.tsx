import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'

interface FormProvider {
  isLoadingWorkingCase: boolean
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
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
})

const FormProvider = ({ children }: Props) => {
  const router = useRouter()
  const id = router.query.id

  const [workingCase, setWorkingCase] = useState<Case>(initialState)

  const { data: workingCaseData, loading: isLoadingWorkingCase } = useQuery(
    CaseQuery,
    {
      variables: { input: { id: id } },
      fetchPolicy: 'no-cache',
    },
  )

  useEffect(() => {
    if (workingCaseData) {
      setWorkingCase(workingCaseData.case)
    }
  }, [workingCaseData])
  console.log(workingCase)
  return (
    <FormContext.Provider
      value={{ workingCase, setWorkingCase, isLoadingWorkingCase }}
    >
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider
