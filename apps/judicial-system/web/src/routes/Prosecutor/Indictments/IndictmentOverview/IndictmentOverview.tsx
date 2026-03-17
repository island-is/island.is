import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion, AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isRulingOrDismissalCase,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
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
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import InputPenalties from '@island.is/judicial-system-web/src/components/Inputs/InputPenalties'
import VerdictStatusAlert from '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  IndictmentDecision,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { shouldDisplayGeneratedPdfFiles } from '@island.is/judicial-system-web/src/utils/utils'

import { ReviewDecision } from '../../../PublicProsecutor/components/ReviewDecision/ReviewDecision'
import {
  CONFIRM_PROSECUTOR_DECISION,
  ConfirmationModal,
} from '../../../PublicProsecutor/components/utils'
import { strings } from './IndictmentOverview.strings'

const IndictmentOverview: FC = () => {
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const router = useRouter()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const [modalVisible, setModalVisible] = useState<
    ConfirmationModal | undefined
  >()

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
          <Box component="section">
            <InputPenalties />
          </Box>
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
