import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseDecision,
  CaseTransition,
  completedCaseStates,
  isAcceptingCaseDecision,
  NotificationType,
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
import { RulingModifiedModal } from '@island.is/judicial-system-web/src/routes/Court/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { confirmation as strings } from './Confirmation.strings'

type VisibleModal = 'none' | 'rulingModifiedModal' | 'signingModal'

const Confirmation = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const [modalVisible, setModalVisible] = useState<VisibleModal>('none')

  const { transitionCase } = useCase()
  const {
    requestRulingSignature,
    requestRulingSignatureResponse,
    isRequestingRulingSignature,
  } = useRequestRulingSignature(workingCase.id, () =>
    setModalVisible('signingModal'),
  )

  const { user } = useContext(UserContext)

  async function signRuling() {
    const shouldSign =
      completedCaseStates.includes(workingCase.state) ||
      (await transitionCase(
        workingCase.id,
        workingCase.decision === CaseDecision.REJECTING
          ? CaseTransition.REJECT
          : workingCase.decision === CaseDecision.DISMISSING
          ? CaseTransition.DISMISS
          : CaseTransition.ACCEPT,
        setWorkingCase,
      ))

    if (shouldSign) {
      requestRulingSignature()
    }
  }

  const handleNextButtonClick = async () => {
    const isCorrectingRuling = workingCase.notifications?.some(
      (notification) => notification.type === NotificationType.RULING,
    )

    if (isCorrectingRuling) {
      setModalVisible('rulingModifiedModal')
      return
    }

    await signRuling()
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
      {user && (
        <>
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
              previousUrl={`${constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE}/${workingCase.id}`}
              nextUrl={constants.CASES_ROUTE}
              nextIsLoading={isRequestingRulingSignature}
              nextButtonText={formatMessage(
                workingCase.decision === CaseDecision.ACCEPTING
                  ? strings.continueButtonTextAccepting
                  : workingCase.decision === CaseDecision.REJECTING
                  ? strings.continueButtonTextRejecting
                  : workingCase.decision === CaseDecision.DISMISSING
                  ? strings.continueButtonTextDismissing
                  : strings.continueButtonTextAcceptingPartially,
              )}
              nextButtonIcon={
                isAcceptingCaseDecision(workingCase.decision)
                  ? 'checkmark'
                  : 'close'
              }
              nextButtonColorScheme={
                isAcceptingCaseDecision(workingCase.decision)
                  ? 'default'
                  : 'destructive'
              }
              onNextButtonClick={handleNextButtonClick}
              hideNextButton={workingCase.judge?.id !== user?.id}
              infoBoxText={
                workingCase.judge?.id !== user?.id
                  ? 'Einungis skráður dómari getur undirritað úrskurð'
                  : undefined
              }
            />
          </FormContentContainer>
          {modalVisible === 'rulingModifiedModal' && (
            <RulingModifiedModal
              onCancel={() => setModalVisible('none')}
              onContinue={signRuling}
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
        </>
      )}
    </PageLayout>
  )
}

export default Confirmation
