import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion, Box, Button } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isDefenceUser,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  ConnectedCaseFilesAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentCaseScheduledCard,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  IndictmentDecision,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { ReviewDecision } from '../../PublicProsecutor/components/ReviewDecision/ReviewDecision'
import { strings } from './IndictmentOverview.strings'

const IndictmentOverview: FC = () => {
  const router = useRouter()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)

  const { formatMessage } = useIntl()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)
  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const latestDate = workingCase.courtDate ?? workingCase.arraignmentDate
  const caseIsClosed = isCompletedCase(workingCase.state)

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [isReviewDecisionSelected, setIsReviewDecisionSelected] =
    useState(false)
  const shouldDisplayReviewDecision =
    isCompletedCase(workingCase.state) &&
    workingCase.indictmentReviewer?.id === user?.id &&
    Boolean(!workingCase.indictmentReviewDecision)
  const canAddFiles =
    !isCompletedCase(workingCase.state) &&
    isDefenceUser(user) &&
    workingCase.defendants?.some(
      (defendant) =>
        defendant?.defenderNationalId &&
        normalizeAndFormatNationalId(user?.nationalId).includes(
          defendant.defenderNationalId,
        ),
    ) &&
    workingCase.indictmentDecision !==
      IndictmentDecision.POSTPONING_UNTIL_VERDICT

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  const hasLawsBroken = lawsBroken.size > 0
  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

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
        {caseHasBeenReceivedByCourt &&
          workingCase.court &&
          latestDate?.date &&
          workingCase.indictmentDecision !== IndictmentDecision.COMPLETING &&
          workingCase.indictmentDecision !==
            IndictmentDecision.REDISTRIBUTING && (
            <Box component="section" marginBottom={5}>
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
        <Box component="section" marginBottom={5}>
          {caseIsClosed ? (
            <InfoCardClosedIndictment
              displayAppealExpirationInfo={
                workingCase.indictmentRulingDecision ===
                  CaseIndictmentRulingDecision.RULING &&
                (user?.role === UserRole.DEFENDER ||
                  workingCase.indictmentReviewer?.id === user?.id)
              }
            />
          ) : (
            <InfoCardActiveIndictment />
          )}
        </Box>
        {(hasLawsBroken || hasMergeCases) && (
          <Box marginBottom={5}>
            {hasLawsBroken && (
              <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
            )}
            {hasMergeCases && (
              <Accordion>
                {workingCase.mergedCases?.map((mergedCase) => (
                  <Box key={mergedCase.id}>
                    <ConnectedCaseFilesAccordionItem
                      connectedCaseParentId={workingCase.id}
                      connectedCase={mergedCase}
                    />
                  </Box>
                ))}
              </Accordion>
            )}
          </Box>
        )}
        {workingCase.caseFiles && (
          <Box
            component="section"
            marginBottom={shouldDisplayReviewDecision || canAddFiles ? 5 : 10}
          >
            <IndictmentCaseFilesList workingCase={workingCase} />
          </Box>
        )}
        {canAddFiles && (
          <Box display="flex" justifyContent="flexEnd" marginBottom={10}>
            <Button
              size="small"
              icon="add"
              onClick={() =>
                router.push(
                  `${constants.DEFENDER_ADD_FILES_ROUTE}/${workingCase.id}`,
                )
              }
            >
              {formatMessage(strings.addDocumentsButtonText)}
            </Button>
          </Box>
        )}
        {shouldDisplayReviewDecision && (
          <ReviewDecision
            caseId={workingCase.id}
            indictmentAppealDeadline={
              workingCase.indictmentAppealDeadline ?? ''
            }
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            onSelect={() => setIsReviewDecisionSelected(true)}
          />
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.CASES_ROUTE}`}
          hideNextButton={!shouldDisplayReviewDecision}
          nextButtonText={formatMessage(strings.completeReview)}
          onNextButtonClick={() => setModalVisible(true)}
          nextIsDisabled={!isReviewDecisionSelected}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
