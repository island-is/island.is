import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
  FormFooter,
  PoliceRequestAccordionItem,
  CourtRecordAccordionItem,
  PdfButton,
  CaseNumbers,
  PageLayout,
  FormContentContainer,
  RulingAccordionItem,
  BlueBox,
} from '@island.is/judicial-system-web/src/components'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  CaseDecision,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import SigningModal from '@island.is/judicial-system-web/src/components/SigningModal/SigningModal'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  core,
  rcConfirmation as m,
} from '@island.is/judicial-system-web/messages'
import type { RequestSignatureResponse } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const Confirmation: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [
    requestSignatureResponse,
    setRequestSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const { requestSignature, isRequestingSignature } = useCase()
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!modalVisible) {
      setRequestSignatureResponse(undefined)
    }
  }, [modalVisible, setRequestSignatureResponse])

  const handleNextButtonClick: () => Promise<void> = async () => {
    // Request signature to get control code
    try {
      const requestSignatureResponse = await requestSignature(workingCase.id)
      if (requestSignatureResponse) {
        setRequestSignatureResponse(requestSignatureResponse)
        setModalVisible(true)
      } else {
        // TODO: Handle error
      }
    } catch (e) {
      // TODO: Handle error
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.CONFIRMATION}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <>
        <FormContentContainer>
          <Box marginBottom={1}>
            <Text as="h1" variant="h1">
              Yfirlit úrskurðar
            </Text>
          </Box>
          <Box display="flex" marginBottom={10}>
            <Box marginRight={2}>
              <Text variant="small">{`Krafa stofnuð: ${formatDate(
                workingCase.created,
                'P',
              )}`}</Text>
            </Box>
            <Text variant="small">{`Þinghald: ${formatDate(
              workingCase.courtStartDate,
              'P',
            )}`}</Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <CaseNumbers workingCase={workingCase} />
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
              pdfType="ruling?shortVersion=false"
            />
          </Box>
          <Box marginBottom={15}>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRulingShortVersion)}
              pdfType="ruling?shortVersion=true"
            />
          </Box>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={`${Constants.RULING_STEP_TWO_ROUTE}/${workingCase.id}`}
            nextUrl={Constants.REQUEST_LIST_ROUTE}
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
            nextIsLoading={isRequestingSignature}
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
            requestSignatureResponse={requestSignatureResponse}
            setModalVisible={setModalVisible}
          />
        )}
      </>
    </PageLayout>
  )
}

export default Confirmation
