import { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Option } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { isRulingOrDismissalCase } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  Conclusion,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardClosedIndictment,
  MarkdownWrapper,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  UserContext,
  VerdictTimelineCard,
} from '@island.is/judicial-system-web/src/components'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { ReviewDecision } from '../../components/ReviewDecision/ReviewDecision'
import {
  CONFIRM_PROSECUTOR_DECISION,
  ConfirmationModal,
  isReviewerAssignedModal,
  REVIEWER_ASSIGNED,
} from '../../components/utils'
import { IndictmentReviewerSelector } from './IndictmentReviewerSelector'
import { strings } from './Overview.strings'
import * as styles from './Overview.css'

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
    ConfirmationModal | undefined
  >()

  // const lawsBroken = useIndictmentsLawsBroken(workingCase) NOTE: Temporarily hidden while list of laws broken is not complete

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

  const [originalReviewDecisions, setOriginalReviewDecisions] = useState<
    Record<string, IndictmentCaseReviewDecision | null | undefined>
  >({})

  // Store original review decisions when workingCase loads to see if they change
  useEffect(() => {
    if (
      workingCase.defendants?.length &&
      workingCase.defendants.every((d) => d.id) &&
      !Object.keys(originalReviewDecisions).length
    ) {
      const decisions = workingCase.defendants.reduce((acc, defendant) => {
        acc[defendant.id] = defendant.indictmentReviewDecision
        return acc
      }, {} as Record<string, IndictmentCaseReviewDecision | null | undefined>)
      setOriginalReviewDecisions(decisions)
    }
  }, [workingCase.defendants, originalReviewDecisions])

  const hasReviewDecisionChanged = workingCase.defendants?.some(
    (defendant) =>
      defendant.indictmentReviewDecision !==
      originalReviewDecisions[defendant.id],
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
        title={fm(titles.shared.closedCaseOverview, {
          courtCaseNumber: workingCase.courtCaseNumber,
        })}
      />
      <FormContentContainer>
        <PageTitle>{fm(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.rulingModifiedHistory && (
          <Box marginBottom={5}>
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
          </Box>
        )}
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          {workingCase.defendants?.map((defendant) => {
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

            return (
              <Fragment key={defendant.id}>
                <Box className={styles.container}>
                  {verdict && (
                    <VerdictStatusAlert
                      verdict={verdict}
                      defendant={defendant}
                    />
                  )}
                  <Box component="section">
                    <VerdictTimelineCard
                      defendant={defendant}
                      canDefendantAppealVerdict={canDefendantAppealVerdict}
                    />
                  </Box>
                </Box>
              </Fragment>
            )
          })}
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
          {/* 
        NOTE: Temporarily hidden while list of laws broken is not complete in
        indictment cases
        
        {lawsBroken.size > 0 && (
          <Box component="section">
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )} */}
          <Box component="section">
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
          <Box component="section">
            {workingCase.defendants?.some(
              (defendant) => !defendant.indictmentReviewDecision,
            ) ? (
              <IndictmentReviewerSelector
                workingCase={workingCase}
                selectedIndictmentReviewer={selectedIndictmentReviewer}
                setSelectedIndictmentReviewer={setSelectedIndictmentReviewer}
              />
            ) : (
              workingCase.defendants && (
                <div className={grid({ gap: 3 })}>
                  {workingCase.defendants.map((defendant) => (
                    <BlueBox key={`${defendant.id}_review_decision`}>
                      <SectionHeading
                        title={defendant.name ?? ''}
                        variant="h4"
                        heading="h4"
                        marginBottom={2}
                        required
                      />
                      <ReviewDecision
                        caseId={workingCase.id}
                        defendant={defendant}
                        modalVisible={confirmationModal}
                        setModalVisible={setConfirmationModal}
                        isFine={
                          workingCase.indictmentRulingDecision ===
                          CaseIndictmentRulingDecision.FINE
                        }
                      />
                    </BlueBox>
                  ))}
                </div>
              )
            )}
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        {workingCase.defendants?.some(
          (defendant) => !defendant.indictmentReviewDecision,
        ) ? (
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={getStandardUserDashboardRoute(user)}
            nextIsLoading={isLoadingWorkingCase}
            nextIsDisabled={
              !selectedIndictmentReviewer ||
              selectedIndictmentReviewer.value ===
                workingCase.indictmentReviewer?.id ||
              isLoadingWorkingCase
            }
            onNextButtonClick={assignReviewer}
            nextButtonText={fm(core.continue)}
          />
        ) : (
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            nextIsLoading={isLoadingWorkingCase}
            nextIsDisabled={!hasReviewDecisionChanged}
            onNextButtonClick={() =>
              setConfirmationModal(CONFIRM_PROSECUTOR_DECISION)
            }
            nextButtonText={fm(strings.changeReviewedDecisionButtonText)}
          />
        )}
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
