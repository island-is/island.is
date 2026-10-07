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

  // Errors are reported once, below, after the request settles. An onError
  // handler here would toast as well and make the mutate promise resolve
  // without data, so the failure would be reported twice.
  const [requestRulingSignature] = useRequestRulingSignatureMutation()
  const [requestCourtRecordSignature] = useRequestCourtRecordSignatureMutation()

  const handleMethodSelection = async (isAudkenni: boolean) => {
    const method: LoadingMethod = isAudkenni ? 'audkenni' : 'mobile'
    setLoadingMethod(method)

    let response: RequestSignatureResponse | undefined | null = null
    try {
      const variables = { input: { caseId: workingCase.id, method } }

      if (signatureType === 'ruling') {
        const result = await requestRulingSignature({ variables })
        response = result.data?.requestRulingSignature
      } else {
        const result = await requestCourtRecordSignature({ variables })
        response = result.data?.requestCourtRecordSignature
      }
    } catch {
      // Reported below together with an empty response
    }

    if (!response) {
      toast.error(
        formatMessage(
          signatureType === 'ruling'
            ? errorMessages.requestRulingSignature
            : errorMessages.requestCourtRecordSignature,
        ),
      )
      setLoadingMethod(undefined)
      return
    }

    onSignatureRequested(response, isAudkenni)
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
