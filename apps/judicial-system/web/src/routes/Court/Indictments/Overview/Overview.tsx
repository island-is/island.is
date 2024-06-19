import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCard,
  InfoCardActiveIndictment,
  InfoCardCaseScheduledIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  useIndictmentsLawsBroken,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import ReturnIndictmentModal from '../ReturnIndictmentCaseModal/ReturnIndictmentCaseModal'
import { strings } from './Overview.strings'

const IndictmentOverview = () => {
  const router = useRouter()
  const { workingCase, isLoadingWorkingCase, caseNotFound, setWorkingCase } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const [modalVisible, setModalVisible] = useState<'RETURN_INDICTMENT'>()

  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED

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
      <PageHeader title={formatMessage(titles.court.indictments.overview)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.inProgressTitle)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.indictmentDecision ===
          IndictmentDecision.POSTPONING_UNTIL_VERDICT && (
          <Box component="section" marginBottom={5}>
            {workingCase.courtDate &&
            workingCase.courtDate.date &&
            workingCase.court ? (
              <InfoCardCaseScheduledIndictment
                court={workingCase.court}
                courtDate={workingCase.courtDate.date}
                courtRoom={workingCase.courtDate.location}
              />
            ) : (
              <InfoCard
                data={[
                  {
                    title: formatMessage(strings.scheduledInfoCardTitle),
                    value: (
                      <Text marginTop={2}>
                        {formatMessage(strings.scheduledInfoCardValue)}
                      </Text>
                    ),
                  },
                ]}
                icon="calendar"
              />
            )}
          </Box>
        )}
        {workingCase.indictmentDecision === IndictmentDecision.POSTPONING &&
          workingCase.court &&
          latestDate &&
          latestDate.date && (
            <Box component="section" marginBottom={5}>
              <InfoCardCaseScheduledIndictment
                court={workingCase.court}
                courtDate={latestDate?.date}
                courtRoom={latestDate?.location}
                postponedIndefinitelyExplanation={
                  workingCase.postponedIndefinitelyExplanation
                }
              />
            </Box>
          )}
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment />
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
          actionButtonText={formatMessage(strings.returnIndictmentButtonText)}
          actionButtonColorScheme={'destructive'}
          actionButtonIsDisabled={!caseHasBeenReceivedByCourt}
          onActionButtonClick={() => setModalVisible('RETURN_INDICTMENT')}
        />
      </FormContentContainer>
      {modalVisible === 'RETURN_INDICTMENT' && (
        <ReturnIndictmentModal
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          onClose={() => setModalVisible(undefined)}
          onComplete={() => router.push(constants.CASES_ROUTE)}
        />
      )}
    </PageLayout>
  )
}

export default IndictmentOverview
