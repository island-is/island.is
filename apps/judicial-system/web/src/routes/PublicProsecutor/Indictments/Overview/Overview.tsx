import { type JSX, useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import type { Option } from '@island.is/island-ui/core'
import { Box } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  canDefendantAppealVerdict,
  Feature,
  isPublicProsecutionOfficeUser,
  isRulingOrDismissalCase,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  AllIndictmentCaseFiles,
  AppealRulingModifiedAlert,
  Conclusion,
  CourtCaseInfo,
  FeatureContext,
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
  VerdictAppealFiles,
  VerdictTimelineCard,
} from '@island.is/judicial-system-web/src/components'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { ModalId } from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/utils'
import {
  APPEAL_PROSECUTOR_ASSIGNED,
  isAppealProsecutorAssignedModal,
  isReviewerAssignedModal,
  REVIEWER_ASSIGNED,
} from '@island.is/judicial-system-web/src/routes/PublicProsecutor/components/utils'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { AppealProsecutorSelector } from './AppealProsecutorSelector'
import { IndictmentReviewerSelector } from './IndictmentReviewerSelector'
import { getPublicProsecutorOverviewAssignMode } from './Overview.logic'
import { strings } from './Overview.strings'

export const Overview = () => {
  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase } = useCase()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()
  const [selectedAppealProsecutor, setSelectedAppealProsecutor] =
    useState<Option<string> | null>()

  const [confirmationModal, setConfirmationModal] = useState<
    ModalId | undefined
  >()

  const assignMode = isPublicProsecutionOfficeUser(user)
    ? getPublicProsecutorOverviewAssignMode(workingCase)
    : 'none'

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

  const assignAppealProsecutor = async () => {
    if (!selectedAppealProsecutor) {
      return
    }
    const updatedCase = await updateCase(workingCase.id, {
      appealProsecutorId: selectedAppealProsecutor.value,
    })
    if (!updatedCase) {
      return
    }

    setConfirmationModal(APPEAL_PROSECUTOR_ASSIGNED)
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

        const canAppealVerdict = canDefendantAppealVerdict(verdict)

        // Service and appeal alerts are noise for defendants whose case was
        // closed without enforcement.
        if (verdict && !defendant.isClosedWithoutEnforcement) {
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
              canDefendantAppealVerdict={canAppealVerdict}
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
        <div className={stack({ gap: 5 })}>
          <div className={stack({ gap: 2 })}>{verdictStatusAlerts}</div>
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
          {features.includes(Feature.INDICTMENT_APPEAL) && (
            <VerdictAppealFiles />
          )}
          <AllIndictmentCaseFiles />
          <Box component="section">
            {assignMode === 'reviewer' && (
              <IndictmentReviewerSelector
                workingCase={workingCase}
                selectedIndictmentReviewer={selectedIndictmentReviewer}
                setSelectedIndictmentReviewer={setSelectedIndictmentReviewer}
              />
            )}
            {assignMode === 'appealProsecutor' && (
              <AppealProsecutorSelector
                workingCase={workingCase}
                selectedAppealProsecutor={selectedAppealProsecutor}
                setSelectedAppealProsecutor={setSelectedAppealProsecutor}
              />
            )}
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={getStandardUserDashboardRoute(user)}
          actions={
            assignMode === 'none'
              ? []
              : [
                  {
                    text: fm(core.continue),
                    icon: 'arrowForward',
                    onClick:
                      assignMode === 'appealProsecutor'
                        ? assignAppealProsecutor
                        : assignReviewer,
                    disabled:
                      assignMode === 'appealProsecutor'
                        ? !selectedAppealProsecutor ||
                          selectedAppealProsecutor.value ===
                            workingCase.appealProsecutor?.id ||
                          isLoadingWorkingCase
                        : !selectedIndictmentReviewer ||
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
          buttons={[
            {
              text: fm(core.back),
              onClick: () => router.push(getStandardUserDashboardRoute(user)),
              variant: 'ghost',
            },
          ]}
        />
      )}
      {isAppealProsecutorAssignedModal(confirmationModal) && (
        <Modal
          title="Úthlutun áfrýjunarmáls tókst"
          text="Áfrýjunarmáli hefur verið úthlutað á saksóknara."
          buttons={[
            {
              text: fm(core.back),
              onClick: () => router.push(getStandardUserDashboardRoute(user)),
              variant: 'ghost',
            },
          ]}
        />
      )}
    </PageLayout>
  )
}

export default Overview
