import { FC } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import {
  ApolloError,
  FetchResult,
  MutationFunctionOptions,
} from '@apollo/client'

import { Box, Text, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  core,
  errors as errorMessages,
} from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseType,
  Exact,
  RequestSignatureInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { Modal } from '../..'
import MarkdownWrapper from '../../MarkdownWrapper/MarkdownWrapper'
import {
  RequestRulingSignatureMutation,
  useRequestRulingSignatureMutation,
} from './requestRulingSignature.generated'
import {
  RulingSignatureConfirmationQuery,
  useRulingSignatureConfirmationQuery,
} from './rulingSignatureConfirmation.generated'
import { signingModal as m } from './SigningModal.strings'

const ControlCode: FC<{ controlCode?: string }> = ({ controlCode }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <Box marginBottom={2}>
        <Text variant="h2" color="blue400">
          {formatMessage(m.controlCode, { controlCode })}
        </Text>
      </Box>
      <Text>{formatMessage(m.controlCodeExplanation)}</Text>
    </>
  )
}

interface SigningModalProps {
  workingCase: Case
  requestRulingSignature: (
    options?:
      | MutationFunctionOptions<
          RequestRulingSignatureMutation,
          Exact<{
            input: RequestSignatureInput
          }>
        >
      | undefined,
  ) => Promise<FetchResult<RequestRulingSignatureMutation>>
  requestRulingSignatureResponse?: RequestRulingSignatureMutation['requestRulingSignature']
  onClose: () => void
  navigateOnClose?: boolean
}

export const useRequestRulingSignature = (
  caseId: string,
  onSuccess: () => void,
) => {
  const { formatMessage } = useIntl()

  const [
    requestRulingSignature,
    { loading: isRequestingRulingSignature, data, error },
  ] = useRequestRulingSignatureMutation({
    variables: { input: { caseId } },
    onError: () => {
      toast.error(formatMessage(errorMessages.requestRulingSignature))
    },
    onCompleted: () => onSuccess(),
  })

  if (!data && error) {
    return {
      requestRulingSignature,
      isRequestingRulingSignature: false,
      requestRulingSignatureResponse: undefined,
    }
  }

  return {
    requestRulingSignature,
    requestRulingSignatureResponse: data?.requestRulingSignature,
    isRequestingRulingSignature,
  }
}

type signingProgress = 'inProgress' | 'success' | 'error' | 'canceled'

export const getSigningProgress = (
  rulingSignatureConfirmation:
    | RulingSignatureConfirmationQuery['rulingSignatureConfirmation']
    | undefined,
  error: ApolloError | undefined,
): signingProgress => {
  if (rulingSignatureConfirmation?.documentSigned) return 'success'

  if (rulingSignatureConfirmation?.code === 7023) return 'canceled'

  if (!error && !rulingSignatureConfirmation) return 'inProgress'

  return 'error'
}

export const SigningModal: FC<SigningModalProps> = ({
  workingCase,
  requestRulingSignature,
  requestRulingSignatureResponse,
  onClose,
  navigateOnClose = true,
}) => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const { data, error } = useRulingSignatureConfirmationQuery({
    variables: {
      input: {
        documentToken: requestRulingSignatureResponse?.documentToken || '',
        caseId: workingCase.id,
      },
    },
    skip: !requestRulingSignatureResponse,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const signingProgress = getSigningProgress(
    data?.rulingSignatureConfirmation,
    error,
  )

  return (
    <Modal
      title={
        signingProgress === 'inProgress'
          ? formatMessage(m.inProgressTitle)
          : signingProgress === 'success'
          ? formatMessage(m.successTitle)
          : signingProgress === 'canceled'
          ? formatMessage(m.canceledTitle)
          : formatMessage(m.errorTitle)
      }
      text={
        signingProgress === 'inProgress' ? (
          <ControlCode
            controlCode={requestRulingSignatureResponse?.controlCode}
          />
        ) : signingProgress === 'success' ? (
          <MarkdownWrapper
            markdown={formatMessage(m.successText, {
              summarySentToPrison:
                workingCase.type === CaseType.CUSTODY ||
                workingCase.type === CaseType.ADMISSION_TO_FACILITY,
            })}
          />
        ) : (
          formatMessage(m.errorText)
        )
      }
      primaryButton={
        signingProgress === 'error' || signingProgress === 'canceled'
          ? {
              text: formatMessage(m.primaryButtonErrorText),
              onClick: () => {
                if (navigateOnClose) {
                  router.push(
                    `${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${workingCase.id}`,
                  )
                }
                onClose()
              },
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
                  : formatMessage(m.secondaryButtonErrorText),
              onClick: async () => {
                if (signingProgress === 'success') {
                  if (navigateOnClose) {
                    router.push(
                      `${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${workingCase.id}`,
                    )
                  }
                } else {
                  requestRulingSignature()
                }
                onClose()
              },
            }
      }
      invertButtonColors={
        signingProgress === 'canceled' || signingProgress === 'error'
      }
    />
  )
}
