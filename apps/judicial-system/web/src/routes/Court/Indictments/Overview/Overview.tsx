import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  ConnectedCaseFilesAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
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
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'

import { SubpoenaType } from '../../components'
import ReturnIndictmentModal from '../ReturnIndictmentCaseModal/ReturnIndictmentCaseModal'
import { strings } from './Overview.strings'

const IndictmentOverview = () => {
  const router = useRouter()
  const { workingCase, isLoadingWorkingCase, caseNotFound, setWorkingCase } =
    useContext(FormContext)
  const { updateDefendantState, updateDefendant } = useDefendants()

  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const [modalVisible, setModalVisible] = useState<'RETURN_INDICTMENT'>()

  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (workingCase.defendants) {
        const promises = workingCase.defendants.map((defendant) =>
          updateDefendant({
            caseId: workingCase.id,
            defendantId: defendant.id,
            subpoenaType: defendant.subpoenaType,
          }),
        )

        const allDataSentToServer = await Promise.all(promises)

        if (!allDataSentToServer.every(Boolean)) {
          return
        }
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [router, updateDefendant, workingCase.defendants, workingCase.id],
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
        {workingCase.court &&
          latestDate?.date &&
          workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
          workingCase.indictmentDecision !==
            IndictmentDecision.REDISTRIBUTING && (
            <Box component="section" marginBottom={5}>
              <InfoCardCaseScheduledIndictment
                court={workingCase.court}
                indictmentDecision={workingCase.indictmentDecision}
                courtDate={latestDate.date}
                courtRoom={latestDate.location}
                postponedIndefinitelyExplanation={
                  workingCase.postponedIndefinitelyExplanation
                }
                courtSessionType={workingCase.courtSessionType}
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
        {workingCase.mergedCases &&
          workingCase.mergedCases.length > 0 &&
          workingCase.mergedCases.map((mergedCase) => (
            <Box marginBottom={5} key={mergedCase.id}>
              <ConnectedCaseFilesAccordionItem connectedCase={mergedCase} />
            </Box>
          ))}
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={10}>
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
        {workingCase.defendants && (
          <Box component="section" marginBottom={5}>
            {
              <SubpoenaType
                defendants={workingCase.defendants}
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                updateDefendantState={updateDefendantState}
                required={false}
              />
            }
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
