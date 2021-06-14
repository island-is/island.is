import { Accordion, Box, Text } from '@island.is/island-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import {
  FormFooter,
  Modal,
  PoliceRequestAccordionItem,
  CourtRecordAccordionItem,
  PdfButton,
  CaseNumbers,
  PageLayout,
  FormContentContainer,
  CourtCaseFactsAndLegalArgumentsAccordionItem,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  getConclusion,
  getAppealDecisionText,
} from '@island.is/judicial-system-web/src/utils/stepHelper'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
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
  Case,
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseTransition,
  CaseType,
  NotificationType,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
} from '@island.is/judicial-system/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import {
  RequestSignatureMutation,
  SignatureConfirmationQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import { useRouter } from 'next/router'
import * as style from './Confirmation.treat'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface SigningModalProps {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  requestSignatureResponse?: RequestSignatureResponse
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SigningModal: React.FC<SigningModalProps> = ({
  workingCase,
  setWorkingCase,
  requestSignatureResponse,
  setModalVisible,
}) => {
  const router = useRouter()
  const [
    signatureConfirmationResponse,
    setSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()

  const { transitionCase, sendNotification } = useCase()

  const { data } = useQuery(SignatureConfirmationQuery, {
    variables: {
      input: {
        caseId: workingCase.id,
        documentToken: requestSignatureResponse?.documentToken,
      },
    },
    fetchPolicy: 'no-cache',
  })
  // TODO: Handle case when resSignatureConfirmationResponse is never set
  const resSignatureConfirmationResponse = data?.signatureConfirmation

  useEffect(() => {
    const completeSigning = async (
      resSignatureConfirmationResponse: SignatureConfirmationResponse,
    ) => {
      if (resSignatureConfirmationResponse.documentSigned) {
        const caseCompleted =
          workingCase.state === CaseState.RECEIVED
            ? await transitionCase(
                workingCase,
                setWorkingCase,
                workingCase.decision === CaseDecision.REJECTING
                  ? CaseTransition.REJECT
                  : CaseTransition.ACCEPT,
              )
            : workingCase.state === CaseState.REJECTED ||
              workingCase.state === CaseState.ACCEPTED

        if (caseCompleted) {
          await sendNotification(workingCase.id, NotificationType.RULING)
        }
      }

      setSignatureConfirmationResponse(resSignatureConfirmationResponse)
    }

    if (resSignatureConfirmationResponse) {
      completeSigning(resSignatureConfirmationResponse)
    }
  }, [
    resSignatureConfirmationResponse,
    setSignatureConfirmationResponse,
    transitionCase,
    sendNotification,
  ])

  const renderControlCode = () => {
    return (
      <>
        <Box marginBottom={2}>
          <Text variant="h2" color="blue400">
            {`Öryggistala: ${requestSignatureResponse?.controlCode}`}
          </Text>
        </Box>
        <Text>
          Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama
          öryggistala birtist í símanum þínum.
        </Text>
      </>
    )
  }

  return (
    <Modal
      title={
        !signatureConfirmationResponse
          ? 'Rafræn undirritun'
          : signatureConfirmationResponse.documentSigned
          ? 'Úrskurður hefur verið staðfestur og undirritaður'
          : signatureConfirmationResponse.code === 7023 // User cancelled
          ? 'Notandi hætti við undirritun'
          : 'Undirritun tókst ekki'
      }
      text={
        !signatureConfirmationResponse
          ? renderControlCode()
          : signatureConfirmationResponse.documentSigned
          ? 'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð. Auk þess hefur útdráttur verið sendur á fangelsi. \n\nÞú getur komið ábendingum á framfæri við þróunarteymi Réttarvörslugáttar um það sem mætti betur fara í vinnslu mála með því að smella á takkann hér fyrir neðan.'
          : 'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.'
      }
      secondaryButtonText={
        !signatureConfirmationResponse
          ? undefined
          : signatureConfirmationResponse.documentSigned
          ? 'Loka glugga'
          : 'Loka og reyna aftur'
      }
      primaryButtonText={signatureConfirmationResponse ? 'Senda ábendingu' : ''}
      handlePrimaryButtonClick={() => {
        window.open(Constants.FEEDBACK_FORM_URL, '_blank')
        router.push(Constants.REQUEST_LIST_ROUTE)
      }}
      handleSecondaryButtonClick={async () => {
        if (signatureConfirmationResponse?.documentSigned === true) {
          router.push(Constants.REQUEST_LIST_ROUTE)
        } else {
          setModalVisible(false)
        }
      }}
    />
  )
}

export const Confirmation: React.FC = () => {
  const router = useRouter()
  const id = router.query.id
  const [workingCase, setWorkingCase] = useState<Case>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [
    requestSignatureResponse,
    setRequestSignatureResponse,
  ] = useState<RequestSignatureResponse>()

  const { user } = useContext(UserContext)
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

  const [
    requestSignatureMutation,
    { loading: isRequestingSignature },
  ] = useMutation(RequestSignatureMutation)

  const requestSignature = async (id: string) => {
    const { data } = await requestSignatureMutation({
      variables: { input: { caseId: id } },
    })

    return data?.requestSignature
  }

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
                {getConclusion(workingCase, true)}
                {workingCase.additionToConclusion && (
                  <Box marginTop={1}>
                    <Text variant="intro">
                      {workingCase.additionToConclusion}
                    </Text>
                  </Box>
                )}
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
                  Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra
                  úrskurð þennan til Landsréttar innan þriggja sólarhringa.
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
            {workingCase.decision === CaseDecision.ACCEPTING &&
              workingCase.type === CaseType.CUSTODY && (
                <Box marginBottom={7}>
                  <Box marginBottom={1}>
                    <Text as="h3" variant="h3">
                      Tilhögun gæsluvarðhalds
                    </Text>
                  </Box>
                  <Box marginBottom={2}>
                    <Text>
                      {formatCustodyRestrictions(
                        workingCase.accusedGender,
                        workingCase.custodyRestrictions,
                      )}
                    </Text>
                  </Box>
                  <Text>
                    Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt
                    að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir
                    dómara.
                  </Text>
                </Box>
              )}
            {(workingCase.decision ===
              CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN ||
              (workingCase.type === CaseType.TRAVEL_BAN &&
                workingCase.decision === CaseDecision.ACCEPTING)) && (
              <Box marginBottom={7}>
                <Box marginBottom={1}>
                  <Text as="h3" variant="h3">
                    Tilhögun farbanns
                  </Text>
                </Box>
                <Box marginBottom={2}>
                  <Text>
                    {formatAlternativeTravelBanRestrictions(
                      workingCase.accusedGender,
                      workingCase.custodyRestrictions,
                      workingCase.otherRestrictions,
                    )
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
                <Text>
                  Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að
                  bera atriði er lúta að framkvæmd farbannsins undir dómara.
                </Text>
              </Box>
            )}
            <Box marginBottom={15}>
              <PdfButton
                caseId={workingCase.id}
                title="Opna PDF þingbók og úrskurð"
                pdfType="ruling"
              />
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.RULING_STEP_TWO_ROUTE}/${workingCase.id}`}
              nextUrl={Constants.REQUEST_LIST_ROUTE}
              nextButtonText="Staðfesta og hefja undirritun"
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
