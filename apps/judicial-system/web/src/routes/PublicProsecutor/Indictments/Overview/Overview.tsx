import { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Option } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { isRulingOrDismissalCase } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  AllIndictmentCaseFiles,
  AppealRulingModifiedAlert,
  Conclusion,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  RulingModifiedAlert,
  UserContext,
  VerdictTimelineCard,
} from '@island.is/judicial-system-web/src/components'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  isReviewerAssignedModal,
  ModalId,
  REVIEWER_ASSIGNED,
} from '../../components/utils'
import { IndictmentReviewerSelector } from './IndictmentReviewerSelector'
import { strings } from './Overview.strings'

export const Overview = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase } = useCase()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()

  const [confirmationModal, setConfirmationModal] = useState<
    ModalId | undefined
  >()

  // const lawsBroken = useIndictmentsLawsBroken(workingCase) NOTE: Temporarily hidden while list of laws broken is not complete
  // Defendants whose indictment was cancelled or dismissed (completed for some)
  // do not receive a verdict, so no review decision is required for them.
  const isReviewMissing = workingCase.defendants?.some(
    (defendant) =>
      !defendant.indictmentCancelledOrDismissedState &&
      !defendant.indictmentReviewDecision,
  )

  const assignReviewer = async () => {
    if (!selectedIndictmentReviewer) {
      return
    }
    const updatedCase = await updateCase(workingCase.id, {
      indictmentReviewerId: selectedIndictmentReviewer.value,
    })
    if (!updatedCase) {
      return
    }

    setConfirmationModal(REVIEWER_ASSIGNED)
  }

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  const { verdictStatusAlerts, verdictTimelineCards } = useMemo(() => {
    return (workingCase.defendants || []).reduce<{
      verdictStatusAlerts: JSX.Element[]
      verdictTimelineCards: JSX.Element[]
    }>(
      (acc, defendant) => {
        // Defendants whose indictment was cancelled or dismissed (completed for
        // some) do not get a verdict, so we show nothing for them here.
        if (defendant.indictmentCancelledOrDismissedState) {
          return acc
        }

        const { verdict } = defendant

        const isServiceRequired =
          verdict?.serviceRequirement === ServiceRequirement.REQUIRED

        const isServiceNotApplicable =
          verdict?.serviceRequirement === ServiceRequirement.NOT_APPLICABLE

        const canDefendantAppealVerdict = !!(
          verdict &&
          !verdict.isDefaultJudgement &&
          (isServiceNotApplicable ||
            (isServiceRequired && !!verdict.serviceDate))
        )

        if (verdict) {
          acc.verdictStatusAlerts.push(
            <VerdictStatusAlert
              key={`${defendant.id}_verdict_status_alert`}
              verdict={verdict}
              defendant={defendant}
            />,
          )
        }

        acc.verdictTimelineCards.push(
          <Box
            key={`${defendant.id}_verdict_timeline_card`}
            dataTestId="verdictTimelineCard"
          >
            <VerdictTimelineCard
              defendant={defendant}
              canDefendantAppealVerdict={canDefendantAppealVerdict}
            />
          </Box>,
        )

        return acc
      },
      {
        verdictStatusAlerts: [],
        verdictTimelineCards: [],
      },
    )
  }, [workingCase.defendants])

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={fm(titles.shared.closedCaseOverview, {
          courtCaseNumber: workingCase.courtCaseNumber,
        })}
      />
      <FormContentContainer>
        <PageTitle>{fm(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <div className={grid({ gap: 2 })}>{verdictStatusAlerts}</div>
          {verdictTimelineCards}
          <AppealRulingModifiedAlert />
          <RulingModifiedAlert />
          <Box component="section">
            <InfoCardClosedIndictment displaySentToPrisonAdminDate={false} />
          </Box>
          {workingCase.courtSessions?.at(-1)?.ruling &&
            isRulingOrDismissalCase(workingCase.indictmentRulingDecision) && (
              <Box component="section">
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
              </Box>
            )}
          {workingCase.appealCase?.appealState === AppealCaseState.COMPLETED &&
            workingCase.appealCase?.appealConclusion && (
              <Conclusion
                title="Úrskurðarorð Landsréttar"
                conclusionText={workingCase.appealCase?.appealConclusion}
              />
            )}
          <AllIndictmentCaseFiles />
          <Box component="section">
            {isReviewMissing && (
              <IndictmentReviewerSelector
                workingCase={workingCase}
                selectedIndictmentReviewer={selectedIndictmentReviewer}
                setSelectedIndictmentReviewer={setSelectedIndictmentReviewer}
              />
            )}
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={getStandardUserDashboardRoute(user)}
          actions={
            !isReviewMissing
              ? []
              : [
                  {
                    text: fm(core.continue),
                    icon: 'arrowForward',
                    onClick: assignReviewer,
                    disabled:
                      !selectedIndictmentReviewer ||
                      selectedIndictmentReviewer.value ===
                        workingCase.indictmentReviewer?.id ||
                      isLoadingWorkingCase,
                    loading: isLoadingWorkingCase,
                    testId: 'continueButton',
                  },
                ]
          }
        />
      </FormContentContainer>
      {isReviewerAssignedModal(confirmationModal) && (
        <Modal
          title={fm(strings.reviewerAssignedModalTitle)}
          text={fm(strings.reviewerAssignedModalText, {
            caseNumber: workingCase.courtCaseNumber,
            reviewer: selectedIndictmentReviewer?.label,
          })}
          secondaryButton={{
            text: fm(core.back),
            onClick: () => router.push(getStandardUserDashboardRoute(user)),
          }}
        />
      )}
    </PageLayout>
  )
}

export default Overview
