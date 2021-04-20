import React, { useEffect, useReducer } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useLazyQuery, ApolloError } from '@apollo/client'
import { PdfTypes } from '@island.is/application/core'
import { Box, Text, Button } from '@island.is/island-ui/core'
import {
  CREATE_PDF_PRESIGNED_URL,
  REQUEST_FILE_SIGNATURE,
  UPLOAD_SIGNED_FILE,
  GET_PRESIGNED_URL,
} from '@island.is/application/graphql'
import {
  childrenResidenceInfo,
  formatAddress,
  getSelectedChildrenFromExternalData,
  formatDate,
} from '../../lib/utils'
import * as m from '../../lib/messages'
import { ApplicationStates, Roles } from '../../lib/constants'
import { DescriptionText, TransferOverview } from '../components'
import {
  fileSignatureReducer,
  initialFileSignatureState,
  FileSignatureActionTypes,
  FileSignatureStatus,
} from './fileSignatureReducer'
import SignatureModal from './SignatureModal'
import { CRCFieldBaseProps } from '../../types'
import * as style from './Overview.treat'

const Overview = ({
  application,
  setBeforeSubmitCallback,
}: CRCFieldBaseProps) => {
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
  const childResidenceInfo = childrenResidenceInfo(applicant, answers)
  const { formatMessage } = useIntl()
  const pdfType = PdfTypes.CHILDREN_RESIDENCE_CHANGE

  const [
    createPdfPresignedUrl,
    { loading: createLoadingUrl, data: createResponse },
  ] = useMutation(CREATE_PDF_PRESIGNED_URL)

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
      ? createPdfPresignedUrl(input)
      : getPresignedUrl(input)
  }, [
    application.id,
    createPdfPresignedUrl,
    getPresignedUrl,
    application.state,
    pdfType,
  ])

  const pdfUrl =
    createResponse?.createPdfPresignedUrl?.url ||
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
  // TODO: Look into if we want to do this in a different way - using the application state seems wrong
  const parentKey =
    application.state === 'draft' ? Roles.ParentA : Roles.ParentB

  return (
    <Box className={style.container}>
      <SignatureModal
        controlCode={controlCode}
        onClose={() =>
          dispatchFileSignature({
            type: FileSignatureActionTypes.RESET,
          })
        }
        fileSignatureState={fileSignatureState}
      />
      <Box>
        <DescriptionText
          text={m.contract.general.description}
          format={{
            otherParent:
              parentKey === Roles.ParentA
                ? parentB.fullName
                : applicant.fullName,
          }}
        />
      </Box>
      <TransferOverview application={application} />
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.labels.contactInformation)}
        </Text>
        <Text>{answers[parentKey]?.email}</Text>
        <Text>{answers[parentKey]?.phoneNumber}</Text>
      </Box>
      {answers.residenceChangeReason && (
        <Box marginTop={4}>
          <Text variant="h4" marginBottom={1}>
            {formatMessage(m.reason.input.label)}
          </Text>
          <Text>{answers.residenceChangeReason}</Text>
        </Box>
      )}
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.duration.general.sectionTitle)}
        </Text>
        <Text>
          {answers.selectDuration.type === 'temporary' &&
          answers.selectDuration.date
            ? formatDate(answers.selectDuration.date)
            : formatMessage(m.duration.permanentInput.label)}
        </Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.childBenefit.label)}
        </Text>
        <Text>
          {formatMessage(m.contract.childBenefit.text, {
            otherParent: childResidenceInfo.future.parentName,
          })}
        </Text>
      </Box>
      <Box marginTop={5} marginBottom={3}>
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
    </Box>
  )
}

export default Overview
