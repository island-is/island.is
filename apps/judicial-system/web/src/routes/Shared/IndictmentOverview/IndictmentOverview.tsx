import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion, AlertMessage, Box, Button } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  formatDate,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDefenceUser,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  ConnectedCaseFilesAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentCaseScheduledCard,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  serviceAnnouncementStrings,
  useIndictmentsLawsBroken,
  UserContext,
  ZipButton,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  Defendant,
  IndictmentDecision,
  ServiceStatus,
  Subpoena,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { shouldDisplayGeneratedPdfFiles } from '@island.is/judicial-system-web/src/utils/utils'

import { ReviewDecision } from '../../PublicProsecutor/components/ReviewDecision/ReviewDecision'
import {
  CONFIRM_PROSECUTOR_DECISION,
  ConfirmationModal,
} from '../../PublicProsecutor/components/utils'
import { strings } from './IndictmentOverview.strings'

interface ServiceAnnouncementProps {
  defendant: Defendant
  subpoena: Subpoena
}

const ServiceAnnouncement: FC<ServiceAnnouncementProps> = (props) => {
  const { defendant, subpoena } = props
  const { formatMessage } = useIntl()

  const getTitle = (defendantName?: string | null): string => {
    const successMessage = formatMessage(
      serviceAnnouncementStrings.serviceStatusSuccess,
    )

    return defendantName
      ? `${successMessage} - ${defendantName}`
      : successMessage
  }

  const getMessage = (
    servedBy?: string | null,
    serviceDate?: string | null,
    serviceStatus?: ServiceStatus | null,
  ): string => {
    const processServer =
      serviceStatus === ServiceStatus.ELECTRONICALLY
        ? formatMessage(strings.servedToElectronically)
        : servedBy

    return [processServer, formatDate(serviceDate, 'Pp')]
      .filter(Boolean)
      .join(', ')
  }

  return (
    <AlertMessage
      type="success"
      title={getTitle(defendant.name)}
      message={getMessage(
        subpoena.servedBy,
        subpoena.serviceDate,
        subpoena.serviceStatus,
      )}
    />
  )
}

const IndictmentOverview: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseIsClosed = isCompletedCase(workingCase.state)

  const [modalVisible, setModalVisible] = useState<
    ConfirmationModal | undefined
  >()
  const [isReviewDecisionSelected, setIsReviewDecisionSelected] =
    useState(false)

  const hasLawsBroken = lawsBroken.size > 0
  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

  const displayGeneratedPDFs = shouldDisplayGeneratedPdfFiles(workingCase, user)

  const shouldDisplayReviewDecision =
    isCompletedCase(workingCase.state) &&
    workingCase.indictmentReviewer?.id === user?.id &&
    Boolean(!workingCase.indictmentReviewDecision)

  const canAddFiles =
    !isCompletedCase(workingCase.state) &&
    isDefenceUser(user) &&
    workingCase.defendants?.some(
      (defendant) =>
        defendant?.defenderNationalId &&
        normalizeAndFormatNationalId(user?.nationalId).includes(
          defendant.defenderNationalId,
        ),
    ) &&
    workingCase.indictmentDecision !==
      IndictmentDecision.POSTPONING_UNTIL_VERDICT

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
        <Box marginBottom={10}>
          <PageTitle>
            {caseIsClosed
              ? formatMessage(strings.completedTitle)
              : formatMessage(strings.inProgressTitle)}
          </PageTitle>
          <CourtCaseInfo workingCase={workingCase} />
          {isDefenceUser(user) &&
            workingCase.defendants?.map((defendant) =>
              (defendant.subpoenas ?? [])
                .filter((subpoena) =>
                  isSuccessfulServiceStatus(subpoena.serviceStatus),
                )
                .map((subpoena) => (
                  <Box key={`${defendant.id}${subpoena.id}`} marginBottom={2}>
                    <ServiceAnnouncement
                      defendant={defendant}
                      subpoena={subpoena}
                    />
                  </Box>
                )),
            )}
          {caseHasBeenReceivedByCourt &&
            workingCase.court &&
            latestDate?.date &&
            workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
            workingCase.indictmentDecision !==
              IndictmentDecision.REDISTRIBUTING && (
              <Box component="section" marginBottom={5}>
                <IndictmentCaseScheduledCard
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
            {caseIsClosed ? (
              <InfoCardClosedIndictment
                displayAppealExpirationInfo={
                  workingCase.indictmentRulingDecision ===
                    CaseIndictmentRulingDecision.RULING &&
                  (user?.role === UserRole.DEFENDER ||
                    workingCase.indictmentReviewer?.id === user?.id)
                }
                displayVerdictViewDate
              />
            ) : (
              <InfoCardActiveIndictment displayVerdictViewDate />
            )}
          </Box>
          {(hasLawsBroken || hasMergeCases) && (
            <Box marginBottom={5}>
              {/* 
            NOTE: Temporarily hidden while list of laws broken is not complete in
            indictment cases
            
            {hasLawsBroken && (
              <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
            )} */}
              {hasMergeCases && (
                <Accordion>
                  {workingCase.mergedCases?.map((mergedCase) => (
                    <Box key={mergedCase.id}>
                      <ConnectedCaseFilesAccordionItem
                        connectedCaseParentId={workingCase.id}
                        connectedCase={mergedCase}
                        displayGeneratedPDFs={displayGeneratedPDFs}
                      />
                    </Box>
                  ))}
                </Accordion>
              )}
            </Box>
          )}
          <Box component="section" marginBottom={5}>
            <IndictmentCaseFilesList
              workingCase={workingCase}
              displayGeneratedPDFs={displayGeneratedPDFs}
            />
          </Box>
          {canAddFiles && (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                size="small"
                icon="add"
                onClick={() =>
                  router.push(
                    `${constants.DEFENDER_ADD_FILES_ROUTE}/${workingCase.id}`,
                  )
                }
              >
                {formatMessage(strings.addDocumentsButtonText)}
              </Button>
            </Box>
          )}
          {shouldDisplayReviewDecision && (
            <ReviewDecision
              caseId={workingCase.id}
              indictmentAppealDeadline={
                workingCase.indictmentAppealDeadline ?? ''
              }
              indictmentAppealDeadlineIsInThePast={
                workingCase.indictmentVerdictAppealDeadlineExpired ?? false
              }
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              isFine={
                workingCase.indictmentRulingDecision ===
                CaseIndictmentRulingDecision.FINE
              }
              onSelect={() => setIsReviewDecisionSelected(true)}
            />
          )}
          {isDefenceUser(user) && isCompletedCase(workingCase.state) && (
            <Box marginTop={7}>
              <ZipButton
                caseId={workingCase.id}
                courtCaseNumber={workingCase.courtCaseNumber}
              />
            </Box>
          )}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.CASES_ROUTE}`}
          hideNextButton={!shouldDisplayReviewDecision}
          nextButtonText={formatMessage(strings.completeReview)}
          onNextButtonClick={() => setModalVisible(CONFIRM_PROSECUTOR_DECISION)}
          nextIsDisabled={!isReviewDecisionSelected}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
