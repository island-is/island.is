import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'

import { AlertBanner } from '@island.is/judicial-system-web/src/components/AlertBanner'
import useAppealAlertBanner from '@island.is/judicial-system-web/src/utils/hooks/useAppealAlertBanner'
import * as constants from '@island.is/judicial-system/consts'

import CourtOfAppealCaseOverview from '../components/CaseOverView/CaseOverview'
import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'
import { titleForCase } from '../../Shared/SignedVerdictOverview/SignedVerdictOverview'

const CourtOfAppealOverview: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  const { title, description } = useAppealAlertBanner(workingCase)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  return (
    <>
      <AlertBanner variant="warning" title={title} description={description} />
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <CourtOfAppealCaseOverview />
          <CaseFilesOverview />
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={constants.COURT_OF_APPEAL_CASES_ROUTE}
            onNextButtonClick={() =>
              handleNavigationTo(constants.COURT_OF_APPEAL_CASE_ROUTE)
            }
            nextButtonIcon="arrowForward"
          />
        </FormContentContainer>
      </PageLayout>
    </>
  )
}

export default CourtOfAppealOverview
