import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import Modal from '../../../shared-components/Modal/Modal'
import {
  constructConclusion,
  getAppealDecitionText,
} from '../../../utils/stepHelper'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT, formatDate } from '@island.is/judicial-system/formatters'
import { parseTransition } from '../../../utils/formatters'
import { AppealDecisionRole, JudgeSubsections, Sections } from '../../../types'
import AccordionListItem from '@island.is/judicial-system-web/src/shared-components/AccordionListItem/AccordionListItem'
import {
  Case,
  CaseAppealDecision,
  CaseTransition,
  NotificationType,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
  TransitionCase,
} from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
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
  const resSignatureResponse = data?.signatureConfirmation

  const [sendNotificationMutation] = useMutation(SendNotificationMutation)

  useEffect(() => {
    const completeSigning = async (
      resSignatureResponse: SignatureConfirmationResponse,
    ) => {
      await sendNotificationMutation({
        variables: {
          input: {
            caseId: props.caseId,
            type: NotificationType.RULING,
          },
        },
      })
      setSignatureConfirmationResponse(resSignatureResponse)
    }

    if (resSignatureResponse) {
      completeSigning(resSignatureResponse)
    }
  }, [resSignatureResponse, props.caseId, sendNotificationMutation])

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

export const Confirmation: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [requestSignatureResponse, setRequestSignatureResponse] = useState<
    RequestSignatureResponse
  >()

  const { id } = useParams<{ id: string }>()
  const { user } = useContext(userContext)
  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Yfirlit úrskurðar - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && resCase) {
      setWorkingCase(resCase)
    }
  }, [workingCase, setWorkingCase, resCase])

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

    const resCase = data?.transitionCase

    if (resCase) {
      // Do something with the result. In particular, we want the modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
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

  const handleNextButtonClick = async () => {
    if (workingCase && workingCase.id && workingCase.modified) {
      try {
        // Parse the transition request
        const transitionRequest = parseTransition(
          workingCase.modified,
          workingCase?.rejecting
            ? CaseTransition.REJECT
            : CaseTransition.ACCEPT,
        )

        // Transition the case
        await transitionCase(workingCase.id, transitionRequest)
      } catch (e) {
        // Improve error handling at some point
        console.log('Transition failing')
      }
    }
  }

  return (
    <PageLayout
      activeSubSection={Sections.JUDGE}
      activeSection={JudgeSubsections.CONFIRMATION}
      isLoading={loading}
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
              <AccordionItem id="id_2" label="Þingbók" labelVariant="h3">
                <Box marginBottom={2}>
                  <Text variant="h4" as="h4">
                    Upplýsingar
                  </Text>
                </Box>
                <Box marginBottom={3}>
                  <Text>
                    {`Þinghald frá kl. ${formatDate(
                      workingCase.courtStartTime,
                      TIME_FORMAT,
                    )} til kl. ${formatDate(
                      workingCase.courtEndTime,
                      TIME_FORMAT,
                    )} ${formatDate(workingCase.courtEndTime, 'PP')}`}
                  </Text>
                </Box>
                <AccordionListItem title="Krafa lögreglu">
                  <span className={style.breakSpaces}>
                    {workingCase.policeDemands}
                  </span>
                </AccordionListItem>
                <AccordionListItem title="Viðstaddir">
                  <span className={style.breakSpaces}>
                    {workingCase.courtAttendees}
                  </span>
                </AccordionListItem>
                <AccordionListItem title="Dómskjöl">
                  Rannsóknargögn málsins liggja frammi. Krafa lögreglu þingmerkt
                  nr. 1.
                </AccordionListItem>
                <AccordionListItem title="Réttindi kærða">
                  Kærða er bent á að honum sé óskylt að svara spurningum er
                  varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113.
                  gr. laga nr. 88/2008. Kærði er enn fremur áminntur um
                  sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr.
                  114. gr. sömu laga.
                </AccordionListItem>
                <AccordionListItem title="Afstaða kærða">
                  <span className={style.breakSpaces}>
                    {workingCase.accusedPlea}
                  </span>
                </AccordionListItem>
                <AccordionListItem title="Málflutningur">
                  <span className={style.breakSpaces}>
                    {workingCase.litigationPresentations}
                  </span>
                </AccordionListItem>
              </AccordionItem>
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
          <Box marginBottom={15}>
            <Text variant="h3">
              {workingCase?.judge
                ? `${workingCase?.judge.name} ${workingCase?.judge.title}`
                : `${user?.name} ${user?.title}`}
            </Text>
          </Box>
          <FormFooter
            nextUrl={Constants.DETENTION_REQUESTS_ROUTE}
            nextButtonText="Staðfesta úrskurð"
            onNextButtonClick={async () => {
              // Transition case from submitted state to either accepted or rejected
              await handleNextButtonClick()

              // Request signature to get control code
              const requestSignatureResponse = await requestSignature(
                workingCase.id,
              )

              if (requestSignatureResponse) {
                setRequestSignatureResponse(requestSignatureResponse)
                setModalVisible(true)
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
