import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
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
  PageTitle,
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

  const isCompletedWithoutRuling = Boolean(workingCase.isCompletedWithoutRuling)
  const isCorrectingRuling = Boolean(workingCase.requestCompletedDate)
  const isRulingSigned = Boolean(workingCase.rulingSignatureDate)
  const isAssignedJudge = user && workingCase.judge?.id === user.id
  const isAssignedRegistrar = user && workingCase.registrar?.id === user.id
  const hideNextButton = !isCompletedWithoutRuling
    ? isCorrectingRuling
      ? !isAssignedJudge && !isAssignedRegistrar
      : !isAssignedJudge
    : false

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

  const completeCaseWith = async (
    action: 'signature' | 'noSignature' | 'askIfSignature',
  ) => {
    const caseCompleted = await completeCase()

    if (!caseCompleted) {
      return
    }

    switch (action) {
      case 'signature':
        requestRulingSignature()
        break
      case 'noSignature':
        continueToSignedVerdictOverview()
        break
      case 'askIfSignature':
        setModalVisible(
          isAssignedJudge
            ? 'judgeRequestRulingSignatureModal'
            : 'registrarRequestRulingSignatureModal',
        )
        break
    }
  }

  const handleNextButtonClick = async () => {
    if (isCorrectingRuling) {
      setModalVisible('rulingModifiedModal')

      return
    }

    await completeCaseWith(
      isCompletedWithoutRuling ? 'noSignature' : 'signature',
    )
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.conclusion)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
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
            disabled={isCompletedWithoutRuling}
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
          previousUrl={`${constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextUrl={getStandardUserDashboardRoute(user)}
          nextIsLoading={isTransitioningCase || isRequestingRulingSignature}
          nextButtonText={formatMessage(
            isCompletedWithoutRuling
              ? strings.continueButtonTextCompletedWithoutRuling
              : workingCase.decision === CaseDecision.ACCEPTING
              ? strings.continueButtonTextAccepting
              : workingCase.decision === CaseDecision.REJECTING
              ? strings.continueButtonTextRejecting
              : workingCase.decision === CaseDecision.DISMISSING
              ? strings.continueButtonTextDismissing
              : strings.continueButtonTextAcceptingPartially,
          )}
          nextButtonIcon={
            isAcceptingCaseDecision(workingCase.decision) ||
            isCompletedWithoutRuling
              ? 'checkmark'
              : 'close'
          }
          nextButtonColorScheme={
            isAcceptingCaseDecision(workingCase.decision) ||
            isCompletedWithoutRuling
              ? 'default'
              : 'destructive'
          }
          onNextButtonClick={handleNextButtonClick}
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
          onContinue={() =>
            completeCaseWith(
              !isCompletedWithoutRuling
                ? !isRulingSigned
                  ? // The previous ruling was not signed, so we need a signature from the assigned judge
                    isAssignedJudge
                    ? // Since the assigned judge is mmodifying the ruling, we immediately ask for the signature
                      'signature'
                    : // Since the assigned judge is not mmodifying the ruling, we simply continue to the signed verdict overview
                      'noSignature'
                  : // The previous ruling was signed, so we ask if a new signature is needed
                    'askIfSignature'
                : // The case is completed without a ruling, so no signature is needed
                  'noSignature',
            )
          }
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
