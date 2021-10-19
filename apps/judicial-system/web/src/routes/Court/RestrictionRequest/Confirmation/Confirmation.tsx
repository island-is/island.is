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
} from '@island.is/judicial-system-web/src/shared-components'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { CaseDecision } from '@island.is/judicial-system/types'
import type {
  Case,
  RequestSignatureResponse,
} from '@island.is/judicial-system/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { useRouter } from 'next/router'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import SigningModal from '@island.is/judicial-system-web/src/shared-components/SigningModal/SigningModal'
import {
  core,
  rcConfirmation as m,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const Confirmation: React.FC = () => {
  const router = useRouter()
  const id = router.query.id
  const [workingCase, setWorkingCase] = useState<Case>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [
    requestSignatureResponse,
    setRequestSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const { requestSignature, isRequestingSignature } = useCase()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  useEffect(() => {
    if (!modalVisible) {
      setRequestSignatureResponse(undefined)
    }
  }, [modalVisible, setRequestSignatureResponse])

  const handleNextButtonClick: () => Promise<void> = async () => {
    if (!workingCase) {
      return
    }

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
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.CONFIRMATION}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
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
              <Text
                variant="h2"
                as="h2"
              >{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box marginBottom={9}>
              <Accordion>
                <PoliceRequestAccordionItem workingCase={workingCase} />
                <CourtRecordAccordionItem workingCase={workingCase} />
                <RulingAccordionItem workingCase={workingCase} startExpanded />
              </Accordion>
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
                  : workingCase.decision === CaseDecision.REJECTING
                  ? m.footer.rejecting.continueButtonText
                  : workingCase.decision === CaseDecision.DISMISSING
                  ? m.footer.dismissing.continueButtonText
                  : m.footer.acceptingAlternativeTravelBan.continueButtonText,
              )}
              nextButtonIcon={
                workingCase.decision &&
                [
                  CaseDecision.ACCEPTING,
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
                ].includes(workingCase.decision)
                  ? 'checkmark'
                  : 'close'
              }
              nextButtonColorScheme={
                workingCase.decision &&
                [
                  CaseDecision.ACCEPTING,
                  CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
                ].includes(workingCase.decision)
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
      ) : null}
    </PageLayout>
  )
}

export default Confirmation
