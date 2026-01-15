import { FC, useState } from 'react'
import { useIntl } from 'react-intl'
import { FetchResult } from '@apollo/client'

import { toast } from '@island.is/island-ui/core'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'
import {
  Case,
  RequestSignatureResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { Modal } from '../..'
import { useRequestRulingSignatureMutation } from '../SigningModal/requestRulingSignature.generated'
import { useRequestRulingSignatureAudkenniMutation } from '../SigningModal/requestRulingSignatureAudkenni.generated'
import { useRequestCourtRecordSignatureMutation } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/requestCourtRecordSignature.generated'
import { useRequestCourtRecordSignatureAudkenniMutation } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/requestCourtRecordSignatureAudkenni.generated'
import { signingMethodSelectionModal as m } from './SigningMethodSelectionModal.strings'

export type SignatureType = 'ruling' | 'courtRecord'

interface SigningMethodSelectionModalProps {
  workingCase: Case
  signatureType: SignatureType
  onClose: () => void
  onSignatureRequested: (
    response: RequestSignatureResponse,
    isAudkenni: boolean,
  ) => void
}

export const SigningMethodSelectionModal: FC<
  SigningMethodSelectionModalProps
> = ({ workingCase, signatureType, onClose, onSignatureRequested }) => {
  const { formatMessage } = useIntl()
  const [isLoading, setIsLoading] = useState(false)

  // Ruling signature mutations
  const [requestRulingSignature] = useRequestRulingSignatureMutation({
    variables: { input: { caseId: workingCase.id } },
    onError: () => {
      toast.error(formatMessage(errorMessages.requestRulingSignature))
      setIsLoading(false)
    },
  })

  const [requestRulingSignatureAudkenni] =
    useRequestRulingSignatureAudkenniMutation({
      variables: { input: { caseId: workingCase.id } },
      onError: () => {
        toast.error(formatMessage(errorMessages.requestRulingSignature))
        setIsLoading(false)
      },
    })

  // Court record signature mutations
  const [requestCourtRecordSignature] = useRequestCourtRecordSignatureMutation({
    variables: { input: { caseId: workingCase.id } },
    onError: () => {
      toast.error(formatMessage(errorMessages.requestCourtRecordSignature))
      setIsLoading(false)
    },
  })

  const [requestCourtRecordSignatureAudkenni] =
    useRequestCourtRecordSignatureAudkenniMutation({
      variables: { input: { caseId: workingCase.id } },
      onError: () => {
        toast.error(formatMessage(errorMessages.requestCourtRecordSignature))
        setIsLoading(false)
      },
    })

  const handleMethodSelection = async (isAudkenni: boolean) => {
    setIsLoading(true)

    try {
      if (signatureType === 'ruling') {
        if (isAudkenni) {
          const result = await requestRulingSignatureAudkenni()
          const response = result.data?.requestRulingSignatureAudkenni
          if (response) {
            onSignatureRequested(response, isAudkenni)
          } else {
            setIsLoading(false)
          }
        } else {
          const result = await requestRulingSignature()
          const response = result.data?.requestRulingSignature
          if (response) {
            onSignatureRequested(response, isAudkenni)
          } else {
            setIsLoading(false)
          }
        }
      } else {
        // courtRecord
        if (isAudkenni) {
          const result = await requestCourtRecordSignatureAudkenni()
          const response = result.data?.requestCourtRecordSignatureAudkenni
          if (response) {
            onSignatureRequested(response, isAudkenni)
          } else {
            setIsLoading(false)
          }
        } else {
          const result = await requestCourtRecordSignature()
          const response = result.data?.requestCourtRecordSignature
          if (response) {
            onSignatureRequested(response, isAudkenni)
          } else {
            setIsLoading(false)
          }
        }
      }
    } catch (error) {
      setIsLoading(false)
      // Error is already handled by onError callbacks
    }
  }

  const description =
    signatureType === 'ruling'
      ? formatMessage(m.descriptionRuling, {
          courtCaseNumber: workingCase.courtCaseNumber || '',
        })
      : formatMessage(m.descriptionCourtRecord, {
          courtCaseNumber: workingCase.courtCaseNumber || '',
        })

  return (
    <Modal
      title={formatMessage(m.title)}
      text={description}
      secondaryButton={{
        text: formatMessage(m.audkenniButton),
        onClick: () => handleMethodSelection(true),
        isLoading: isLoading,
      }}
      primaryButton={{
        text: formatMessage(m.mobileButton),
        onClick: () => handleMethodSelection(false),
        isLoading: isLoading,
      }}
      onClose={onClose}
    />
  )
}
