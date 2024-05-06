import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isDefenceUser,
  isDistrictCourtUser,
  isPublicProsecutorUser,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  InfoCardCaseScheduledIndictment,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import ReturnIndictmentModal from '../../Court/Indictments/ReturnIndictmentCaseModal/ReturnIndictmentCaseModal'
import { IndictmentOverview as PublicProsecutorIndictmentOverview } from '../../PublicProsecutor/Indictments/Overview/IndictmentOverview'
import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound, setWorkingCase } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const caseIsClosed = isCompletedCase(workingCase.state)
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  if (isPublicProsecutorUser(user)) {
    return <PublicProsecutorIndictmentOverview />
  } else
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
            caseIsClosed
              ? formatMessage(titles.shared.closedCaseOverview, {
                  courtCaseNumber: workingCase.courtCaseNumber,
                })
              : formatMessage(titles.court.indictments.overview)
          }
        />
        <FormContentContainer>
          <PageTitle>
            {caseIsClosed
              ? formatMessage(strings.completedTitle)
              : formatMessage(strings.inProgressTitle)}
          </PageTitle>
          <CourtCaseInfo workingCase={workingCase} />
          {workingCase.state === CaseState.RECEIVED &&
            workingCase.court &&
            latestDate?.date && (
              <Box component="section" marginBottom={5}>
                <InfoCardCaseScheduledIndictment
                  court={workingCase.court}
                  courtDate={latestDate.date}
                  courtRoom={latestDate.location}
                  postponedIndefinitelyExplanation={
                    workingCase.postponedIndefinitelyExplanation
                  }
                />
              </Box>
            )}
          <Box component="section" marginBottom={5}>
            {caseIsClosed ? (
              <InfoCardClosedIndictment />
            ) : (
              <InfoCardActiveIndictment />
            )}
          </Box>
          {lawsBroken.size > 0 && (
            <Box marginBottom={5}>
              <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
            </Box>
          )}
          {workingCase.caseFiles && (
            <Box component="section" marginBottom={10}>
              <IndictmentCaseFilesList workingCase={workingCase} />
            </Box>
          )}
        </FormContentContainer>
        {!caseIsClosed && !isDefenceUser(user) && (
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
              actionButtonText={formatMessage(
                strings.returnIndictmentButtonText,
              )}
              actionButtonColorScheme={'destructive'}
              actionButtonIsDisabled={!workingCase.courtCaseNumber}
              onActionButtonClick={() => setModalVisible(true)}
            />
          </FormContentContainer>
        )}
        {isDistrictCourtUser(user) && modalVisible && (
          <ReturnIndictmentModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            onClose={() => setModalVisible(false)}
            onComplete={() => router.push(constants.CASES_ROUTE)}
          />
        )}
      </PageLayout>
    )
}

export default IndictmentOverview
