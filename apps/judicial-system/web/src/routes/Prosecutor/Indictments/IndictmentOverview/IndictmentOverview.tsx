import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion, AlertMessage, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isRulingOrDismissalCase,
} from '@island.is/judicial-system/types'
import {
  signedVerdictOverview as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
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
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  CaseAppealState,
  CaseIndictmentRulingDecision,
  CaseState,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { shouldDisplayGeneratedPdfFiles } from '@island.is/judicial-system-web/src/utils/utils'

import { ReviewDecision } from '../../../PublicProsecutor/components/ReviewDecision/ReviewDecision'
import {
  CONFIRM_PROSECUTOR_DECISION,
  ConfirmationModal,
} from '../../../PublicProsecutor/components/utils'
import { strings as svoStrings } from '../../../Shared/SignedVerdictOverview/SignedVerdictOverview.strings'
import { strings } from './IndictmentOverview.strings'

const IndictmentOverview: FC = () => {
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const router = useRouter()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseIsClosed = isCompletedCase(workingCase.state)
  const hasLawsBroken = lawsBroken.size > 0
  const displayGeneratedPDFs = shouldDisplayGeneratedPdfFiles(workingCase, user)

  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

  const shouldDisplayReviewDecision =
    caseIsClosed && workingCase.indictmentReviewer?.id === user?.id

  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const indictmentAppealDeadlineIsInThePast =
    workingCase.indictmentVerdictAppealDeadlineExpired ?? false

  const isReviewMissing = workingCase.defendants?.some(
    (defendant) => !defendant.indictmentReviewDecision,
  )

  const [modalVisible, setModalVisible] = useState<
    ConfirmationModal | undefined
  >()

  const [appealModalVisible, setAppealModalVisible] = useState<
    'ConfirmAppealAfterDeadline' | 'ConfirmStatementAfterDeadline' | undefined
  >()

  const { title, description, child, isLoadingAppealBanner } =
    useAppealAlertBanner(
      workingCase,
      () => setAppealModalVisible('ConfirmAppealAfterDeadline'),
      () => setAppealModalVisible('ConfirmStatementAfterDeadline'),
    )

  const shouldDisplayAlertBanner =
    workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.DISMISSAL &&
    (workingCase.canBeAppealed ||
      workingCase.hasBeenAppealed ||
      workingCase.appealCase?.appealState === CaseAppealState.COMPLETED)

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

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  return (
    <>
      {!isLoadingAppealBanner && shouldDisplayAlertBanner && (
        <AlertBanner variant="warning" title={title} description={description}>
          {child}
        </AlertBanner>
      )}
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
                {workingCase.defendants && (
                  <div className={grid({ gap: 3 })}>
                    {workingCase.defendants?.map((defendant) => (
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
          </div>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={getStandardUserDashboardRoute(user)}
            hideNextButton={!shouldDisplayReviewDecision}
            nextIsDisabled={isReviewMissing || !hasReviewDecisionChanged}
            nextButtonText={
              workingCase.indictmentReviewedDate
                ? 'Breyta ákvörðun'
                : 'Ljúka yfirlestri'
            }
            onNextButtonClick={() =>
              setModalVisible(CONFIRM_PROSECUTOR_DECISION)
            }
          />
        </FormContentContainer>
        {appealModalVisible === 'ConfirmAppealAfterDeadline' && (
          <Modal
            title={formatMessage(
              m.sections.confirmAppealAfterDeadlineModal.title,
            )}
            text={formatMessage(
              m.sections.confirmAppealAfterDeadlineModal.text,
            )}
            primaryButton={{
              text: formatMessage(
                m.sections.confirmAppealAfterDeadlineModal.primaryButtonText,
              ),
              onClick: () =>
                router.push(`${constants.APPEAL_ROUTE}/${workingCase.id}`),
            }}
            secondaryButton={{
              text: formatMessage(
                m.sections.confirmAppealAfterDeadlineModal.secondaryButtonText,
              ),
              onClick: () => setAppealModalVisible(undefined),
            }}
          />
        )}
        {appealModalVisible === 'ConfirmStatementAfterDeadline' && (
          <Modal
            title={formatMessage(
              svoStrings.confirmStatementAfterDeadlineModalTitle,
            )}
            text={formatMessage(
              svoStrings.confirmStatementAfterDeadlineModalText,
            )}
            primaryButton={{
              text: formatMessage(
                svoStrings.confirmStatementAfterDeadlineModalPrimaryButtonText,
              ),
              onClick: () =>
                router.push(`${constants.STATEMENT_ROUTE}/${workingCase.id}`),
            }}
            secondaryButton={{
              text: formatMessage(
                svoStrings.confirmStatementAfterDeadlineModalSecondaryButtonText,
              ),
              onClick: () => setAppealModalVisible(undefined),
            }}
          />
        )}
      </PageLayout>
    </>
  )
}

export default IndictmentOverview
