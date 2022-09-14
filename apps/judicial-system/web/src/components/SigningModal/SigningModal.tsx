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
import { IntlShape, useIntl } from 'react-intl'

import { CaseType, isInvestigationCase } from '@island.is/judicial-system/types'
import { Box, Text, toast } from '@island.is/island-ui/core'
import {
  icConfirmation,
  rcConfirmation,
  errors as errorMessages,
} from '@island.is/judicial-system-web/messages'
import type { Case } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'
import { RulingSignatureConfirmationQuery } from '../../utils/mutations'
import { Modal } from '..'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import {
  RequestRulingSignatureMutationMutation,
  RulingSignatureConfirmationQueryQuery,
} from '../../graphql/schema'
import RequestRulingSignatureMutation from './requestRulingSignatureGql'

const ControlCode: React.FC<{ controlCode?: string }> = ({ controlCode }) => {
  return (
    <>
      <Box marginBottom={2}>
        <Text variant="h2" color="blue400">
          {`Öryggistala: ${controlCode}`}
        </Text>
      </Box>
      <Text>
        Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama
        öryggistala birtist í símanum þínum.
      </Text>
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

export const getSuccessText = (
  formatMessage: IntlShape['formatMessage'],
  caseType: CaseType,
) => {
  return isInvestigationCase(caseType)
    ? formatMessage(icConfirmation.modal.text)
    : formatMessage(rcConfirmation.modal.rulingNotification.textV2, {
        summarySentToPrison:
          caseType === CaseType.CUSTODY ||
          caseType === CaseType.ADMISSION_TO_FACILITY,
      })
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
          ? 'Rafræn undirritun'
          : signingProgress === 'success'
          ? 'Úrskurður hefur verið staðfestur og undirritaður'
          : signingProgress === 'canceled'
          ? 'Notandi hætti við undirritun'
          : 'Undirritun tókst ekki'
      }
      text={
        signingProgress === 'inProgress' ? (
          <ControlCode
            controlCode={requestRulingSignatureResponse?.controlCode}
          />
        ) : signingProgress === 'success' ? (
          <MarkdownWrapper
            markdown={getSuccessText(formatMessage, workingCase.type)}
          />
        ) : (
          'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.'
        )
      }
      primaryButtonText={
        signingProgress === 'inProgress'
          ? ''
          : signingProgress === 'success'
          ? ''
          : 'Undirrita seinna'
      }
      secondaryButtonText={
        signingProgress === 'inProgress'
          ? undefined
          : signingProgress === 'success'
          ? 'Loka glugga'
          : 'Reyna aftur'
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
