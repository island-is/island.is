import { FC, Fragment, useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isRulingOrDismissalCase,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  AllIndictmentCaseFiles,
  AlternativeServiceAnnouncement,
  Conclusion,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseScheduledCard,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  MarkdownWrapper,
  PageHeader,
  PageLayout,
  PageTitle,
  serviceAnnouncementsStrings,
  UserContext,
  ZipButton,
} from '@island.is/judicial-system-web/src/components'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  Defendant,
  IndictmentDecision,
  ServiceStatus,
  Subpoena,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useAppealCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  isCaseCivilClaimantSpokesperson,
  isCaseDefendantDefender,
  shouldDisplayGeneratedPdfFiles,
} from '@island.is/judicial-system-web/src/utils/utils'

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
        ? 'Rafrænt pósthólf island.is'
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
  const { appealBanner, appealModals } = useAppealCase()
  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseIsClosed = isCompletedCase(workingCase.state)

  const displayGeneratedPDFs = shouldDisplayGeneratedPdfFiles(workingCase, user)

  const canAddFiles =
    !caseIsClosed &&
    workingCase.indictmentDecision !==
      IndictmentDecision.POSTPONING_UNTIL_VERDICT &&
    (isCaseDefendantDefender(user, workingCase) ||
      isCaseCivilClaimantSpokesperson(user, workingCase))

  const shouldDisplayAppealBanner =
    workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.DISMISSAL &&
    (workingCase.canBeAppealed ||
      workingCase.hasBeenAppealed ||
      workingCase.appealCase?.appealState === AppealCaseState.COMPLETED ||
      workingCase.appealCase?.appealState === AppealCaseState.WITHDRAWN)

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  return (
    <>
      {shouldDisplayAppealBanner && appealBanner}
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
          <PageTitle>{caseIsClosed ? 'Máli lokið' : 'Yfirlit ákæru'}</PageTitle>
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
          {workingCase.defendants?.map((defendant) => (
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
              workingCase.indictmentDecision !==
                IndictmentDecision.COMPLETING &&
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
            {caseIsClosed &&
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
            <AllIndictmentCaseFiles
              displayGeneratedPDFs={displayGeneratedPDFs}
            />
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
                  Bæta við gögnum
                </Button>
              </Box>
            )}
            {caseIsClosed && (
              <Box component="section">
                <ZipButton
                  caseId={workingCase.id}
                  courtCaseNumber={workingCase.courtCaseNumber}
                />
              </Box>
            )}
          </div>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            hideNextButton
          />
        </FormContentContainer>
        {appealModals}
      </PageLayout>
    </>
  )
}

export default IndictmentOverview
