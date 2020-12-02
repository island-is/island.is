import { Accordion, Box, Button, Text } from '@island.is/island-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import Modal from '../../../shared-components/Modal/Modal'
import {
  constructConclusion,
  getAppealDecitionText,
} from '../../../utils/stepHelper'
import * as Constants from '../../../utils/constants'
import { formatDate } from '@island.is/judicial-system/formatters'
import { parseTransition } from '../../../utils/formatters'
import { AppealDecisionRole, JudgeSubsections, Sections } from '../../../types'
import {
  Case,
  CaseAppealDecision,
  CaseState,
  CaseTransition,
  NotificationType,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  TransitionCase,
} from '@island.is/judicial-system/types'
import { useHistory, useParams } from 'react-router-dom'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import PoliceRequestAccordionItem from '@island.is/judicial-system-web/src/shared-components/PoliceRequestAccordionItem/PoliceRequestAccordionItem'
import * as style from './Confirmation.treat'
import {
  CaseQuery,
  SendNotificationMutation,
  TransitionCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import { gql, useMutation, useQuery } from '@apollo/client'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { api } from '../../../services'
import CourtRecordAccordionItem from '../../../shared-components/CourtRecordAccordionItem/CourtRecordAccordionItem'

export const RequestSignatureMutation = gql`
  mutation RequestSignatureMutation($input: RequestSignatureInput!) {
    requestSignature(input: $input) {
      controlCode
      documentToken
    }
  }
`

export const SignatureConfirmationQuery = gql`
  query SignatureConfirmationQuery($input: SignatureConfirmationQueryInput!) {
    signatureConfirmation(input: $input) {
      documentSigned
      code
      message
    }
  }
`

interface SigningModalProps {
  caseId: string
  requestSignatureResponse?: RequestSignatureResponse
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SigningModal: React.FC<SigningModalProps> = (
  props: SigningModalProps,
) => {
  const history = useHistory()
  const [
    signatureConfirmationResponse,
    setSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()

  const { data } = useQuery(SignatureConfirmationQuery, {
    variables: {
      input: {
        caseId: props.caseId,
        documentToken: props.requestSignatureResponse?.documentToken,
      },
    },
    fetchPolicy: 'no-cache',
  })
  // TODO: Handle case when resSignatureConfirmationResponse is never set
  const resSignatureConfirmationResponse = data?.signatureConfirmation

  const [sendNotificationMutation] = useMutation(SendNotificationMutation)

  useEffect(() => {
    const completeSigning = async (
      resSignatureResponse: SignatureConfirmationResponse,
    ) => {
      const { data } = await sendNotificationMutation({
        variables: {
          input: {
            caseId: props.caseId,
            type: NotificationType.RULING,
          },
        },
      })

      if (!data?.sendNotification?.notificationSent) {
        // TODO: Handle error
      }

      setSignatureConfirmationResponse(resSignatureResponse)
    }

    if (resSignatureConfirmationResponse) {
      completeSigning(resSignatureConfirmationResponse)
    }
  }, [resSignatureConfirmationResponse, props.caseId, sendNotificationMutation])

  const renderContolCode = () => {
    return (
      <>
        <Box marginBottom={2}>
          <Text variant="h2" color="blue400">
            {`Öryggistala: ${props.requestSignatureResponse?.controlCode}`}
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
          ? renderContolCode()
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
          props.setModalVisible(false)
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
  const [requestSignatureResponse, setRequestSignatureResponse] = useState<
    RequestSignatureResponse
  >()

  const { id } = useParams<{ id: string }>()
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
    transitionCaseMutation,
    { loading: isTransitioningCase },
  ] = useMutation(TransitionCaseMutation)

  const transitionCase = async (id: string, transitionCase: TransitionCase) => {
    const { data } = await transitionCaseMutation({
      variables: { input: { id, ...transitionCase } },
    })

    return data?.transitionCase
  }

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

  const handleNextButtonClick: () => Promise<boolean> = async () => {
    if (!workingCase) {
      return false
    }

    if (workingCase.state === CaseState.SUBMITTED) {
      try {
        // Parse the transition request
        const transitionRequest = parseTransition(
          workingCase.modified,
          workingCase.rejecting ? CaseTransition.REJECT : CaseTransition.ACCEPT,
        )

        // Transition the case
        const resCase = await transitionCase(workingCase.id, transitionRequest)

        if (!resCase) {
          return false
        }

        setWorkingCase({
          ...workingCase,
          state: resCase.state,
          judge: resCase.judge,
        })

        return true
      } catch (e) {
        console.log(e)

        return false
      }
    }

    return workingCase.rejecting
      ? workingCase.state === CaseState.REJECTED
      : workingCase.state === CaseState.ACCEPTED
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
              {workingCase?.judge
                ? `${workingCase?.judge.name} ${workingCase?.judge.title}`
                : `${user?.name} ${user?.title}`}
            </Text>
          </Box>
          <Box marginBottom={15}>
            <a
              className={style.pdfLink}
              href={`${api.apiUrl}/api/case/${workingCase.id}/ruling`}
              target="_blank"
              rel="noopener"
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
            nextButtonText="Staðfesta úrskurð"
            onNextButtonClick={async () => {
              // Transition case from submitted state to either accepted or rejected
              const caseTransitioned = await handleNextButtonClick()
              if (caseTransitioned) {
                // Request signature to get control code
                try {
                  const requestSignatureResponse = await requestSignature(
                    workingCase.id,
                  )
                  if (requestSignatureResponse) {
                    setRequestSignatureResponse(requestSignatureResponse)
                    setModalVisible(true)
                  } else {
                    // TODO: Handle error
                  }
                } catch (e) {
                  // TODO: Handle error
                }
              } else {
                // TODO: Handle error
              }
            }}
            nextIsLoading={isTransitioningCase || isRequestingSignature}
          />
          {modalVisible && (
            <SigningModal
              caseId={workingCase.id}
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
