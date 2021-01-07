import {
  Accordion,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import Modal from '../../../shared-components/Modal/Modal'
import {
  constructConclusion,
  getAppealDecitionText,
  isNextDisabled,
} from '../../../utils/stepHelper'
import * as Constants from '../../../utils/constants'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { parseTransition } from '../../../utils/formatters'
import { AppealDecisionRole, JudgeSubsections, Sections } from '../../../types'
import {
  Case,
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseTransition,
  NotificationType,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { useHistory, useParams } from 'react-router-dom'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import PoliceRequestAccordionItem from '@island.is/judicial-system-web/src/shared-components/PoliceRequestAccordionItem/PoliceRequestAccordionItem'
import * as style from './Confirmation.treat'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { api } from '../../../services'
import CourtRecordAccordionItem from '../../../shared-components/CourtRecordAccordionItem/CourtRecordAccordionItem'
import {
  RequestSignatureMutation,
  SignatureConfirmationQuery,
} from '../../../utils/mutations'
import { Validation } from '../../../utils/validate'
import TimeInputField from '../../../shared-components/TimeInputField/TimeInputField'
import {
  getTimeFromDate,
  validateAndSendTimeToServer,
  validateAndSetTime,
} from '../../../utils/formHelper'

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
  const history = useHistory()
  const [
    signatureConfirmationResponse,
    setSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()

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

  const [transitionCaseMutation] = useMutation(TransitionCaseMutation)

  const transitionCase = useCallback(async () => {
    if (workingCase.state === CaseState.RECEIVED) {
      // Transition case from received state to either accepted or rejected
      try {
        // Parse the transition request
        const transitionRequest = parseTransition(
          workingCase.modified,
          workingCase.decision === CaseDecision.REJECTING
            ? CaseTransition.REJECT
            : CaseTransition.ACCEPT,
        )

        const { data } = await transitionCaseMutation({
          variables: { input: { id: workingCase.id, ...transitionRequest } },
        })

        if (!data) {
          // TODO: Handle error
          return
        }

        const { resCase } = data

        if (!resCase) {
          // TODO: Handle error
          return
        }

        setWorkingCase({
          ...workingCase,
          state: resCase.state,
          judge: resCase.judge,
        })
      } catch (e) {
        console.log(e)

        // TODO: Handle error
      }

      return
    }

    // Expect case to already have the right state
    if (
      workingCase.decision === CaseDecision.REJECTING
        ? workingCase.state !== CaseState.REJECTED
        : workingCase.state !== CaseState.ACCEPTED
    ) {
      // TODO: Handle error
    }
  }, [transitionCaseMutation, workingCase, setWorkingCase])

  const [sendNotificationMutation] = useMutation(SendNotificationMutation)

  const sendNotification = useCallback(async () => {
    try {
      const { data } = await sendNotificationMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            type: NotificationType.RULING,
          },
        },
      })

      if (!data) {
        // TODO: Handle error
        return
      }

      const {
        sendNotification: { notificationSent },
      } = data

      if (!notificationSent) {
        // TODO: Handle error
      }
    } catch (e) {
      console.log(e)

      // TODO: Handle error
    }
  }, [sendNotificationMutation, workingCase.id])

  useEffect(() => {
    const completeSigning = async (
      resSignatureResponse: SignatureConfirmationResponse,
    ) => {
      await transitionCase()

      await sendNotification()

      setSignatureConfirmationResponse(resSignatureResponse)
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
          ? 'Úrskurður hefur verið sendur á ákæranda, verjanda og dómara sem kvað upp úrskurð. Auk þess hefur útdráttur verið sendur á fangelsi.'
          : 'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.'
      }
      secondaryButtonText={
        !signatureConfirmationResponse
          ? undefined
          : signatureConfirmationResponse.documentSigned
          ? 'Loka glugga'
          : 'Loka og reyna aftur'
      }
      primaryButtonText={
        signatureConfirmationResponse ? 'Gefa endurgjöf á gáttina' : ''
      }
      handlePrimaryButtonClick={() => {
        history.push(Constants.FEEDBACK_FORM_ROUTE)
      }}
      handleSecondaryButtonClick={async () => {
        if (signatureConfirmationResponse?.documentSigned === true) {
          history.push(Constants.DETENTION_REQUESTS_ROUTE)
        } else {
          setModalVisible(false)
        }
      }}
    />
  )
}

interface CaseData {
  case?: Case
}

export const Confirmation: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [
    courtDocumentEndErrorMessage,
    setCourtDocumentEndErrorMessage,
  ] = useState<string>('')
  const [requestSignatureResponse, setRequestSignatureResponse] = useState<
    RequestSignatureResponse
  >()

  const { id } = useParams<{ id: string }>()
  const { user } = useContext(UserContext)
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const updateCase = useCallback(
    async (id: string, updateCase: UpdateCase) => {
      const { data } = await updateCaseMutation({
        variables: { input: { id, ...updateCase } },
      })
      const resCase = data?.updateCase
      if (resCase) {
        // Do something with the result. In particular, we want th modified timestamp passed between
        // the client and the backend so that we can handle multiple simultanious updates.
      }
      return resCase
    },
    [updateCaseMutation],
  )

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: getTimeFromDate(workingCase?.courtEndTime) || '',
        validations: ['empty', 'time-format'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, isStepIllegal])

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
      activeSubSection={Sections.JUDGE}
      activeSection={JudgeSubsections.CONFIRMATION}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
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
              workingCase.courtStartTime,
              'P',
            )}`}</Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Text
              variant="h2"
              as="h2"
            >{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
          </Box>
          <Box marginBottom={9}>
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
              <CourtRecordAccordionItem workingCase={workingCase} />
            </Accordion>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h4" variant="h4">
                Úrskurður Héraðsdóms
              </Text>
            </Box>
            <Box marginBottom={7}>
              <Text variant="eyebrow" color="blue400">
                Niðurstaða úrskurðar
              </Text>
              <Text>
                <span className={style.breakSpaces}>{workingCase.ruling}</span>
              </Text>
            </Box>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h4" variant="h4">
                Úrskurðarorð
              </Text>
            </Box>
            <Box marginBottom={3}>{constructConclusion(workingCase)}</Box>
            <Text>
              Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.
            </Text>
          </Box>
          <Box component="section" marginBottom={3}>
            <Box marginBottom={1}>
              <Text as="h4" variant="h4">
                Ákvörðun um kæru
              </Text>
            </Box>
            <Box marginBottom={1}>
              <Text>
                Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð
                þennan til Landsréttar innan þriggja sólarhringa. Dómari bendir
                kærða á að honum sé heimilt að bera atriði er lúta að framkvæmd
                gæsluvarðhaldsins undir dómara.
              </Text>
            </Box>
            <Box marginBottom={1}>
              <Text variant="h4">
                {getAppealDecitionText(
                  AppealDecisionRole.ACCUSED,
                  workingCase.accusedAppealDecision,
                )}
              </Text>
            </Box>
            <Text variant="h4">
              {getAppealDecitionText(
                AppealDecisionRole.PROSECUTOR,
                workingCase.prosecutorAppealDecision,
              )}
            </Text>
          </Box>
          {(workingCase.accusedAppealAnnouncement ||
            workingCase.prosecutorAppealAnnouncement) && (
            <Box component="section" marginBottom={6}>
              {workingCase.accusedAppealAnnouncement &&
                workingCase.accusedAppealDecision ===
                  CaseAppealDecision.APPEAL && (
                  <Box marginBottom={2}>
                    <Text variant="eyebrow" color="blue400">
                      Yfirlýsing um kæru kærða
                    </Text>
                    <Text>{workingCase.accusedAppealAnnouncement}</Text>
                  </Box>
                )}
              {workingCase.prosecutorAppealAnnouncement &&
                workingCase.prosecutorAppealDecision ===
                  CaseAppealDecision.APPEAL && (
                  <Box marginBottom={2}>
                    <Text variant="eyebrow" color="blue400">
                      Yfirlýsing um kæru sækjanda
                    </Text>
                    <Text>{workingCase.prosecutorAppealAnnouncement}</Text>
                  </Box>
                )}
            </Box>
          )}
          <Box marginBottom={10}>
            <Text variant="h3">
              {workingCase.judge
                ? `${workingCase.judge.name} ${workingCase.judge.title}`
                : `${user?.name} ${user?.title}`}
            </Text>
          </Box>
          <Box className={style.courtEndTimeContainer}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Þinghald
              </Text>
            </Box>
            <GridContainer>
              <GridRow>
                <GridColumn>
                  <TimeInputField
                    onChange={(evt) =>
                      validateAndSetTime(
                        'courtEndTime',
                        new Date().toString(),
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        setWorkingCase,
                        courtDocumentEndErrorMessage,
                        setCourtDocumentEndErrorMessage,
                      )
                    }
                    onBlur={(evt) =>
                      validateAndSendTimeToServer(
                        'courtEndTime',
                        new Date().toString(),
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        updateCase,
                        setCourtDocumentEndErrorMessage,
                      )
                    }
                  >
                    <Input
                      data-testid="courtEndTime"
                      name="courtEndTime"
                      label="Þinghaldi lauk"
                      placeholder="Veldu tíma"
                      defaultValue={formatDate(
                        workingCase.courtEndTime,
                        TIME_FORMAT,
                      )}
                      errorMessage={courtDocumentEndErrorMessage}
                      hasError={courtDocumentEndErrorMessage !== ''}
                      required
                    />
                  </TimeInputField>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
          <Box marginBottom={15}>
            <a
              className={style.pdfLink}
              href={`${api.apiUrl}/api/case/${workingCase.id}/ruling`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="small"
                icon="open"
                iconType="outline"
              >
                Sjá PDF af þingbók og úrskurði
              </Button>
            </a>
          </Box>
          <FormFooter
            nextUrl={Constants.DETENTION_REQUESTS_ROUTE}
            nextButtonText="Staðfesta og hefja undirritun"
            nextIsDisabled={isStepIllegal}
            onNextButtonClick={handleNextButtonClick}
            nextIsLoading={isRequestingSignature}
          />
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
