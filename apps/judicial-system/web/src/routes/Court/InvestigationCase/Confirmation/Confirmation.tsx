import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  BlueBox,
  CaseInfo,
  CourtRecordAccordionItem,
  FormContentContainer,
  FormFooter,
  PageLayout,
  PdfButton,
  PoliceRequestAccordionItem,
  RulingAccordionItem,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import SigningModal, {
  useRequestRulingSignature,
} from '@island.is/judicial-system-web/src/components/SigningModal/SigningModal'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  core,
  titles,
  icConfirmation as m,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { Accordion, Box, Text } from '@island.is/island-ui/core'
import {
  CaseDecision,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

const Confirmation = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const {
    requestRulingSignature,
    requestRulingSignatureResponse,
    isRequestingRulingSignature,
  } = useRequestRulingSignature(workingCase.id, () => setModalVisible(true))

  const { user } = useContext(UserContext)

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
        title={formatMessage(titles.court.investigationCases.conclusion)}
      />
      {user && (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                Yfirlit úrskurðar
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <CaseInfo workingCase={workingCase} userRole={user.role} />
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
              previousUrl={`${constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`}
              nextUrl={constants.CASE_LIST_ROUTE}
              nextIsLoading={isRequestingRulingSignature}
              nextButtonText={formatMessage(
                workingCase.decision === CaseDecision.ACCEPTING
                  ? m.footer.accepting.continueButtonText
                  : workingCase.decision === CaseDecision.REJECTING
                  ? m.footer.rejecting.continueButtonText
                  : workingCase.decision === CaseDecision.DISMISSING
                  ? m.footer.dismissing.continueButtonText
                  : m.footer.acceptingPartially.continueButtonText,
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
              onNextButtonClick={requestRulingSignature}
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
              onClose={() => setModalVisible(false)}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default Confirmation
