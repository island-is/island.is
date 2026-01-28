import { FC, Fragment, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Accordion,
  AlertMessage,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDefenceUser,
  isProsecutionUser,
  isRulingOrDismissalCase,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  AlternativeServiceAnnouncement,
  BlueBox,
  Conclusion,
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
  MarkdownWrapper,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  serviceAnnouncementsStrings,
  useIndictmentsLawsBroken,
  UserContext,
  ZipButton,
} from '@island.is/judicial-system-web/src/components'
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  Defendant,
  IndictmentDecision,
  ServiceStatus,
  Subpoena,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  isCaseCivilClaimantSpokesperson,
  isCaseDefendantDefender,
  shouldDisplayGeneratedPdfFiles,
} from '@island.is/judicial-system-web/src/utils/utils'

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
      serviceAnnouncementsStrings.serviceStatusSuccess,
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

  const hasLawsBroken = lawsBroken.size > 0
  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

  const displayGeneratedPDFs = shouldDisplayGeneratedPdfFiles(workingCase, user)

  const isReviewMissing = workingCase.defendants?.some(
    (defendant) => !defendant.indictmentReviewDecision,
  )

  const shouldDisplayReviewDecision =
    isCompletedCase(workingCase.state) &&
    workingCase.indictmentReviewer?.id === user?.id &&
    Boolean(isReviewMissing)

  const canAddFiles =
    !isCompletedCase(workingCase.state) &&
    isDefenceUser(user) &&
    (isCaseDefendantDefender(user, workingCase) ||
      isCaseCivilClaimantSpokesperson(user, workingCase)) &&
    workingCase.indictmentDecision !==
      IndictmentDecision.POSTPONING_UNTIL_VERDICT

  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const indictmentAppealDeadlineIsInThePast =
    workingCase.indictmentVerdictAppealDeadlineExpired ?? false

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
        {workingCase.rulingModifiedHistory && (
          <AlertMessage
            type="info"
            title="Mál leiðrétt"
            message={
              <MarkdownWrapper
                markdown={workingCase.rulingModifiedHistory}
                textProps={{ variant: 'small' }}
              />
            }
          />
        )}
        {workingCase.defendants?.map(
          (defendant) =>
            defendant.verdict && (
              <Box
                key={`${defendant.id}${defendant.verdict.id}`}
                marginBottom={2}
              >
                <VerdictStatusAlert
                  defendant={defendant}
                  verdict={defendant.verdict}
                />
              </Box>
            ),
        )}
        {isDefenceUser(user) &&
          workingCase.defendants?.map((defendant) => (
            <Fragment key={defendant.id}>
              {defendant.alternativeServiceDescription && (
                <AlternativeServiceAnnouncement
                  alternativeServiceDescription={
                    defendant.alternativeServiceDescription
                  }
                  defendantName={defendant.name}
                />
              )}
              {defendant.subpoenas
                ?.filter((subpoena) =>
                  isSuccessfulServiceStatus(subpoena.serviceStatus),
                )
                .map((subpoena) => (
                  <Box key={`${defendant.id}${subpoena.id}`} marginBottom={2}>
                    <ServiceAnnouncement
                      defendant={defendant}
                      subpoena={subpoena}
                    />
                  </Box>
                ))}
            </Fragment>
          ))}
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          {caseHasBeenReceivedByCourt &&
            workingCase.court &&
            latestDate?.date &&
            workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
            workingCase.indictmentDecision !==
              IndictmentDecision.REDISTRIBUTING && (
              <Box component="section">
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
          <Box component="section">
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
          {isCompletedCase(workingCase.state) &&
            isRulingOrDismissalCase(workingCase.indictmentRulingDecision) && (
              <Conclusion
                title={`${
                  workingCase.indictmentRulingDecision ===
                  CaseIndictmentRulingDecision.RULING
                    ? 'Dóms'
                    : 'Úrskurðar'
                }orð héraðsdóms`}
                conclusionText={workingCase.courtSessions?.at(-1)?.ruling}
                judgeName={workingCase.judge?.name}
              />
            )}
          {(hasLawsBroken || hasMergeCases) && (
            <Box>
              {/* 
            NOTE: Temporarily hidden while list of laws broken is not complete in
            indictment cases
            
            {hasLawsBroken && (
              <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
            )} */}
              {hasMergeCases && (
                <Accordion dividerOnBottom={false} dividerOnTop={false}>
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
          <Box component="section">
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
            <section>
              <SectionHeading
                title={`Ákvörðun um ${isFine ? 'kæru' : 'áfrýjun'}`}
                description={
                  <Text variant="eyebrow" as="span">
                    {`Frestur til að ${
                      isFine ? 'kæra viðurlagaákvörðun' : 'áfrýja dómi'
                    } ${
                      indictmentAppealDeadlineIsInThePast ? 'rann' : 'rennur'
                    } út ${formatDate(workingCase.indictmentAppealDeadline)}`}
                  </Text>
                }
              />
              {workingCase.defendants && (
                <div className={grid({ gap: 3 })}>
                  {workingCase.defendants.map((defendant) => (
                    <BlueBox key={`${defendant.id}_review_decision`}>
                      <SectionHeading
                        title={defendant.name ?? ''}
                        variant="h4"
                        marginBottom={2}
                        required
                      />
                      <ReviewDecision
                        caseId={workingCase.id}
                        defendant={defendant}
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        isFine={
                          workingCase.indictmentRulingDecision ===
                          CaseIndictmentRulingDecision.FINE
                        }
                      />
                    </BlueBox>
                  ))}
                </div>
              )}
            </section>
          )}
          {isDefenceUser(user) && isCompletedCase(workingCase.state) && (
            <Box component="section">
              <ZipButton
                caseId={workingCase.id}
                courtCaseNumber={workingCase.courtCaseNumber}
              />
            </Box>
          )}
          {isProsecutionUser(user) && (
            <Box component="section">
              <InputPenalties />
            </Box>
          )}
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={getStandardUserDashboardRoute(user)}
          hideNextButton={!shouldDisplayReviewDecision}
          nextButtonText={formatMessage(strings.completeReview)}
          onNextButtonClick={() => setModalVisible(CONFIRM_PROSECUTOR_DECISION)}
          nextIsDisabled={isReviewMissing}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
