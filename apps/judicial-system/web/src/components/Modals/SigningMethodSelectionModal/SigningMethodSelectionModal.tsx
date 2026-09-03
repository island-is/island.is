import type { FC } from 'react'
import { useState } from 'react'
import { useIntl } from 'react-intl'

import { errors as errorMessages } from '@island.is/judicial-system-web/messages'
import { Modal } from '@island.is/judicial-system-web/src/components'
import type {
  Case,
  RequestSignatureResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useRequestCourtRecordSignatureMutation } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/requestCourtRecordSignature.generated'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useRequestRulingSignatureMutation } from './requestRulingSignature.generated'

export type SignatureType = 'ruling' | 'courtRecord'

type LoadingMethod = 'mobile' | 'audkenni'

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
  const [loadingMethod, setLoadingMethod] = useState<LoadingMethod | undefined>(
    undefined,
  )

  // Ruling signature mutation
  const [requestRulingSignature] = useRequestRulingSignatureMutation({
    onError: () => {
      toast.error(formatMessage(errorMessages.requestRulingSignature))
      setLoadingMethod(undefined)
    },
  })

  // Court record signature mutation
  const [requestCourtRecordSignature] = useRequestCourtRecordSignatureMutation({
    onError: () => {
      toast.error(formatMessage(errorMessages.requestCourtRecordSignature))
      setLoadingMethod(undefined)
    },
  })

  const handleMethodSelection = async (isAudkenni: boolean) => {
    setLoadingMethod(isAudkenni ? 'audkenni' : 'mobile')

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
      setLoadingMethod(undefined)
    }

    if (response) {
      onSignatureRequested(response, isAudkenni)
    } else {
      toast.error(formatMessage(errorMessages.requestCourtRecordSignature))
      setLoadingMethod(undefined)
    }
  }

  const courtCaseNumber = workingCase.courtCaseNumber || ''
  const description = `Þú ert að fara að undirrita ${
    signatureType === 'ruling' ? 'úrskurð' : 'þingbók'
  } í máli ${courtCaseNumber}. \nVinsamlegast veldu undirritunarleið til að halda áfram.`

  return (
    <Modal
      title="Undirritun"
      text={description}
      buttons={[
        {
          text: 'Auðkennisappið',
          onClick: () => handleMethodSelection(true),
          isLoading: loadingMethod === 'audkenni',
        },
        {
          text: 'Rafræn skilríki',
          onClick: () => handleMethodSelection(false),
          isLoading: loadingMethod === 'mobile',
        },
      ]}
      onClose={onClose}
    />
  )
}
