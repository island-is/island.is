import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Option } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBoxWithDate,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { ReviewDecision } from '../../components/ReviewDecision/ReviewDecision'
import { IndictmentReviewerSelector } from './IndictmentReviewerSelector'
import { strings } from './Overview.strings'

export const Overview = () => {
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase } = useCase()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()
  const [isReviewedDecisionChanged, setIsReviewedDecisionChanged] =
    useState<boolean>(false)

  // modal states
  const [showReviewerAssignedModal, setShowReviewerAssignedModal] =
    useState<boolean>(false)
  const [
    showConfirmChangedProsecutorDecisionModal,
    setShowConfirmChangedProsecutorDecisionModal,
  ] = useState<boolean>(false)

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

    setShowReviewerAssignedModal(true)
  }

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
        title={fm(titles.shared.closedCaseOverview, {
          courtCaseNumber: workingCase.courtCaseNumber,
        })}
      />
      <FormContentContainer>
        <PageTitle>{fm(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.defendants?.map((defendant) => (
          <Box component="section" marginBottom={5} key={defendant.id}>
            <BlueBoxWithDate defendant={defendant} icon="calendar" />
          </Box>
        ))}
        <Box component="section" marginBottom={5}>
          <InfoCardClosedIndictment displaySentToPrisonAdminDate={false} />
        </Box>
        {/* 
        NOTE: Temporarily hidden while list of laws broken is not complete in
        indictment cases
        
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )} */}
        <Box component="section" marginBottom={5}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {!workingCase.indictmentReviewDecision ? (
          <IndictmentReviewerSelector
            workingCase={workingCase}
            selectedIndictmentReviewer={selectedIndictmentReviewer}
            setSelectedIndictmentReviewer={setSelectedIndictmentReviewer}
          />
        ) : (
          <ReviewDecision
            caseId={workingCase.id}
            currentDecision={workingCase.indictmentReviewDecision}
            indictmentAppealDeadline={
              workingCase.indictmentAppealDeadline ?? ''
            }
            indictmentAppealDeadlineIsInThePast={
              workingCase.indictmentVerdictAppealDeadlineExpired ?? false
            }
            modalVisible={showConfirmChangedProsecutorDecisionModal}
            setModalVisible={setShowConfirmChangedProsecutorDecisionModal}
            isFine={
              workingCase.indictmentRulingDecision ===
              CaseIndictmentRulingDecision.FINE
            }
            onChange={(decision: IndictmentCaseReviewDecision) => {
              const isChanged =
                decision !== workingCase.indictmentReviewDecision
              setIsReviewedDecisionChanged(isChanged)
            }}
          />
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        {!workingCase.indictmentReviewDecision ? (
          <FormFooter
            nextButtonIcon="arrowForward"
            previousUrl={constants.CASES_ROUTE}
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
            previousUrl={constants.CASES_ROUTE}
            nextIsLoading={isLoadingWorkingCase}
            nextIsDisabled={!isReviewedDecisionChanged}
            onNextButtonClick={() =>
              setShowConfirmChangedProsecutorDecisionModal(true)
            }
            nextButtonText={fm(strings.changeReviewedDecisionButtonText)}
          />
        )}
      </FormContentContainer>
      {showReviewerAssignedModal && (
        <Modal
          title={fm(strings.reviewerAssignedModalTitle)}
          text={fm(strings.reviewerAssignedModalText, {
            caseNumber: workingCase.courtCaseNumber,
            reviewer: selectedIndictmentReviewer?.label,
          })}
          secondaryButtonText={fm(core.back)}
          onSecondaryButtonClick={() => router.push(constants.CASES_ROUTE)}
        />
      )}
    </PageLayout>
  )
}

export default Overview
