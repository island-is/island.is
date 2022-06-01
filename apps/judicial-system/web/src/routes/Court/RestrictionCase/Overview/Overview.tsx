import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormFooter,
  PageLayout,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  ruling,
  rcCourtOverview,
} from '@island.is/judicial-system-web/messages'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import * as Constants from '@island.is/judicial-system/consts'

import OverviewForm from './OverviewForm'

export const JudgeOverview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id

  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)
  const { autofill } = useCase()

  useEffect(() => {
    if (isCaseUpToDate) {
      autofill(
        [
          {
            key: 'ruling',
            value: !workingCase.parentCase
              ? `\n${formatMessage(ruling.autofill, {
                  judgeName: workingCase.judge?.name,
                })}`
              : isAcceptingCaseDecision(workingCase.decision)
              ? workingCase.parentCase.ruling
              : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.JUDGE_OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.restrictionCases.overview)}
      />
      <OverviewForm workingCase={workingCase} setWorkingCase={setWorkingCase} />
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`}
          nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
          nextIsDisabled={uploadState === UploadState.UPLOADING}
          nextButtonText={formatMessage(rcCourtOverview.continueButton.label)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default JudgeOverview
