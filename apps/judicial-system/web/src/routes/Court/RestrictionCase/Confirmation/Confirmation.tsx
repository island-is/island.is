import { useRouter } from 'next/router'
import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, Box } from '@island.is/island-ui/core'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  Conclusion,
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
  SignatureConfirmationModal,
  SigningMethodSelectionModal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  CaseTransition,
  RequestSignatureResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  isAcceptingCaseDecision,
  isCompletedCase,
} from '@island.is/judicial-system/types'

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
  | 'signingMethodSelectionModal'
  | 'signingConfirmationModal'

const Confirmation: FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { transitionCase, isTransitioningCase } = useCase()
  const [rulingSignatureResponse, setRulingSignatureResponse] =
    useState<RequestSignatureResponse>()
  const [isRulingSignatureAudkenni, setIsRulingSignatureAudkenni] =
    useState<boolean>(false)

  const [modalVisible, setModalVisible] = useState<VisibleModal>('none')

  const isCorrectingRuling = Boolean(workingCase.requestCompletedDate)
  const isRulingSigned = Boolean(workingCase.rulingSignatureDate)
  const isAssignedJudge = user && workingCase.judge?.id === user.id
  const isAssignedRegistrar = user && workingCase.registrar?.id === user.id
  const hideNextButton = isCorrectingRuling
    ? !isAssignedJudge && !isAssignedRegistrar
    : !isAssignedJudge

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
        setModalVisible('signingMethodSelectionModal')
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

    completeCaseWith('signature')
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
          <Conclusion
            title={formatMessage(strings.conclusionTitle)}
            conclusionText={workingCase.conclusion}
            judgeName={workingCase.judge?.name}
          />
        </Box>
        <Box marginBottom={3}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling"
            elementId={formatMessage(core.pdfButtonRuling)}
          />
        </Box>
        <Box marginBottom={15}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRulingShortVersion)}
            pdfType="courtRecord"
            elementId={formatMessage(core.pdfButtonRulingShortVersion)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.RESTRICTION_CASE_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextUrl={getStandardUserDashboardRoute(user)}
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
          nextIsLoading={isTransitioningCase}
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
              !isRulingSigned
                ? // The previous ruling was not signed, so we need a signature from the assigned judge
                  isAssignedJudge
                  ? // Since the assigned judge is mmodifying the ruling, we immediately ask for the signature
                    'signature'
                  : // Since the assigned judge is not mmodifying the ruling, we simply continue to the signed verdict overview
                    'noSignature'
                : // The previous ruling was signed, so we ask if a new signature is needed
                  'askIfSignature',
            )
          }
        />
      )}
      {modalVisible === 'judgeRequestRulingSignatureModal' && (
        <JudgeRequestRulingSignatureModal
          onYes={() => setModalVisible('signingMethodSelectionModal')}
          onNo={continueToSignedVerdictOverview}
        />
      )}
      {modalVisible === 'registrarRequestRulingSignatureModal' && (
        <RegistrarRequestRulingSignatureModal
          onContinue={continueToSignedVerdictOverview}
        />
      )}
      {modalVisible === 'signingMethodSelectionModal' && (
        <SigningMethodSelectionModal
          workingCase={workingCase}
          signatureType="ruling"
          onClose={() => {
            setModalVisible('none')
          }}
          onSignatureRequested={(response, isAudkenni) => {
            setRulingSignatureResponse(response)
            setIsRulingSignatureAudkenni(isAudkenni)
            setModalVisible('signingConfirmationModal')
          }}
        />
      )}
      {modalVisible === 'signingConfirmationModal' && rulingSignatureResponse && (
        <SignatureConfirmationModal
          workingCase={workingCase}
          signatureResponse={rulingSignatureResponse}
          signatureType="ruling"
          isAudkenni={
            rulingSignatureResponse ? isRulingSignatureAudkenni : false
          }
          onClose={() => {
            setRulingSignatureResponse(undefined)
            setIsRulingSignatureAudkenni(false)
            setModalVisible('none')
          }}
          navigateOnClose={true}
        />
      )}
    </PageLayout>
  )
}

export default Confirmation
