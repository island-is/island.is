import React, { useCallback, useContext } from 'react'
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
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { titles, core } from '@island.is/judicial-system-web/messages'
import { Box } from '@island.is/island-ui/core'
import { completedCaseStates } from '@island.is/judicial-system/types'
import IndictmentCaseFilesList from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import * as constants from '@island.is/judicial-system/consts'

import { overview as m } from './Overview.strings'

const Overview = () => {
  const router = useRouter()
  const { limitedAccess } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()

  const caseIsClosed = completedCaseStates.includes(workingCase.state)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
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
      {!caseIsClosed && !limitedAccess && (
        <FormContentContainer isFooter>
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={`${constants.CASES_ROUTE}`}
            nextIsLoading={isLoadingWorkingCase}
            onNextButtonClick={() =>
              handleNavigationTo(
                constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
              )
            }
            nextButtonText={formatMessage(core.continue)}
          />
        </FormContentContainer>
      )}
    </PageLayout>
  )
}

export default Overview
