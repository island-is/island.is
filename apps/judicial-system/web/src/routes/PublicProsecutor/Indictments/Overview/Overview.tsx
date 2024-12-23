import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Option } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
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

import { IndictmentReviewerSelector } from './IndictmentReviewerSelector'
import { strings } from './Overview.strings'
type VisibleModal = 'REVIEWER_ASSIGNED'

export const Overview = () => {
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase } = useCase()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()
  const [modalVisible, setModalVisible] = useState<VisibleModal>()
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

    setModalVisible('REVIEWER_ASSIGNED')
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
        {!workingCase.indictmentReviewDecision && (
          <IndictmentReviewerSelector
            workingCase={workingCase}
            selectedIndictmentReviewer={selectedIndictmentReviewer}
            setSelectedIndictmentReviewer={setSelectedIndictmentReviewer}
          />
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
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
      </FormContentContainer>
      {modalVisible === 'REVIEWER_ASSIGNED' && (
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
