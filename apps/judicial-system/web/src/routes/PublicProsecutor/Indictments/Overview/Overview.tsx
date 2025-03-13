import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, Option, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_PRISON_ADMIN_ROUTE } from '@island.is/judicial-system/consts'
import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
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
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import VerdictAppealDecisionChoice from '@island.is/judicial-system-web/src/components/VerdictAppealDecisionChoice/VerdictAppealDecisionChoice'
import {
  Defendant,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { ReviewDecision } from '../../components/ReviewDecision/ReviewDecision'
import {
  CONFIRM_PROSECUTOR_DECISION,
  ConfirmationModal,
  isReviewerAssignedModal,
  REVIEWER_ASSIGNED,
} from '../../components/utils'
import { IndictmentReviewerSelector } from './IndictmentReviewerSelector'
import { strings } from './Overview.strings'

type VisibleModal = {
  type: 'REVOKE_SEND_TO_PRISON_ADMIN'
  defendant: Defendant
}

export const Overview = () => {
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase } = useCase()
  const { setAndSendDefendantToServer, isUpdatingDefendant } = useDefendants()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()
  const [isReviewedDecisionChanged, setIsReviewedDecisionChanged] =
    useState<boolean>(false)

  const [confirmationModal, setConfirmationModal] = useState<
    ConfirmationModal | undefined
  >()
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

    setConfirmationModal(REVIEWER_ASSIGNED)
  }

  const handleSendToPrisonAdmin = (defendant: Defendant) => {
    router.push(
      `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_SEND_TO_PRISON_ADMIN_ROUTE}/${workingCase.id}/${defendant.id}`,
    )
  }

  const handleRevokeAppeal = (defendant: Defendant) => {
    setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        verdictAppealDate: null,
      },
      setWorkingCase,
    )
  }

  const handleRevokeSendToPrisonAdmin = (defendant: Defendant) => {
    setAndSendDefendantToServer(
      {
        caseId: workingCase.id,
        defendantId: defendant.id,
        isSentToPrisonAdmin: false,
      },
      setWorkingCase,
    )

    setModalVisible(undefined)
  }

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  const onSelect = (decision?: IndictmentCaseReviewDecision) => {
    if (!decision) {
      return
    }

    const isDecisionChanged = decision !== workingCase.indictmentReviewDecision
    setIsReviewedDecisionChanged(isDecisionChanged)
  }

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
        {workingCase.defendants?.map((defendant) => {
          const isFine =
            workingCase.indictmentRulingDecision ===
            CaseIndictmentRulingDecision.FINE

          const serviceRequired =
            defendant.serviceRequirement === ServiceRequirement.REQUIRED

          return (
            <>
              <Box component="section" marginBottom={3} key={defendant.id}>
                <BlueBoxWithDate defendant={defendant} icon="calendar" />
              </Box>
              <Box component="section" marginBottom={5}>
                <BlueBox>
                  <SectionHeading
                    title={fm(strings.verdictAppealDecisionTitle)}
                    heading="h4"
                    marginBottom={2}
                  />

                  <Box marginBottom={2}>
                    <Text variant="eyebrow">{defendant.name}</Text>
                  </Box>
                  <VerdictAppealDecisionChoice defendant={defendant} />
                </BlueBox>
                <Box display="flex" justifyContent="flexEnd" marginTop={2}>
                  {defendant.verdictAppealDate ? (
                    <Button
                      variant="text"
                      onClick={() => handleRevokeAppeal(defendant)}
                      size="small"
                      colorScheme="destructive"
                    >
                      {fm(strings.revokeAppeal)}
                    </Button>
                  ) : defendant.isSentToPrisonAdmin ? (
                    <Button
                      variant="text"
                      onClick={() =>
                        setModalVisible({
                          type: 'REVOKE_SEND_TO_PRISON_ADMIN',
                          defendant,
                        })
                      }
                      size="small"
                      colorScheme="destructive"
                    >
                      {fm(strings.revokeSendToPrisonAdmin)}
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      onClick={() => handleSendToPrisonAdmin(defendant)}
                      size="small"
                      disabled={
                        !workingCase.indictmentReviewDecision ||
                        (!isFine &&
                          !defendant.verdictViewDate &&
                          serviceRequired)
                      }
                    >
                      {fm(strings.sendToPrisonAdmin)}
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )
        })}
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
            modalVisible={confirmationModal}
            setModalVisible={setConfirmationModal}
            isFine={
              workingCase.indictmentRulingDecision ===
              CaseIndictmentRulingDecision.FINE
            }
            onSelect={onSelect}
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
          secondaryButtonText={fm(core.back)}
          onSecondaryButtonClick={() => router.push(constants.CASES_ROUTE)}
        />
      )}
      {modalVisible?.type === 'REVOKE_SEND_TO_PRISON_ADMIN' && (
        <Modal
          title={fm(strings.revokeSendToPrisonAdminModalTitle)}
          text={fm(strings.revokeSendToPrisonAdminModalText, {
            courtCaseNumber: workingCase.courtCaseNumber,
            defendant: modalVisible.defendant.name,
          })}
          onPrimaryButtonClick={() =>
            handleRevokeSendToPrisonAdmin(modalVisible.defendant)
          }
          primaryButtonText={fm(strings.revoke)}
          isPrimaryButtonLoading={isUpdatingDefendant}
          secondaryButtonText={fm(core.cancel)}
          onSecondaryButtonClick={() => setModalVisible(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default Overview
