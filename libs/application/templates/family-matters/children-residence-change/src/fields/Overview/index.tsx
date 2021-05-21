import React, { useEffect, useReducer } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useLazyQuery, ApolloError } from '@apollo/client'
import { PdfTypes } from '@island.is/application/core'
import { Box, Button } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import {
  GENERATE_PDF_PRESIGNED_URL,
  REQUEST_FILE_SIGNATURE,
  UPLOAD_SIGNED_FILE,
  GET_PRESIGNED_URL,
} from '@island.is/application/graphql'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import * as m from '../../lib/messages'
import { ApplicationStates } from '../../lib/constants'
import { ContractOverview } from '../components'
import {
  fileSignatureReducer,
  initialFileSignatureState,
  FileSignatureActionTypes,
  FileSignatureStatus,
} from './fileSignatureReducer'
import SignatureModal from './SignatureModal'
import { CRCFieldBaseProps } from '../../types'
import * as style from '../Shared.treat'

const Overview = ({
  field,
  error,
  application,
  setBeforeSubmitCallback,
}: CRCFieldBaseProps) => {
  const { id, disabled } = field
  const { answers, externalData } = application
  const [fileSignatureState, dispatchFileSignature] = useReducer(
    fileSignatureReducer,
    initialFileSignatureState,
  )
  const applicant = externalData.nationalRegistry.data
  const children = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )
  const parentB = children[0].otherParent

  const { formatMessage } = useIntl()
  const pdfType = PdfTypes.CHILDREN_RESIDENCE_CHANGE

  const [
    generatePdfPresignedUrl,
    { loading: createLoadingUrl, data: createResponse },
  ] = useMutation(GENERATE_PDF_PRESIGNED_URL)

  const [
    getPresignedUrl,
    { data: getResponse, loading: getLoadingUrl },
  ] = useLazyQuery(GET_PRESIGNED_URL)

  const [
    requestFileSignature,
    { data: requestFileSignatureData },
  ] = useMutation(REQUEST_FILE_SIGNATURE)

  const [uploadSignedFile] = useMutation(UPLOAD_SIGNED_FILE)

  useEffect(() => {
    const input = {
      variables: {
        input: {
          id: application.id,
          type: pdfType,
        },
      },
    }

    application.state === ApplicationStates.DRAFT
      ? generatePdfPresignedUrl(input)
      : getPresignedUrl(input)
  }, [
    application.id,
    generatePdfPresignedUrl,
    getPresignedUrl,
    application.state,
    pdfType,
  ])

  const pdfUrl =
    createResponse?.generatePdfPresignedUrl?.url ||
    getResponse?.getPresignedUrl?.url

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
            error: error.graphQLErrors[0].extensions?.code ?? 500,
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
              error: error.graphQLErrors[0].extensions?.code ?? 500,
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
        {application.state === 'draft' ? (
          <DescriptionText
            text={m.contract.general.description}
            format={{
              otherParent: parentB.fullName,
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
        <ContractOverview application={application} />
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
          loading={createLoadingUrl || getLoadingUrl}
          disabled={!pdfUrl}
        >
          {formatMessage(m.contract.pdfButton.label)}
        </Button>
      </Box>
      <Box marginTop={5}>
        <CheckboxController
          id={id}
          disabled={disabled}
          name={`${id}`}
          error={error}
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
