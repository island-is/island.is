import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseTransition,
  NotificationType,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
} from '@island.is/judicial-system/types'
import { useCase } from '../../utils/hooks'
import { SignatureConfirmationQuery } from '../../utils/mutations'
import { Box, Text } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { Modal } from '..'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

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
                workingCase.decision === CaseDecision.REJECTING
                  ? CaseTransition.REJECT
                  : CaseTransition.ACCEPT,
                setWorkingCase,
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

export default SigningModal
