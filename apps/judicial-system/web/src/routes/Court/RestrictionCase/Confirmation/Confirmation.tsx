import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
  FormFooter,
  PoliceRequestAccordionItem,
  CourtRecordAccordionItem,
  PdfButton,
  CaseInfo,
  PageLayout,
  FormContentContainer,
  RulingAccordionItem,
  BlueBox,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  CaseDecision,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import type { RequestSignatureResponse } from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import SigningModal from '@island.is/judicial-system-web/src/components/SigningModal/SigningModal'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  core,
  rcConfirmation as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system/consts'

export const Confirmation: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [
    requestRulingSignatureResponse,
    setRequestRulingSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const { requestRulingSignature, isRequestingRulingSignature } = useCase()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (!modalVisible) {
      setRequestRulingSignatureResponse(undefined)
    }
  }, [modalVisible, setRequestRulingSignatureResponse])

  const handleNextButtonClick: () => Promise<void> = async () => {
    if (!workingCase) {
      return
    }

    // Request ruling signature to get control code
    const requestRulingSignatureResponse = await requestRulingSignature(
      workingCase.id,
    )
    if (requestRulingSignatureResponse) {
      setRequestRulingSignatureResponse(requestRulingSignatureResponse)
      setModalVisible(true)
    } else {
      // TODO: Handle error
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.CONFIRMATION}
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
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
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
              <Text variant="h4">
                {workingCase?.judge ? workingCase.judge.name : user?.name}
              </Text>
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
          previousUrl={`${Constants.COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextUrl={Constants.CASE_LIST_ROUTE}
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
          setWorkingCase={setWorkingCase}
          requestRulingSignatureResponse={requestRulingSignatureResponse}
          setModalVisible={setModalVisible}
        />
      )}
    </PageLayout>
  )
}

export default Confirmation
