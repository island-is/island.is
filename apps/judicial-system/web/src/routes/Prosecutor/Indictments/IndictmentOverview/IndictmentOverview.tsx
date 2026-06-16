import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import {
  getStandardUserDashboardRoute,
  PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
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
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useAppealCaseBanner,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { ReviewDecision } from '../../../PublicProsecutor/components/ReviewDecision/ReviewDecision'
import {
  CONFIRM_PROSECUTOR_DECISION,
  DUPLICATE_INDICTMENT,
  isDuplicateIndictmentModal,
  ModalId,
} from '../../../PublicProsecutor/components/utils'
import { strings } from './IndictmentOverview.strings'

const IndictmentOverview: FC = () => {
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const router = useRouter()
  const { duplicateIndictmentCase, isDuplicatingIndictmentCase } = useCase()

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseIsClosed = isCompletedCase(workingCase.state)

  const shouldDisplayReviewDecision =
    caseIsClosed && workingCase.indictmentReviewer?.id === user?.id

  const isFine =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const indictmentAppealDeadlineIsInThePast =
    workingCase.indictmentVerdictAppealDeadlineExpired ?? false

  const isReviewMissing = workingCase.defendants?.some(
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

  const handleDuplicateIndictment = async () => {
    const duplicatedCase = await duplicateIndictmentCase(workingCase.id)

    if (duplicatedCase) {
      router.push(
        `${PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE}/${duplicatedCase.id}`,
      )
    }
  }

  const { appealBanner, appealModals } = useAppealCaseBanner()

  const shouldDisplayAppealBanner =
    workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.DISMISSAL &&
    (workingCase.canBeAppealed ||
      workingCase.hasBeenAppealed ||
      workingCase.appealCase?.appealState === AppealCaseState.COMPLETED ||
      workingCase.appealCase?.appealState === AppealCaseState.WITHDRAWN)

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
          <div className={grid({ gap: 5, marginBottom: 10 })}>
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
            hideNextButton={
              !shouldDisplayReviewDecision && !canDuplicateIndictment
            }
            nextIsDisabled={
              !canDuplicateIndictment &&
              shouldDisplayReviewDecision &&
              (isReviewMissing || !hasReviewDecisionChanged)
            }
            nextIsLoading={
              canDuplicateIndictment && isDuplicatingIndictmentCase
            }
            nextButtonIcon={canDuplicateIndictment ? 'copy' : undefined}
            nextButtonText={
              canDuplicateIndictment
                ? 'Afrita mál í drög'
                : workingCase.indictmentReviewedDate
                ? 'Breyta ákvörðun'
                : 'Ljúka yfirlestri'
            }
            onNextButtonClick={() =>
              setModalVisible(
                canDuplicateIndictment
                  ? DUPLICATE_INDICTMENT
                  : CONFIRM_PROSECUTOR_DECISION,
              )
            }
          />
        </FormContentContainer>
        {appealModals}
        {isDuplicateIndictmentModal(modalVisible) && (
          <Modal
            title="Viltu afrita mál í drög?"
            text="Nýtt mál verður til í drögum. Innihald ákæru ásamt gögnum afritast yfir á nýja málið."
            primaryButton={{
              text: 'Afrita mál í drög',
              onClick: handleDuplicateIndictment,
              isLoading: isDuplicatingIndictmentCase,
            }}
            secondaryButton={{
              text: 'Hætta við',
              onClick: () => setModalVisible(undefined),
              isDisabled: isDuplicatingIndictmentCase,
            }}
          />
        )}
      </PageLayout>
    </>
  )
}

export default IndictmentOverview
