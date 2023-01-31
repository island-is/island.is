import React from 'react'
import { useRouter } from 'next/router'
import {
  ApolloError,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
  useMutation,
  useQuery,
} from '@apollo/client'
import { useIntl } from 'react-intl'

import { CaseType } from '@island.is/judicial-system/types'
import { Box, Text, toast } from '@island.is/island-ui/core'
import {
  core,
  errors as errorMessages,
} from '@island.is/judicial-system-web/messages'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import * as constants from '@island.is/judicial-system/consts'

import { RulingSignatureConfirmationQuery } from '../../utils/mutations'
import { Modal } from '..'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import {
  RequestRulingSignatureMutationMutation,
  RulingSignatureConfirmationQueryQuery,
} from '../../graphql/schema'
import RequestRulingSignatureMutation from './requestRulingSignatureGql'
import { signingModal as m } from './SigningModal.strings'

const ControlCode: React.FC<{ controlCode?: string }> = ({ controlCode }) => {
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
          RequestRulingSignatureMutationMutation,
          OperationVariables
        >
      | undefined,
  ) => Promise<FetchResult<RequestRulingSignatureMutationMutation>>
  requestRulingSignatureResponse?: RequestRulingSignatureMutationMutation['requestRulingSignature']
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
  ] = useMutation<RequestRulingSignatureMutationMutation>(
    RequestRulingSignatureMutation,
    {
      variables: { input: { caseId } },
      onError: () => {
        toast.error(formatMessage(errorMessages.requestRulingSignature))
      },
      onCompleted: () => onSuccess(),
    },
  )

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
  rulingSignatureConfirmation: RulingSignatureConfirmationQueryQuery['rulingSignatureConfirmation'],
  error: ApolloError | undefined,
): signingProgress => {
  if (rulingSignatureConfirmation?.documentSigned) return 'success'

  if (rulingSignatureConfirmation?.code === 7023) return 'canceled'

  if (!error && !rulingSignatureConfirmation) return 'inProgress'

  return 'error'
}

export const SigningModal: React.FC<SigningModalProps> = ({
  workingCase,
  requestRulingSignature,
  requestRulingSignatureResponse,
  onClose,
  navigateOnClose = true,
}) => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const { data, error } = useQuery<RulingSignatureConfirmationQueryQuery>(
    RulingSignatureConfirmationQuery,
    {
      variables: {
        input: {
          documentToken: requestRulingSignatureResponse?.documentToken,
          caseId: workingCase.id,
        },
      },
      fetchPolicy: 'no-cache',
      skip: !requestRulingSignatureResponse,
    },
  )

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
      primaryButtonText={
        signingProgress === 'inProgress'
          ? ''
          : signingProgress === 'success'
          ? ''
          : formatMessage(m.primaryButtonErrorText)
      }
      secondaryButtonText={
        signingProgress === 'inProgress'
          ? undefined
          : signingProgress === 'success'
          ? formatMessage(core.closeModal)
          : formatMessage(m.secondaryButtonErrorText)
      }
      onPrimaryButtonClick={() => {
        if (navigateOnClose) {
          router.push(
            `${constants.SIGNED_VERDICT_OVERVIEW_ROUTE}/${workingCase.id}`,
          )
        }
        onClose()
      }}
      onSecondaryButtonClick={async () => {
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
      }}
      invertButtonColors={
        signingProgress === 'canceled' || signingProgress === 'error'
      }
    />
  )
}
