import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { ApolloError } from '@apollo/client'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  core,
  signedVerdictOverview as m,
} from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseType,
  RequestSignatureResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { Modal } from '../..'
import MarkdownWrapper from '../../MarkdownWrapper/MarkdownWrapper'
import { signingModal as signingModalStrings } from '../SigningModal/SigningModal.strings'
import { useRulingSignatureConfirmationQuery } from '../SigningModal/rulingSignatureConfirmation.generated'
import { useRulingSignatureConfirmationAudkenniQuery } from '../SigningModal/rulingSignatureConfirmationAudkenni.generated'
import { useCourtRecordSignatureConfirmationQuery } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/courtRecordSignatureConfirmation.generated'
import { useCourtRecordSignatureConfirmationAudkenniQuery } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/courtRecordSignatureConfirmationAudkenni.generated'

export type SignatureType = 'ruling' | 'courtRecord'

type SigningProgress = 'inProgress' | 'success' | 'error' | 'canceled'

interface SignatureConfirmationModalProps {
  workingCase: Case
  signatureResponse: RequestSignatureResponse
  signatureType: SignatureType
  isAudkenni: boolean
  onClose: () => void
  navigateOnClose?: boolean
  onRetry?: () => void
}

const ControlCode: FC<{ controlCode?: string }> = ({ controlCode }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={2}>
        <Text variant="h2" color="blue400">
          {formatMessage(signingModalStrings.controlCode, { controlCode })}
        </Text>
      </Box>
      <Text>{formatMessage(signingModalStrings.controlCodeExplanation)}</Text>
    </>
  )
}

const getSigningProgress = (
  confirmation:
    | {
        documentSigned: boolean
        code?: number | null
        message?: string | null
      }
    | null
    | undefined,
  error: ApolloError | undefined,
): SigningProgress => {
  if (confirmation?.documentSigned) return 'success'

  if (confirmation?.code === 7023) return 'canceled'

  if (!error && !confirmation) return 'inProgress'

  return 'error'
}

export const SignatureConfirmationModal: FC<
  SignatureConfirmationModalProps
> = ({
  workingCase,
  signatureResponse,
  signatureType,
  isAudkenni,
  onClose,
  navigateOnClose = true,
  onRetry,
}) => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  // Use the appropriate query based on signature type and method
  // Poll every 2 seconds to check for signature confirmation
  const hasDocumentToken =
    signatureResponse.documentToken &&
    signatureResponse.documentToken.length > 0

  const rulingQuery = useRulingSignatureConfirmationQuery({
    variables: {
      input: {
        documentToken: signatureResponse.documentToken || '',
        caseId: workingCase.id,
      },
    },
    skip: signatureType !== 'ruling' || isAudkenni || !hasDocumentToken,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const rulingAudkenniQuery = useRulingSignatureConfirmationAudkenniQuery({
    variables: {
      input: {
        documentToken: signatureResponse.documentToken || '',
        caseId: workingCase.id,
      },
    },
    skip: signatureType !== 'ruling' || !isAudkenni || !hasDocumentToken,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const courtRecordQuery = useCourtRecordSignatureConfirmationQuery({
    variables: {
      input: {
        documentToken: signatureResponse.documentToken || '',
        caseId: workingCase.id,
      },
    },
    skip: signatureType !== 'courtRecord' || isAudkenni || !hasDocumentToken,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const courtRecordAudkenniQuery =
    useCourtRecordSignatureConfirmationAudkenniQuery({
      variables: {
        input: {
          documentToken: signatureResponse.documentToken || '',
          caseId: workingCase.id,
        },
      },
      skip: signatureType !== 'courtRecord' || !isAudkenni || !hasDocumentToken,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

  // Get the appropriate data and error based on which query is active
  const getConfirmationData = () => {
    if (signatureType === 'ruling') {
      if (isAudkenni) {
        return {
          data: rulingAudkenniQuery.data?.rulingSignatureConfirmationAudkenni,
          error: rulingAudkenniQuery.error,
        }
      } else {
        return {
          data: rulingQuery.data?.rulingSignatureConfirmation,
          error: rulingQuery.error,
        }
      }
    } else {
      // courtRecord
      if (isAudkenni) {
        return {
          data: courtRecordAudkenniQuery.data
            ?.courtRecordSignatureConfirmationAudkenni,
          error: courtRecordAudkenniQuery.error,
        }
      } else {
        return {
          data: courtRecordQuery.data?.courtRecordSignatureConfirmation,
          error: courtRecordQuery.error,
        }
      }
    }
  }

  const { data: confirmationData, error: confirmationError } =
    getConfirmationData()

  const signingProgress = getSigningProgress(
    confirmationData,
    confirmationError,
  )

  // Get the appropriate strings based on signature type
  const getTitle = () => {
    if (signatureType === 'ruling') {
      if (signingProgress === 'inProgress') {
        return formatMessage(signingModalStrings.inProgressTitle)
      } else if (signingProgress === 'success') {
        return formatMessage(signingModalStrings.successTitle)
      } else if (signingProgress === 'canceled') {
        return formatMessage(signingModalStrings.canceledTitle)
      } else {
        return formatMessage(signingModalStrings.errorTitle)
      }
    } else {
      // courtRecord
      if (signingProgress === 'inProgress') {
        return formatMessage(m.sections.courtRecordSignatureModal.titleSigning)
      } else if (signingProgress === 'success') {
        return formatMessage(m.sections.courtRecordSignatureModal.titleSuccess)
      } else if (signingProgress === 'canceled') {
        return formatMessage(m.sections.courtRecordSignatureModal.titleCanceled)
      } else {
        return formatMessage(m.sections.courtRecordSignatureModal.titleFailure)
      }
    }
  }

  const getText = () => {
    if (signingProgress === 'inProgress') {
      return <ControlCode controlCode={signatureResponse.controlCode} />
    } else if (signingProgress === 'success') {
      if (signatureType === 'ruling') {
        return (
          <MarkdownWrapper
            markdown={formatMessage(signingModalStrings.successText, {
              summarySentToPrison:
                workingCase.type === CaseType.CUSTODY ||
                workingCase.type === CaseType.ADMISSION_TO_FACILITY,
            })}
          />
        )
      } else {
        // courtRecord
        return formatMessage(m.sections.courtRecordSignatureModal.completed)
      }
    } else {
      // error or canceled
      if (signatureType === 'ruling') {
        return formatMessage(signingModalStrings.errorText)
      } else {
        return formatMessage(m.sections.courtRecordSignatureModal.notCompleted)
      }
    }
  }

  const handleClose = () => {
    if (navigateOnClose && signingProgress === 'success') {
      router.push(
        `${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${workingCase.id}`,
      )
    }
    onClose()
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    }
    onClose()
  }

  return (
    <Modal
      title={getTitle()}
      text={getText()}
      primaryButton={
        signingProgress === 'error' || signingProgress === 'canceled'
          ? {
              text: formatMessage(signingModalStrings.primaryButtonErrorText),
              onClick: handleClose,
            }
          : undefined
      }
      secondaryButton={
        signingProgress === 'inProgress'
          ? undefined
          : {
              text:
                signingProgress === 'success'
                  ? formatMessage(core.closeModal)
                  : formatMessage(signingModalStrings.secondaryButtonErrorText),
              onClick:
                signingProgress === 'success' ? handleClose : handleRetry,
            }
      }
      invertButtonColors={
        signingProgress === 'canceled' || signingProgress === 'error'
      }
    />
  )
}
