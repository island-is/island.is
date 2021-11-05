import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import type { Case } from '@island.is/judicial-system/types'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import RulingStepOneForm from './RulingStepOneForm'

const RulingStepOne = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const router = useRouter()
  const id = router.query.id

  const { autofill } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      if (data.case.caseFacts) {
        autofill('courtCaseFacts', data.case.caseFacts, data.case)
      }

      if (data.case.legalArguments) {
        autofill('courtLegalArguments', data.case.legalArguments, data.case)
      }

      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data, autofill])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase && (
        <RulingStepOneForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          isLoading={loading}
        />
      )}
    </PageLayout>
  )
}

export default RulingStepOne
