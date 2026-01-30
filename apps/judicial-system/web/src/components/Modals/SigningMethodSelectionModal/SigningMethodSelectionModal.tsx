import { FC, useState } from 'react'
import { useIntl } from 'react-intl'

import { toast } from '@island.is/island-ui/core'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages'
import {
  Case,
  RequestSignatureResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useRequestCourtRecordSignatureMutation } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/requestCourtRecordSignature.generated'

import { Modal } from '../..'
import { useRequestRulingSignatureMutation } from './requestRulingSignature.generated'
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

  // Ruling signature mutation
  const [requestRulingSignature] = useRequestRulingSignatureMutation({
    onError: () => {
      toast.error(formatMessage(errorMessages.requestRulingSignature))
      setIsLoading(false)
    },
  })

  // Court record signature mutation
  const [requestCourtRecordSignature] = useRequestCourtRecordSignatureMutation({
    onError: () => {
      toast.error(formatMessage(errorMessages.requestCourtRecordSignature))
      setIsLoading(false)
    },
  })

  const handleMethodSelection = async (isAudkenni: boolean) => {
    setIsLoading(true)

    let response: RequestSignatureResponse | undefined | null = null
    try {
      if (signatureType === 'ruling') {
        const result = await requestRulingSignature({
          variables: {
            input: {
              caseId: workingCase.id,
              method: isAudkenni ? 'audkenni' : 'mobile',
            },
          },
        })
        response = result.data?.requestRulingSignature
      } else {
        // courtRecord
        const result = await requestCourtRecordSignature({
          variables: {
            input: {
              caseId: workingCase.id,
              method: isAudkenni ? 'audkenni' : 'mobile',
            },
          },
        })
        response = result.data?.requestCourtRecordSignature
      }
    } catch (error) {
      setIsLoading(false)
    }

    if (response) {
      onSignatureRequested(response, isAudkenni)
    } else {
      toast.error(formatMessage(errorMessages.requestCourtRecordSignature))
      setIsLoading(false)
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
