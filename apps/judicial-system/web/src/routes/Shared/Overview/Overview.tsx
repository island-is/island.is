import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles, core } from '@island.is/judicial-system-web/messages'
import { Box } from '@island.is/island-ui/core'
import { completedCaseStates } from '@island.is/judicial-system/types'
import IndictmentCaseFilesList from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import * as constants from '@island.is/judicial-system/consts'

import { overview as m } from './Overview.strings'

const Overview = () => {
  const router = useRouter()
  const id = router.query.id
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()

  const caseIsClosed = completedCaseStates.includes(workingCase.state)
  const isDefender = router.pathname.includes(constants.DEFENDER_ROUTE)

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={caseIsClosed ? Sections.CASE_CLOSED : Sections.JUDGE}
      activeSubSection={
        isDefender ? undefined : IndictmentsCourtSubsections.JUDGE_OVERVIEW
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={
          completedCaseStates.includes(workingCase.state)
            ? formatMessage(titles.shared.closedCaseOverview, {
                courtCaseNumber: workingCase.courtCaseNumber,
              })
            : formatMessage(titles.court.indictments.overview)
        }
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          {caseIsClosed ? (
            <InfoCardClosedIndictment />
          ) : (
            <InfoCardActiveIndictment />
          )}
        </Box>
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={10}>
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
      </FormContentContainer>
      {!caseIsClosed && !isDefender && (
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={`${constants.CASES_ROUTE}`}
            nextIsLoading={isLoadingWorkingCase}
            nextUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`}
            nextButtonText={formatMessage(core.continue)}
          />
        </FormContentContainer>
      )}
    </PageLayout>
  )
}

export default Overview
