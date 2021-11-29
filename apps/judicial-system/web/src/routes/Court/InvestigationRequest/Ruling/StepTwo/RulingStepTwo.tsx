import React, { useEffect, useState } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useRouter } from 'next/router'
import RulingStepTwoForm from './RulingStepTwoForm'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

const RulingStepTwo = () => {
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
      if (isAcceptingCaseDecision(data.case.decision) && data.case.demands) {
        autofill('conclusion', data.case.demands, data.case)
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
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase && (
        <RulingStepTwoForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          isLoading={loading}
        />
      )}
    </PageLayout>
  )
}

export default RulingStepTwo
