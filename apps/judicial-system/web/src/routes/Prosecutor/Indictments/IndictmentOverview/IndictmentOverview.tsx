import type { FC } from 'react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  Feature,
  isCompletedCase,
  isProsecutionUser,
  isRulingOrDismissalCase,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  AllIndictmentCaseFiles,
  AppealRulingModifiedAlert,
  BlueBox,
  Conclusion,
  CourtCaseInfo,
  DuplicateIndictmentModal,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseScheduledCard,
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  RulingModifiedAlert,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  isVerdictAppealPastReview,
  standingProsecutionAppealDefendantIds,
} from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/prosecutionVerdictAppeal.logic'
import ReviewerVerdictTimelineCard from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/ReviewerVerdictTimelineCard'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  IndictmentDecision,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReviewDecision } from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/ReviewDecision/ReviewDecision'
import type { ReviewDecisions } from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/ReviewDecision/ReviewDecision.logic'
import { getChangedReviewDecisions } from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/ReviewDecision/ReviewDecision.logic'
import { ReviewDecisionModal } from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/ReviewDecision/ReviewDecisionModal'
import type { ModalId } from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/utils'
import {
  CONFIRM_PROSECUTOR_DECISION,
  DUPLICATE_INDICTMENT,
  isConfirmProsecutorDecisionModal,
  isDuplicateIndictmentModal,
} from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/utils'
import { useAppealCaseBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { strings } from './IndictmentOverview.strings'

const IndictmentOverview: FC = () => {
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const { features } = useContext(FeatureContext)
  const router = useRouter()

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseIsClosed = isCompletedCase(workingCase.state)

  const shouldDisplayReviewDecision =
    caseIsClosed && workingCase.indictmentReviewer?.id === user?.id

  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const isRuling =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

  const indictmentAppealDeadlineIsInThePast =
    workingCase.indictmentVerdictAppealDeadlineExpired ?? false

  // With verdict appeals on, the reviewer's decision is the appeal: confirming
  // it files one for every defendant it was made for. Off, the decision is
  // saved and nothing else happens, exactly as before. Only a ruling can be
  // appealed this way - a fine is a ruling order appeal, and its own ticket.
  const registersVerdictAppeal =
    isRuling && features.includes(Feature.INDICTMENT_APPEAL)

  // Once the appeal has moved past the reviewer - received by the court of
  // appeals, and completed after it - the decision that made it is no longer
  // theirs to change. The backend refuses it too; this keeps the page from
  // offering what would be refused.
  const isReviewDecisionLocked = isVerdictAppealPastReview(
    workingCase.verdictAppealCase,
  )

  // Defendants whose indictment was cancelled or dismissed (completed for some)
  // do not receive a verdict, so no review decision is required for them.
  const defendantsRequiringReview = useMemo(
    () =>
      workingCase.defendants?.filter(
        (defendant) => !defendant.indictmentCancelledOrDismissedState,
      ),
    [workingCase.defendants],
  )

  const isReviewMissing = defendantsRequiringReview?.some(
    (defendant) => !defendant.indictmentReviewDecision,
  )

  const [modalVisible, setModalVisible] = useState<ModalId | undefined>()

  // A revoked indictment (withdrawn by the prosecution or cancelled by the
  // court) can be copied into a new draft case by the prosecution
  const canDuplicateIndictment =
    isProsecutionUser(user) &&
    caseIsClosed &&
    (workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.WITHDRAWAL ||
      workingCase.indictmentRulingDecision ===
        CaseIndictmentRulingDecision.CANCELLATION)

  const { appealBanner, appealModals } = useAppealCaseBanner()

  const shouldDisplayAppealBanner =
    workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.DISMISSAL &&
    (workingCase.canBeAppealed ||
      workingCase.hasBeenAppealed ||
      workingCase.appealCase?.appealState === AppealCaseState.COMPLETED ||
      workingCase.appealCase?.appealState === AppealCaseState.WITHDRAWN)

  const [originalReviewDecisions, setOriginalReviewDecisions] =
    useState<ReviewDecisions>({})

  // The appeals filed in this visit, which the working case does not know about
  // until it is refetched. Kept here rather than in the modal so they survive
  // the modal closing: withdrawing one of them again needs both its appeal case
  // and the knowledge that the defendant has an appeal at all.
  const [filedAppeals, setFiledAppeals] = useState<{
    appealCaseId?: string
    defendantIds: string[]
  }>({ defendantIds: [] })

  const recordFiledAppeal = useCallback(
    (defendantId: string, appealCaseId: string) =>
      setFiledAppeals((previous) => ({
        appealCaseId: previous.appealCaseId ?? appealCaseId,
        defendantIds: previous.defendantIds.includes(defendantId)
          ? previous.defendantIds
          : [...previous.defendantIds, defendantId],
      })),
    [],
  )

  // A review decision of APPEAL is not itself an appeal to withdraw - one
  // recorded before verdict appeals were switched on has no event behind it.
  const defendantIdsWithStandingAppeal = [
    ...standingProsecutionAppealDefendantIds(workingCase.verdictAppealCase),
    ...filedAppeals.defendantIds,
  ]

  // Store original review decisions when workingCase loads to see if they change
  useEffect(() => {
    if (
      defendantsRequiringReview?.length &&
      defendantsRequiringReview.every((d) => d.id) &&
      !Object.keys(originalReviewDecisions).length
    ) {
      const decisions = defendantsRequiringReview.reduce<ReviewDecisions>(
        (acc, defendant) => {
          acc[defendant.id] = defendant.indictmentReviewDecision
          return acc
        },
        {},
      )
      setOriginalReviewDecisions(decisions)
    }
  }, [defendantsRequiringReview, originalReviewDecisions])

  // Confirming saves only the decisions that changed since the page loaded.
  const changedReviewDecisions = getChangedReviewDecisions(
    defendantsRequiringReview,
    originalReviewDecisions,
  )
  const hasReviewDecisionChanged = changedReviewDecisions.length > 0

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
          <PageTitle>
            {caseIsClosed
              ? formatMessage(strings.completedTitle)
              : formatMessage(strings.inProgressTitle)}
          </PageTitle>
          <CourtCaseInfo workingCase={workingCase} />
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
          <div className={stack({ gap: 5 })}>
            <AppealRulingModifiedAlert />
            <RulingModifiedAlert />
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
            {shouldDisplayReviewDecision &&
              isRuling &&
              defendantsRequiringReview && (
                <div className={stack({ gap: 2 })}>
                  {defendantsRequiringReview.map((defendant) => (
                    <ReviewerVerdictTimelineCard
                      key={`${defendant.id}_verdict_timeline`}
                      defendant={defendant}
                      verdictAppealCase={workingCase.verdictAppealCase}
                      indictmentAppealDeadline={
                        workingCase.indictmentAppealDeadline
                      }
                    />
                  ))}
                </div>
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
            <AllIndictmentCaseFiles />
            <Box component="section">
              <InputPenalties />
            </Box>
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
                {defendantsRequiringReview && (
                  <div className={stack({ gap: 3 })}>
                    {defendantsRequiringReview.map((defendant) => (
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
                          isFine={isFine}
                          disabled={isReviewDecisionLocked}
                        />
                      </BlueBox>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            actions={
              !canDuplicateIndictment &&
              (!shouldDisplayReviewDecision || isReviewDecisionLocked)
                ? []
                : [
                    {
                      text: canDuplicateIndictment
                        ? 'Afrita mál í drög'
                        : workingCase.indictmentReviewedDate
                        ? 'Breyta ákvörðun'
                        : 'Ljúka yfirlestri',
                      onClick: () =>
                        setModalVisible(
                          canDuplicateIndictment
                            ? DUPLICATE_INDICTMENT
                            : CONFIRM_PROSECUTOR_DECISION,
                        ),
                      disabled:
                        !canDuplicateIndictment &&
                        shouldDisplayReviewDecision &&
                        (isReviewMissing || !hasReviewDecisionChanged),
                      testId: 'continueButton',
                    },
                  ]
            }
          />
        </FormContentContainer>
        {appealModals}
        {isConfirmProsecutorDecisionModal(modalVisible) && (
          <ReviewDecisionModal
            caseId={workingCase.id}
            changedDefendants={changedReviewDecisions}
            originalDecisions={originalReviewDecisions}
            isFine={isFine}
            indictmentAppealDeadline={workingCase.indictmentAppealDeadline}
            verdictAppealCaseId={
              workingCase.verdictAppealCase?.id ?? filedAppeals.appealCaseId
            }
            defendantIdsWithStandingAppeal={defendantIdsWithStandingAppeal}
            registersVerdictAppeal={registersVerdictAppeal}
            onClose={() => setModalVisible(undefined)}
            onAppealFiled={recordFiledAppeal}
            // A saved decision is the new original: it no longer counts as
            // changed, so a retry after a partial failure sends only the rest.
            onSaved={(savedDefendantIds) =>
              setOriginalReviewDecisions((previous) => ({
                ...previous,
                ...Object.fromEntries(
                  savedDefendantIds.map((id) => [
                    id,
                    workingCase.defendants?.find((d) => d.id === id)
                      ?.indictmentReviewDecision,
                  ]),
                ),
              }))
            }
            onConfirmed={() => router.push(getStandardUserDashboardRoute(user))}
          />
        )}
        {isDuplicateIndictmentModal(modalVisible) && (
          <DuplicateIndictmentModal
            onClose={() => setModalVisible(undefined)}
          />
        )}
      </PageLayout>
    </>
  )
}

export default IndictmentOverview
