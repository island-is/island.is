import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
  FormFooter,
  PoliceRequestAccordionItem,
  CourtRecordAccordionItem,
  PdfButton,
  CourtCaseInfo,
  PageLayout,
  FormContentContainer,
  RulingAccordionItem,
  BlueBox,
  FormContext,
  useRequestRulingSignature,
  SigningModal,
} from '@island.is/judicial-system-web/src/components'
import {
  RestrictionCaseCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  CaseDecision,
  CaseTransition,
  completedCaseStates,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  core,
  rcConfirmation as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import * as constants from '@island.is/judicial-system/consts'

export const Confirmation: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const { transitionCase } = useCase()
  const {
    requestRulingSignature,
    requestRulingSignatureResponse,
    isRequestingRulingSignature,
  } = useRequestRulingSignature(workingCase.id, () => setModalVisible(true))

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const shouldSign =
      completedCaseStates.includes(workingCase.state) ||
      (await transitionCase(
        workingCase,
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

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={RestrictionCaseCourtSubsections.CONFIRMATION}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.restrictionCases.conclusion)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit úrskurðar
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
                {formatMessage(m.sections.conclusion.title)}
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Box marginTop={1}>
                <Text variant="intro">{workingCase.conclusion}</Text>
              </Box>
            </Box>
            <Box marginBottom={1} textAlign="center">
              <Text variant="h4">{workingCase?.judge?.name}</Text>
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
              ? m.footer.accepting.continueButtonText
              : workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY
              ? m.footer.acceptingPartially.continueButtonText
              : workingCase.decision === CaseDecision.REJECTING
              ? m.footer.rejecting.continueButtonText
              : workingCase.decision === CaseDecision.DISMISSING
              ? m.footer.dismissing.continueButtonText
              : m.footer.acceptingAlternativeTravelBan.continueButtonText,
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
          nextIsLoading={isRequestingRulingSignature}
          hideNextButton={workingCase.judge?.id !== user?.id}
          infoBoxText={
            workingCase.judge?.id !== user?.id
              ? 'Einungis skráður dómari getur undirritað úrskurð'
              : undefined
          }
        />
      </FormContentContainer>
      {modalVisible && (
        <SigningModal
          workingCase={workingCase}
          requestRulingSignature={requestRulingSignature}
          requestRulingSignatureResponse={requestRulingSignatureResponse}
          onClose={() => setModalVisible(false)}
        />
      )}
    </PageLayout>
  )
}

export default Confirmation
