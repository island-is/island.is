import React, { useReducer } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, ApolloError } from '@apollo/client'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import { useFormContext } from 'react-hook-form'
import { PdfTypes } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import {
  REQUEST_FILE_SIGNATURE,
  UPLOAD_SIGNED_FILE,
} from '@island.is/application/graphql'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { useGeneratePdfUrl } from '@island.is/application/templates/family-matters-core/hooks'
import * as m from '../../lib/messages'
import { Roles } from '../../lib/constants'
import {
  fileSignatureReducer,
  initialFileSignatureState,
  FileSignatureActionTypes,
  FileSignatureStatus,
} from './fileSignatureReducer'
import SignatureModal from './SignatureModal'
import { CRCFieldBaseProps } from '../../types'
import { ContractOverview } from '../components'
import * as style from '../Shared.css'

const confirmContractTerms = 'confirmContract.terms'
const confirmContractTimestamp = 'confirmContract.timestamp'

export const confirmContractIds = [
  confirmContractTerms,
  confirmContractTimestamp,
]

const Overview = ({
  field,
  error,
  errors,
  application,
  setBeforeSubmitCallback,
}: CRCFieldBaseProps) => {
  const pdfType = PdfTypes.CHILDREN_RESIDENCE_CHANGE
  const { pdfUrl, loading: pdfLoading } = useGeneratePdfUrl(
    application.id,
    pdfType,
  )
  const { id, disabled } = field
  const { answers, externalData } = application
  const [fileSignatureState, dispatchFileSignature] = useReducer(
    fileSignatureReducer,
    initialFileSignatureState,
  )
  const applicant = externalData.nationalRegistry.data
  const children = getSelectedChildrenFromExternalData(
    externalData.childrenCustodyInformation.data,
    answers.selectedChildren,
  )
  const parentB = children[0].otherParent

  const { formatMessage } = useIntl()

  const [requestFileSignature, { data: requestFileSignatureData }] =
    useMutation(REQUEST_FILE_SIGNATURE)

  const [uploadSignedFile] = useMutation(UPLOAD_SIGNED_FILE)

  const { register, setValue } = useFormContext()

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (!pdfUrl) {
        return [false, 'no pdf url']
      }
      dispatchFileSignature({ type: FileSignatureActionTypes.REQUEST })
      const documentToken = await requestFileSignature({
        variables: {
          input: {
            id: application.id,
            type: pdfType,
          },
        },
      })
        .then((response) => {
          return response.data?.requestFileSignature?.documentToken
        })
        .catch((error: ApolloError) => {
          dispatchFileSignature({
            type: FileSignatureActionTypes.ERROR,
            status: FileSignatureStatus.REQUEST_ERROR,
            error: (error.graphQLErrors[0].extensions?.code as number) ?? 500,
          })
        })
      if (documentToken) {
        dispatchFileSignature({ type: FileSignatureActionTypes.UPLOAD })
        const success = await uploadSignedFile({
          variables: {
            input: {
              id: application.id,
              documentToken: documentToken,
              type: pdfType,
            },
          },
        })
          .then(() => {
            return true
          })
          .catch((error: ApolloError) => {
            dispatchFileSignature({
              type: FileSignatureActionTypes.ERROR,
              status: FileSignatureStatus.UPLOAD_ERROR,
              error: (error.graphQLErrors[0].extensions?.code as number) ?? 500,
            })
          })

        if (success) {
          dispatchFileSignature({ type: FileSignatureActionTypes.SUCCESS })
          return [true, null]
        }
      }
      return [false, 'Failed to update application']
    })

  const controlCode =
    requestFileSignatureData?.requestFileSignature?.controlCode
  const isDraft = application.state === 'draft'
  if (isDraft) {
    setValue(
      confirmContractTimestamp,
      format(addDays(new Date(), 28), 'dd.MM.yyyy'),
    )
  }

  return (
    <Box className={style.descriptionOffset}>
      <SignatureModal
        controlCode={controlCode}
        onClose={() =>
          dispatchFileSignature({
            type: FileSignatureActionTypes.CLOSE_MODAL,
          })
        }
        fileSignatureState={fileSignatureState}
      />
      <Box>
        {isDraft ? (
          <DescriptionText
            text={m.contract.general.description}
            format={{
              otherParent: parentB?.fullName ?? '',
            }}
          />
        ) : (
          <DescriptionText
            text={m.contract.general.parentBDescription}
            format={{
              otherParent: applicant.fullName,
            }}
          />
        )}
      </Box>
      <Box marginTop={4}>
        <ContractOverview
          application={application}
          parentKey={isDraft ? Roles.ParentA : Roles.ParentB}
        />
      </Box>
      <Box marginTop={5}>
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={() => window.open(pdfUrl, '_blank')}
          preTextIconType="filled"
          size="default"
          type="button"
          variant="ghost"
          loading={pdfLoading}
          disabled={!pdfUrl}
        >
          {formatMessage(m.contract.pdfButton.label)}
        </Button>
      </Box>
      <Box marginTop={5}>
        <CheckboxController
          id={isDraft ? confirmContractTerms : id}
          disabled={disabled || pdfLoading}
          error={isDraft ? errors?.confirmContract?.terms : error}
          large={true}
          defaultValue={[]}
          options={[
            {
              value: 'yes',
              label: formatMessage(m.contract.checkbox.label),
            },
          ]}
        />
      </Box>
    </Box>
  )
}

export default Overview
