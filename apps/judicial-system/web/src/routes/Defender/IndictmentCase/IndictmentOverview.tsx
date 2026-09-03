import type { FC } from 'react'
import { Fragment, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import {
  DEFENDER_INDICTMENT_CASE_ADD_FILES_ROUTE,
  DEFENDER_INDICTMENT_CASE_APPEAL_ROUTE,
  getStandardUserDashboardRoute,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Feature,
  isCompletedCase,
  isRulingOrDismissalCase,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components'
import {
  AllIndictmentCaseFiles,
  AlternativeServiceAnnouncement,
  AppealRulingModifiedAlert,
  Conclusion,
  CourtCaseInfo,
  DefenderVerdictTimelineCard,
  FeatureContext,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseScheduledCard,
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  RulingModifiedAlert,
  serviceAnnouncementsStrings,
  UserContext,
  VerdictAppealFiles,
  ZipButton,
} from '@island.is/judicial-system-web/src/components'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import type {
  Defendant,
  Subpoena,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealCaseTransition,
  CaseIndictmentRulingDecision,
  CaseState,
  IndictmentDecision,
  ServiceStatus,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useAppealCase,
  useAppealCaseBanner,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  isCaseCivilClaimantSpokesperson,
  isCaseDefendantDefender,
  shouldDisplayGeneratedPdfFiles,
} from '@island.is/judicial-system-web/src/utils/utils'

import { getVerdictAppealAction } from './verdictAppealActions.logic'

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

    return [processServer, formatDate(serviceDate, 'dd.MM.y HH:mm')]
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
  const { workingCase, isLoadingWorkingCase, caseNotFound, refreshCase } =
    useContext(FormContext)

  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { appealBanner, appealModals } = useAppealCaseBanner()
  const { transitionAppealCase, isTransitioningAppealCase } = useAppealCase()
  // The defendant whose áfrýjun the user is about to withdraw, while the
  // confirmation is open.
  const [withdrawingAppealFor, setWithdrawingAppealFor] = useState<Defendant>()
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

  // Defence users get the same verdict service and appeal information the
  // public prosecution office has, but only on a case that ended in a verdict -
  // there is no verdict timeline to show for a fine or a dismissal.
  const displayVerdictTimeline =
    caseIsClosed &&
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

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

  // The one appeal action the verdict timeline card offers for a defendant:
  // file an áfrýjun, or take back the one this defender filed. Which, if either,
  // is decided by getVerdictAppealAction.
  const getVerdictTimelineMenuItems = (
    defendant: Defendant,
  ): ContextMenuItem[] => {
    const action = getVerdictAppealAction(
      workingCase,
      defendant,
      user,
      features.includes(Feature.INDICTMENT_APPEAL),
    )

    switch (action) {
      case 'APPEAL':
        return [
          {
            title: 'Áfrýja dómi',
            onClick: () =>
              router.push(
                `${DEFENDER_INDICTMENT_CASE_APPEAL_ROUTE}/${workingCase.id}?defendantId=${defendant.id}`,
              ),
          },
        ]
      case 'WITHDRAW':
        return [
          {
            title: 'Afturkalla áfrýjun',
            onClick: () => setWithdrawingAppealFor(defendant),
          },
        ]
      default:
        return []
    }
  }

  const handleWithdrawVerdictAppeal = async () => {
    const appealCaseId = workingCase.verdictAppealCase?.id

    if (!withdrawingAppealFor || !appealCaseId) {
      return
    }

    const withdrawn = await transitionAppealCase(
      workingCase.id,
      appealCaseId,
      AppealCaseTransition.WITHDRAW_APPEAL,
      undefined,
      withdrawingAppealFor.id,
    )

    if (!withdrawn) {
      return
    }

    setWithdrawingAppealFor(undefined)
    // The card reads the per-defendant appeal date off the verdict, which the
    // backend clears on withdrawal, so the whole case is reloaded.
    refreshCase()
  }

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
          {workingCase.reopenReason && !isCompletedCase(workingCase.state) && (
            <Box marginBottom={2}>
              <AlertMessage
                title="Mál enduropnað"
                message={
                  <Text variant="small" whiteSpace="preWrap">
                    {workingCase.reopenReason}
                  </Text>
                }
                type="info"
              />
            </Box>
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
          {displayVerdictTimeline &&
            workingCase.defendants?.map(
              (defendant) =>
                defendant.verdict && (
                  <Box
                    key={`${defendant.id}${defendant.verdict.id}-timeline`}
                    marginBottom={2}
                    dataTestId="defenderVerdictTimelineCard"
                  >
                    <DefenderVerdictTimelineCard
                      defendant={defendant}
                      contextMenuItems={getVerdictTimelineMenuItems(defendant)}
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
            <AppealRulingModifiedAlert />
            <RulingModifiedAlert />
            {caseHasBeenReceivedByCourt &&
              workingCase.court &&
              latestDate?.date &&
              workingCase.indictmentDecision !==
                IndictmentDecision.COMPLETING &&
              workingCase.indictmentDecision !==
                IndictmentDecision.REDISTRIBUTING &&
              caseIsClosed === false && (
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
            {workingCase.appealCase?.appealState ===
              AppealCaseState.COMPLETED &&
              workingCase.appealCase?.appealConclusion && (
                <Conclusion
                  title="Úrskurðarorð Landsréttar"
                  conclusionText={workingCase.appealCase?.appealConclusion}
                />
              )}
            {displayVerdictTimeline && <VerdictAppealFiles />}
            <AllIndictmentCaseFiles
              displayGeneratedPDFs={displayGeneratedPDFs}
              forceDisplayAdditionalFiles={canAddFiles}
            />
            {canAddFiles && (
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  size="small"
                  icon="add"
                  onClick={() =>
                    router.push(
                      `${DEFENDER_INDICTMENT_CASE_ADD_FILES_ROUTE}/${workingCase.id}`,
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
          <FormFooter previousUrl={getStandardUserDashboardRoute(user)} />
        </FormContentContainer>
        {appealModals}
        {withdrawingAppealFor && (
          <Modal
            title="Afturkalla áfrýjun"
            text={`Ertu viss um að þú viljir afturkalla áfrýjun dóms fyrir ${
              withdrawingAppealFor.name ?? 'dómfellda'
            }?`}
            buttons={[
              {
                text: 'Hætta við',
                onClick: () => setWithdrawingAppealFor(undefined),
                variant: 'ghost',
              },
              {
                text: 'Afturkalla',
                onClick: handleWithdrawVerdictAppeal,
                colorScheme: 'destructive',
                isLoading: isTransitioningAppealCase,
              },
            ]}
          />
        )}
      </PageLayout>
    </>
  )
}

export default IndictmentOverview
