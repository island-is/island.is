import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  CaseDecision,
  CaseState,
  CaseTransition,
  CaseType,
  NotificationType,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import type {
  Case,
  RequestSignatureResponse,
  SignatureConfirmationResponse,
} from '@island.is/judicial-system/types'
import { useCase } from '../../utils/hooks'
import { RulingSignatureConfirmationQuery } from '../../utils/mutations'
import { Box, Text } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { Modal } from '..'
import {
  icConfirmation,
  rcConfirmation,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'

interface SigningModalProps {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  requestRulingSignatureResponse?: RequestSignatureResponse
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SigningModal: React.FC<SigningModalProps> = ({
  workingCase,
  setWorkingCase,
  requestRulingSignatureResponse,
  setModalVisible,
}) => {
  const router = useRouter()
  const [
    rulingSignatureConfirmationResponse,
    setRulingSignatureConfirmationResponse,
  ] = useState<SignatureConfirmationResponse>()

  const { transitionCase, sendNotification } = useCase()

  const { data } = useQuery(RulingSignatureConfirmationQuery, {
    variables: {
      input: {
        caseId: workingCase.id,
        documentToken: requestRulingSignatureResponse?.documentToken,
      },
    },
    fetchPolicy: 'no-cache',
  })

  // TODO: Handle case when resRulingSignatureConfirmationResponse is never set
  const resRulingSignatureConfirmationResponse =
    data?.rulingSignatureConfirmation

  useEffect(() => {
    const completeSigning = async (
      resRulingSignatureConfirmationResponse: SignatureConfirmationResponse,
    ) => {
      if (
        resRulingSignatureConfirmationResponse.documentSigned &&
        workingCase.state === CaseState.RECEIVED
      ) {
        try {
          const caseCompleted = await transitionCase(
            workingCase,
            workingCase.decision === CaseDecision.REJECTING
              ? CaseTransition.REJECT
              : workingCase.decision === CaseDecision.DISMISSING
              ? CaseTransition.DISMISS
              : CaseTransition.ACCEPT,
            setWorkingCase,
          )

          if (caseCompleted) {
            await sendNotification(workingCase.id, NotificationType.RULING)
          } else {
            // TODO: Handle error
          }
        } catch (e) {
          // TODO: Handle error
        }
      }

      setRulingSignatureConfirmationResponse(
        resRulingSignatureConfirmationResponse,
      )
    }

    if (resRulingSignatureConfirmationResponse) {
      completeSigning(resRulingSignatureConfirmationResponse)
    }
  }, [
    resRulingSignatureConfirmationResponse,
    setRulingSignatureConfirmationResponse,
    transitionCase,
    sendNotification,
    workingCase,
    setWorkingCase,
  ])

  const renderControlCode = () => {
    return (
      <>
        <Box marginBottom={2}>
          <Text variant="h2" color="blue400">
            {`Öryggistala: ${requestRulingSignatureResponse?.controlCode}`}
          </Text>
        </Box>
        <Text>
          Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama
          öryggistala birtist í símanum þínum.
        </Text>
      </>
    )
  }

  const renderSuccessText = (caseType: CaseType) => {
    return isInvestigationCase(caseType)
      ? icConfirmation.modal.text
      : caseType === CaseType.CUSTODY
      ? rcConfirmation.modal.custodyCases.text
      : rcConfirmation.modal.travelBanCases.text
  }

  return (
    <Modal
      title={
        !rulingSignatureConfirmationResponse
          ? 'Rafræn undirritun'
          : rulingSignatureConfirmationResponse.documentSigned
          ? 'Úrskurður hefur verið staðfestur og undirritaður'
          : rulingSignatureConfirmationResponse.code === 7023 // User cancelled
          ? 'Notandi hætti við undirritun'
          : 'Undirritun tókst ekki'
      }
      text={
        !rulingSignatureConfirmationResponse ? (
          renderControlCode()
        ) : rulingSignatureConfirmationResponse.documentSigned ? (
          <MarkdownWrapper text={renderSuccessText(workingCase.type)} />
        ) : (
          'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.'
        )
      }
      secondaryButtonText={
        !rulingSignatureConfirmationResponse
          ? undefined
          : rulingSignatureConfirmationResponse.documentSigned
          ? 'Loka glugga'
          : 'Loka og reyna aftur'
      }
      primaryButtonText={
        rulingSignatureConfirmationResponse ? 'Senda ábendingu' : ''
      }
      handlePrimaryButtonClick={() => {
        window.open(Constants.FEEDBACK_FORM_URL, '_blank')
        router.push(Constants.REQUEST_LIST_ROUTE)
      }}
      handleSecondaryButtonClick={async () => {
        if (rulingSignatureConfirmationResponse?.documentSigned === true) {
          router.push(Constants.REQUEST_LIST_ROUTE)
        } else {
          setModalVisible(false)
        }
      }}
    />
  )
}

export default SigningModal
