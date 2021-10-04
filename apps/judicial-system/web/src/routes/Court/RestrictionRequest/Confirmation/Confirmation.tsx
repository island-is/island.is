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
  CourtCaseFactsAndLegalArgumentsAccordionItem,
} from '@island.is/judicial-system-web/src/shared-components'
import { getAppealDecisionText } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  formatDate,
  formatCustodyRestrictions,
  formatAlternativeTravelBanRestrictions,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'
import {
  AppealDecisionRole,
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system/types'
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
import * as style from './Confirmation.treat'

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

  const custodyRestrictions = formatCustodyRestrictions(
    workingCase?.accusedGender,
    workingCase?.custodyRestrictions,
  )

  const alternativeTravelBanRestrictions = formatAlternativeTravelBanRestrictions(
    workingCase?.accusedGender,
    workingCase?.custodyRestrictions,
    workingCase?.otherRestrictions,
  )

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
                <CourtCaseFactsAndLegalArgumentsAccordionItem
                  workingCase={workingCase}
                />
              </Accordion>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Úrskurður Héraðsdóms
                </Text>
              </Box>
              <Box marginBottom={7}>
                <Text variant="eyebrow" color="blue400">
                  Niðurstaða
                </Text>
                <Text>
                  <span className={style.breakSpaces}>
                    {workingCase.ruling}
                  </span>
                </Text>
              </Box>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Úrskurðarorð
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Box marginTop={1}>
                  <Text variant="intro">{workingCase.conclusion}</Text>
                </Box>
              </Box>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={1}>
                <Text variant="h3">
                  {workingCase.judge
                    ? `${workingCase.judge.name} ${workingCase.judge.title}`
                    : `Enginn dómari skráður`}
                </Text>
              </Box>
              <Text>
                Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={1}>
                <Text as="h3" variant="h3">
                  Ákvörðun um kæru
                </Text>
              </Box>
              <Box marginBottom={1}>
                <Text>
                  {formatMessage(m.sections.accusedAppealDecision.disclaimer)}
                </Text>
              </Box>
              <Box marginBottom={1}>
                <Text variant="h4">
                  {getAppealDecisionText(
                    AppealDecisionRole.ACCUSED,
                    workingCase.accusedAppealDecision,
                    workingCase.accusedGender,
                  )}
                </Text>
              </Box>
              <Text variant="h4">
                {getAppealDecisionText(
                  AppealDecisionRole.PROSECUTOR,
                  workingCase.prosecutorAppealDecision,
                  workingCase.accusedGender,
                )}
              </Text>
              {(workingCase.accusedAppealAnnouncement ||
                workingCase.prosecutorAppealAnnouncement) && (
                <Box component="section" marginTop={3}>
                  {workingCase.accusedAppealAnnouncement &&
                    workingCase.accusedAppealDecision ===
                      CaseAppealDecision.APPEAL && (
                      <Box>
                        <Text variant="eyebrow" color="blue400">
                          {`Yfirlýsing um kæru ${formatAccusedByGender(
                            workingCase.accusedGender,
                            NounCases.GENITIVE,
                          )}`}
                        </Text>
                        <Text>{workingCase.accusedAppealAnnouncement}</Text>
                      </Box>
                    )}
                  {workingCase.prosecutorAppealAnnouncement &&
                    workingCase.prosecutorAppealDecision ===
                      CaseAppealDecision.APPEAL && (
                      <Box marginTop={2}>
                        <Text variant="eyebrow" color="blue400">
                          Yfirlýsing um kæru sækjanda
                        </Text>
                        <Text>{workingCase.prosecutorAppealAnnouncement}</Text>
                      </Box>
                    )}
                </Box>
              )}
            </Box>
            {workingCase.type === CaseType.CUSTODY &&
              workingCase.decision === CaseDecision.ACCEPTING && (
                <Box marginBottom={7}>
                  <Box marginBottom={1}>
                    <Text as="h3" variant="h3">
                      Tilhögun gæsluvarðhalds
                    </Text>
                  </Box>
                  {custodyRestrictions && (
                    <Box marginBottom={2}>
                      <Text>{custodyRestrictions}</Text>
                    </Box>
                  )}
                  <Text>
                    {formatMessage(m.sections.custodyRestrictions.disclaimer, {
                      caseType: 'gæsluvarðhaldsins',
                    })}
                  </Text>
                </Box>
              )}
            {((workingCase.type === CaseType.CUSTODY &&
              workingCase.decision ===
                CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) ||
              (workingCase.type === CaseType.TRAVEL_BAN &&
                workingCase.decision === CaseDecision.ACCEPTING)) && (
              <Box marginBottom={7}>
                <Box marginBottom={1}>
                  <Text as="h3" variant="h3">
                    Tilhögun farbanns
                  </Text>
                </Box>
                {alternativeTravelBanRestrictions && (
                  <Box marginBottom={2}>
                    <Text>
                      {alternativeTravelBanRestrictions
                        .split('\n')
                        .map((str, index) => {
                          return (
                            <div key={index}>
                              <Text>{str}</Text>
                            </div>
                          )
                        })}
                    </Text>
                  </Box>
                )}
                <Text>
                  {formatMessage(m.sections.custodyRestrictions.disclaimer, {
                    caseType: 'farbannsins',
                  })}
                </Text>
              </Box>
            )}
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
