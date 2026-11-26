import type { FC } from 'react'
import { Fragment, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import {
  DEFENDER_INDICTMENT_CASE_ADD_FILES_ROUTE,
  DEFENDER_INDICTMENT_CASE_APPEAL_ROUTE,
  DEFENDER_INDICTMENT_CASE_STATEMENT_ROUTE,
  getStandardUserDashboardRoute,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Feature,
  hasFiledAppealStatement,
  isCompletedCase,
  isRulingOrDismissalCase,
  isSuccessfulServiceStatus,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components'
import {
  AllIndictmentCaseFiles,
  AlternativeServiceAnnouncement,
  AppealCourtSessionScheduledCard,
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
import { hasVerdictServiceDecision } from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/DefenderVerdictTimelineCard.logic'
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
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useAppealCase,
  useAppealCaseBanner,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useVerdict from '@island.is/judicial-system-web/src/utils/hooks/useVerdict'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  isCaseCivilClaimantSpokesperson,
  isCaseDefendantDefender,
  shouldDisplayGeneratedPdfFiles,
} from '@island.is/judicial-system-web/src/utils/utils'

import type { VerdictAppealAction } from './verdictAppealActions.logic'
import {
  canDefenderFileVerdictStatementOf,
  getVerdictAppealActions,
  isVerdictAppealOpen,
} from './verdictAppealActions.logic'

interface ServiceAnnouncementProps {
  defendant: Defendant
  subpoena: Subpoena
}

const ServiceAnnouncement: FC<ServiceAnnouncementProps> = (props) => {
  const { defendant, subpoena } = props

  const getTitle = (defendantName?: string | null): string => {
    const successMessage = serviceAnnouncementsStrings.serviceStatusSuccess

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
  // The defendant whose verdict appeal the user is about to withdraw, while the
  // confirmation is open.
  const [withdrawingAppealFor, setWithdrawingAppealFor] = useState<Defendant>()
  const { acceptVerdict, isAcceptingVerdict } = useVerdict()
  // The defendant whose verdict the user is about to accept, while the
  // confirmation is open.
  const [acceptingVerdictFor, setAcceptingVerdictFor] = useState<Defendant>()
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
  // there is no verdict timeline to show for a fine or a dismissal. Each
  // defendant's card also waits for the public prosecution office to decide
  // whether that verdict must be served (hasVerdictServiceDecision).
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

  const showReopenNotice =
    Boolean(workingCase.reopenReason) && !isCompletedCase(workingCase.state)

  const showVerdictStatusAlerts = Boolean(
    workingCase.defendants?.some((defendant) => defendant.verdict),
  )

  const showServiceNotices =
    !caseIsClosed &&
    Boolean(
      workingCase.defendants?.some(
        (defendant) =>
          Boolean(defendant.alternativeServiceDescription) ||
          Boolean(
            defendant.subpoenas?.some((subpoena) =>
              isSuccessfulServiceStatus(subpoena.serviceStatus),
            ),
          ),
      ),
    )

  const shouldShowDefenderVerdictTimelineCard = (
    defendant: Defendant,
  ): boolean => {
    if (!defendant.verdict) {
      return false
    }

    if (hasVerdictServiceDecision(defendant.verdict)) {
      return true
    }

    // Statement CTA / filed status without a service decision — keep the card
    // after filing so "Greinargerð send" remains visible.
    if (canDefenderFileVerdictStatementOf(workingCase, defendant, user)) {
      return true
    }

    const appeal = workingCase.verdictAppealCase
    if (!isVerdictAppealOpen(appeal)) {
      return false
    }

    // Landsréttur can record a statement without setting a portal deadline.
    return hasFiledAppealStatement(appeal?.appealEventLogs, {
      defendantId: defendant.id,
    })
  }

  const showVerdictTimelineCards =
    displayVerdictTimeline &&
    Boolean(
      workingCase.defendants?.some((defendant) =>
        shouldShowDefenderVerdictTimelineCard(defendant),
      ),
    )

  const showTopNotices =
    showReopenNotice ||
    showVerdictStatusAlerts ||
    showVerdictTimelineCards ||
    showServiceNotices

  // Appeal / withdraw / accept stay behind the service-decision gate. The card
  // can mount earlier for greinargerð, but widening those actions was not in
  // scope. Statement filing is separate.
  const getVerdictTimelineMenuItems = (
    defendant: Defendant,
  ): ContextMenuItem[] => {
    const menuItems: Record<VerdictAppealAction, ContextMenuItem> = {
      APPEAL: {
        title: 'Áfrýja dómi',
        onClick: () =>
          router.push(
            `${DEFENDER_INDICTMENT_CASE_APPEAL_ROUTE}/${workingCase.id}?defendantId=${defendant.id}`,
          ),
      },
      ACCEPT: {
        title: 'Una dómi',
        onClick: () => setAcceptingVerdictFor(defendant),
      },
      WITHDRAW: {
        title: 'Afturkalla áfrýjun',
        onClick: () => setWithdrawingAppealFor(defendant),
      },
    }

    const items: ContextMenuItem[] = []

    if (hasVerdictServiceDecision(defendant.verdict)) {
      items.push(
        ...getVerdictAppealActions(
          workingCase,
          defendant,
          user,
          features.includes(Feature.INDICTMENT_APPEAL),
        ).map((action) => menuItems[action]),
      )
    }

    if (canDefenderFileVerdictStatementOf(workingCase, defendant, user)) {
      items.push({
        title: 'Senda greinargerð',
        onClick: () =>
          router.push(
            `${DEFENDER_INDICTMENT_CASE_STATEMENT_ROUTE}/${workingCase.id}?defendantId=${defendant.id}`,
          ),
      })
    }

    return items
  }

  const handleAcceptVerdict = async () => {
    if (!acceptingVerdictFor) {
      return
    }

    const accepted = await acceptVerdict(workingCase.id, acceptingVerdictFor.id)

    if (!accepted) {
      return
    }

    setAcceptingVerdictFor(undefined)
    // The card reads the defendant's position off the verdict, so the whole
    // case is reloaded.
    refreshCase()
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
              ? formatMessage(
                  {
                    id: titles.shared.closedCaseOverview,
                    defaultMessage: titles.shared.closedCaseOverview,
                  },
                  {
                    courtCaseNumber: workingCase.courtCaseNumber,
                  },
                )
              : titles.court.indictments.overview
          }
        />
        <FormContentContainer>
          <PageTitle>{caseIsClosed ? 'Máli lokið' : 'Yfirlit ákæru'}</PageTitle>
          <CourtCaseInfo workingCase={workingCase} />
          <div className={stack({ gap: 5 })}>
            {showTopNotices && (
              <div className={stack({ gap: 2 })}>
                {showReopenNotice && (
                  <AlertMessage
                    title="Mál enduropnað"
                    message={
                      <Text variant="small" whiteSpace="preWrap">
                        {workingCase.reopenReason}
                      </Text>
                    }
                    type="info"
                  />
                )}
                {workingCase.defendants?.map(
                  (defendant) =>
                    defendant.verdict && (
                      <VerdictStatusAlert
                        key={`${defendant.id}${defendant.verdict.id}`}
                        defendant={defendant}
                        verdict={defendant.verdict}
                      />
                    ),
                )}
                {displayVerdictTimeline &&
                  workingCase.defendants?.map(
                    (defendant) =>
                      shouldShowDefenderVerdictTimelineCard(defendant) && (
                        <Box
                          key={`${defendant.id}${defendant.verdict?.id}-timeline`}
                          dataTestId="defenderVerdictTimelineCard"
                        >
                          <DefenderVerdictTimelineCard
                            defendant={defendant}
                            verdictAppealCase={workingCase.verdictAppealCase}
                            contextMenuItems={getVerdictTimelineMenuItems(
                              defendant,
                            )}
                          />
                        </Box>
                      ),
                  )}
                {!caseIsClosed &&
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
                          <ServiceAnnouncement
                            key={`${defendant.id}${subpoena.id}`}
                            defendant={defendant}
                            subpoena={subpoena}
                          />
                        ))}
                    </Fragment>
                  ))}
              </div>
            )}
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
            <AppealCourtSessionScheduledCard
              verdictAppealCase={workingCase.verdictAppealCase}
            />
            <Box component="section">
              {caseIsClosed ? (
                <InfoCardClosedIndictment />
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
            {workingCase.verdictAppealCase?.appealState ===
              AppealCaseState.COMPLETED &&
              workingCase.verdictAppealCase.appealConclusion && (
                <Conclusion
                  title="Dómsorð Landsréttar"
                  conclusionText={
                    workingCase.verdictAppealCase.appealConclusion
                  }
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
            <Box component="section">
              <ZipButton
                caseId={workingCase.id}
                courtCaseNumber={workingCase.courtCaseNumber}
                policeCaseNumbers={workingCase.policeCaseNumbers}
              />
            </Box>
          </div>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter previousUrl={getStandardUserDashboardRoute(user)} />
        </FormContentContainer>
        {appealModals}
        <AnimatePresence>
          {acceptingVerdictFor && (
            <Modal
              title="Una dómi"
              text={`Ertu viss um að þú viljir skrá að ${
                acceptingVerdictFor.name ?? 'dómfelldi'
              } unir dómi? Ríkissaksóknari fær tilkynningu.`}
              buttons={[
                {
                  text: 'Hætta við',
                  onClick: () => setAcceptingVerdictFor(undefined),
                  variant: 'ghost',
                },
                { text: 'Já, una dómi', onClick: handleAcceptVerdict },
              ]}
              onClose={() => setAcceptingVerdictFor(undefined)}
              loading={isAcceptingVerdict}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
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
                },
              ]}
              onClose={() => setWithdrawingAppealFor(undefined)}
              loading={isTransitioningAppealCase}
            />
          )}
        </AnimatePresence>
      </PageLayout>
    </>
  )
}

export default IndictmentOverview
