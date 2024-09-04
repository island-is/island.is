import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isAcceptingCaseDecision,
  isCompletedCase,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtCaseInfo,
  CourtRecordAccordionItem,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PdfButton,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
  SigningModal,
  UserContext,
  useRequestRulingSignature,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import {
  JudgeRequestRulingSignatureModal,
  RegistrarRequestRulingSignatureModal,
  RulingModifiedModal,
} from '../../components'
import { confirmation as strings } from './Confirmation.strings'

type VisibleModal =
  | 'none'
  | 'rulingModifiedModal'
  | 'judgeRequestRulingSignatureModal'
  | 'registrarRequestRulingSignatureModal'
  | 'signingModal'

const Confirmation: FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { transitionCase, isTransitioningCase } = useCase()
  const {
    requestRulingSignature,
    requestRulingSignatureResponse,
    isRequestingRulingSignature,
  } = useRequestRulingSignature(workingCase.id, () =>
    setModalVisible('signingModal'),
  )
  const [modalVisible, setModalVisible] = useState<VisibleModal>('none')

  const isCorrectingRuling = workingCase.notifications?.some(
    (notification) => notification.type === NotificationType.RULING,
  )
  const isAssignedJudge = user && workingCase.judge?.id === user.id
  const isAssignedRegistrar = user && workingCase.registrar?.id === user.id
  const hideNextButton =
    (!isCorrectingRuling && !isAssignedJudge) ||
    (isCorrectingRuling && !isAssignedJudge && !isAssignedRegistrar)

  const completeCase = async () => {
    if (isCompletedCase(workingCase.state)) {
      return true
    }

    return transitionCase(
      workingCase.id,
      workingCase.decision === CaseDecision.REJECTING
        ? CaseTransition.REJECT
        : workingCase.decision === CaseDecision.DISMISSING
        ? CaseTransition.DISMISS
        : CaseTransition.ACCEPT,
      setWorkingCase,
    )
  }

  const continueToSignedVerdictOverview = () => {
    router.push(`${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${workingCase.id}`)
  }

  const handleCompleteModification = async () => {
    const caseCompleted = await completeCase()

    if (caseCompleted) {
      setModalVisible(
        isAssignedJudge
          ? 'judgeRequestRulingSignatureModal'
          : 'registrarRequestRulingSignatureModal',
      )
    }
  }

  const completeCaseWithSignature = async () => {
    const caseCompleted = await completeCase()

    if (caseCompleted) {
      requestRulingSignature()
    }
  }

  const handleNextButtonClick = async () => {
    if (isCorrectingRuling) {
      setModalVisible('rulingModifiedModal')
    } else {
      completeCaseWithSignature()
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.restrictionCases.conclusion)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        <CourtCaseInfo workingCase={workingCase} />
        <Box marginBottom={9}>
          <Accordion>
            <PoliceRequestAccordionItem workingCase={workingCase} />
            <CourtRecordAccordionItem workingCase={workingCase} />
            <RulingAccordionItem workingCase={workingCase} />
          </Accordion>
        </Box>
        <Box marginBottom={7}>
          <BlueBox>
            <Box marginBottom={2} textAlign="center">
              <Text as="h3" variant="h3">
                {formatMessage(strings.conclusionTitle)}
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Box marginTop={1}>
                <Text variant="intro">{workingCase.conclusion}</Text>
              </Box>
            </Box>
            <Box marginBottom={1} textAlign="center">
              <Text variant="h4">{workingCase.judge?.name}</Text>
            </Box>
          </BlueBox>
        </Box>
        <Box marginBottom={3}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling"
          />
        </Box>
        <Box marginBottom={15}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="courtRecord"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.RESTRICTION_CASE_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextUrl={constants.CASES_ROUTE}
          nextButtonText={formatMessage(
            workingCase.decision === CaseDecision.ACCEPTING
              ? strings.continueButtonTextAccepting
              : workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY
              ? strings.continueButtonTextAcceptingPartially
              : workingCase.decision === CaseDecision.REJECTING
              ? strings.continueButtonTextRejecting
              : workingCase.decision === CaseDecision.DISMISSING
              ? strings.continueButtonTextDismissing
              : strings.continueButtonTextAcceptingAlternativeTravelBan,
          )}
          nextButtonIcon={
            isAcceptingCaseDecision(workingCase.decision) ||
            workingCase.decision ===
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
              ? 'checkmark'
              : 'close'
          }
          nextButtonColorScheme={
            isAcceptingCaseDecision(workingCase.decision) ||
            workingCase.decision ===
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
              ? 'default'
              : 'destructive'
          }
          onNextButtonClick={handleNextButtonClick}
          nextIsLoading={isTransitioningCase || isRequestingRulingSignature}
          hideNextButton={hideNextButton}
          infoBoxText={
            hideNextButton
              ? formatMessage(strings.onlyAssigendJudgeCanSign)
              : undefined
          }
        />
      </FormContentContainer>
      {modalVisible === 'rulingModifiedModal' && (
        <RulingModifiedModal
          onCancel={() => setModalVisible('none')}
          onContinue={handleCompleteModification}
        />
      )}
      {modalVisible === 'judgeRequestRulingSignatureModal' && (
        <JudgeRequestRulingSignatureModal
          onYes={requestRulingSignature}
          onNo={continueToSignedVerdictOverview}
        />
      )}
      {modalVisible === 'registrarRequestRulingSignatureModal' && (
        <RegistrarRequestRulingSignatureModal
          onContinue={continueToSignedVerdictOverview}
        />
      )}
      {modalVisible === 'signingModal' && (
        <SigningModal
          workingCase={workingCase}
          requestRulingSignature={requestRulingSignature}
          requestRulingSignatureResponse={requestRulingSignatureResponse}
          onClose={() => setModalVisible('none')}
        />
      )}
    </PageLayout>
  )
}

export default Confirmation
