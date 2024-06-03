import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
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
  InfoCardClosedIndictment,
  Modal,
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

import ReturnIndictmentModal from '../ReturnIndictmentCaseModal/ReturnIndictmentCaseModal'
import { strings } from './Overview.strings'

const IndictmentOverview = () => {
  const router = useRouter()
  const { workingCase, isLoadingWorkingCase, caseNotFound, setWorkingCase } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const { updateDefendant } = useDefendants()
  const [modalVisible, setModalVisible] = useState<
    'RETURN_INDICTMENT' | 'SEND_TO_PUBLIC_PROSECUTOR'
  >()

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseIsClosed = workingCase.state === CaseState.COMPLETED

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
        {workingCase.indictmentDecision ===
          IndictmentDecision.POSTPONING_UNTIL_VERDICT && (
          <Box component="section" marginBottom={5}>
            <InfoCard
              data={[
                {
                  title: formatMessage(strings.scheduledInfoCardTitle),
                  value: formatMessage(strings.scheduledInfoCardValue),
                },
              ]}
              icon="calendar"
            />
          </Box>
        )}
        {caseHasBeenReceivedByCourt && workingCase.court && latestDate?.date && (
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
          <Box component="section" marginBottom={caseIsClosed ? 5 : 10}>
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
      </FormContentContainer>
      {caseIsClosed && (
        <FormContentContainer isFooter>
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={`${constants.CASES_ROUTE}`}
            nextIsLoading={isLoadingWorkingCase}
            onNextButtonClick={async () => {
              const promises = workingCase.defendants
                ? workingCase.defendants.map(async (defendant) => {
                    const updatedDefendant = await updateDefendant({
                      caseId: workingCase.id,
                      defendantId: defendant.id,
                      serviceRequirement: defendant.serviceRequirement,
                    })

                    return updatedDefendant
                  })
                : []

              const allDefendantsUpdated = await Promise.all(promises)

              if (allDefendantsUpdated.length > 0) {
                setModalVisible('SEND_TO_PUBLIC_PROSECUTOR')
              } else {
                toast.error(formatMessage(errors.updateDefendant))
              }
            }}
            nextButtonText={formatMessage(
              strings.sendToPublicProsecutorModalNextButtonText,
            )}
            nextIsDisabled={workingCase.defendants?.some(
              (defendant) => !defendant.serviceRequirement,
            )}
          />
        </FormContentContainer>
      )}
      {!caseIsClosed && (
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
            actionButtonIsDisabled={!workingCase.courtCaseNumber}
            onActionButtonClick={() => setModalVisible('RETURN_INDICTMENT')}
          />
        </FormContentContainer>
      )}
      {modalVisible === 'RETURN_INDICTMENT' && (
        <ReturnIndictmentModal
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          onClose={() => setModalVisible(undefined)}
          onComplete={() => router.push(constants.CASES_ROUTE)}
        />
      )}
      {modalVisible === 'SEND_TO_PUBLIC_PROSECUTOR' && (
        <Modal
          title={formatMessage(strings.sendToPublicProsecutorModalTitle)}
          text={formatMessage(strings.sendToPublicProsecutorModalText)}
          primaryButtonText={formatMessage(core.closeModal)}
          onPrimaryButtonClick={() => setModalVisible(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default IndictmentOverview
