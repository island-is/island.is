import React, { useEffect, useReducer } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { FieldBaseProps, PdfTypes } from '@island.is/application/core'
import {
  Box,
  Text,
  AlertMessage,
  Button,
  ModalBase,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import {
  CREATE_PDF_PRESIGNED_URL,
  REQUEST_FILE_SIGNATURE,
  UPLOAD_SIGNED_FILE,
} from '@island.is/application/graphql'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
  extractAnswersFromApplication,
  constructParentAddressString,
  extractApplicantFromApplication,
} from '../../lib/utils'
import * as m from '../../lib/messages'
import { DescriptionText } from '../components'
import {
  fileSignatureReducer,
  initialFileSignatureState,
  FileSignatureActionTypes,
  FileSignatureStatus,
  ErrorStatus,
} from './fileSignatureReducer'
import * as style from './Overview.treat'

const Overview = ({ application, setBeforeSubmitCallback }: FieldBaseProps) => {
  const [fileSignatureState, dispatchFileSignature] = useReducer(
    fileSignatureReducer,
    initialFileSignatureState,
  )
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  const children = extractChildrenFromApplication(application)
  const answers = extractAnswersFromApplication(application)
  const { formatMessage } = useIntl()
  const pdfType = PdfTypes.CHILDREN_RESIDENCE_CHANGE

  const [
    createPdfPresignedUrl,
    { loading: loadingUrl, data: pdfResponse },
  ] = useMutation(CREATE_PDF_PRESIGNED_URL)
  const [
    requestFileSignature,
    { data: requestFileSignatureData },
  ] = useMutation(REQUEST_FILE_SIGNATURE, {
    onError: () =>
      dispatchFileSignature({
        type: FileSignatureActionTypes.ERROR,
        status: FileSignatureStatus.REQUEST_ERROR,
        error: '500',
      }),
    onCompleted: () =>
      dispatchFileSignature({ type: FileSignatureActionTypes.UPLOAD }),
  })
  const [uploadSignedFile] = useMutation(UPLOAD_SIGNED_FILE, {
    onError: () =>
      dispatchFileSignature({
        type: FileSignatureActionTypes.ERROR,
        status: FileSignatureStatus.UPLOAD_ERROR,
        error: '500',
      }),
    onCompleted: () =>
      dispatchFileSignature({ type: FileSignatureActionTypes.SUCCESS }),
  })

  useEffect(() => {
    createPdfPresignedUrl({
      variables: {
        input: {
          id: application.id,
          type: pdfType,
        },
      },
    })
  }, [application.id, createPdfPresignedUrl])

  const pdfUrl = pdfResponse?.createPdfPresignedUrl?.attachments?.[pdfType]

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (!pdfUrl) {
        return [false, 'no pdf url']
      }
      dispatchFileSignature({ type: FileSignatureActionTypes.REQUEST })
      const requestResponse = await requestFileSignature({
        variables: {
          input: {
            id: application.id,
            type: pdfType,
          },
        },
      })
      if (requestResponse?.data) {
        const documentToken =
          requestResponse.data.requestFileSignature?.externalData?.fileSignature
            ?.data?.documentToken
        const signedFileReponse = await uploadSignedFile({
          variables: {
            input: {
              id: application.id,
              documentToken: documentToken,
              type: pdfType,
            },
          },
        })
        if (signedFileReponse?.data) {
          return [true, null]
        }
      }
      return [false, 'Failed to update application']
    })

  const controlCode =
    requestFileSignatureData?.requestFileSignature?.externalData?.fileSignature
      ?.data?.controlCode
  const hasError = [
    FileSignatureStatus.REQUEST_ERROR,
    FileSignatureStatus.UPLOAD_ERROR,
  ].includes(fileSignatureState.status)
  return (
    <>
      <ModalBase
        baseId="signatureDialog"
        className={style.modal}
        modalLabel="Rafræn undirritun"
        isVisible={fileSignatureState.modalOpen}
        onVisibilityChange={(visibility) => {
          if (!visibility) {
            dispatchFileSignature({
              type: FileSignatureActionTypes.RESET,
            })
          }
        }}
        // When there is an error it should not be possible to close the modal
        hideOnEsc={hasError}
        // Passing in tabIndex={0} when there is no tabbable element inside the modal
        tabIndex={!hasError ? 0 : undefined}
      >
        <Box
          className={style.modalContent}
          boxShadow="large"
          borderRadius="standard"
          background="white"
          paddingX={[3, 3, 5, 12]}
          paddingY={[3, 3, 4, 10]}
        >
          <Text variant="h1" marginBottom={2}>
            Rafræn undirritun
          </Text>
          <>
            {(() => {
              switch (fileSignatureState.status) {
                case FileSignatureStatus.REQUEST:
                  return (
                    <>
                      <Box marginBottom={2}>
                        <SkeletonLoader width="50%" height={30} />
                      </Box>
                      <SkeletonLoader repeat={2} space={1} />
                    </>
                  )
                case FileSignatureStatus.UPLOAD:
                  return (
                    <>
                      <Text variant="h2" marginBottom={2}>
                        Öryggistala:{' '}
                        <span className={style.controlCode}>{controlCode}</span>
                      </Text>
                      <Text>
                        Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu
                        ef sama öryggistala birtist í símanum þínum.
                      </Text>
                    </>
                  )
                case FileSignatureStatus.REQUEST_ERROR:
                case FileSignatureStatus.UPLOAD_ERROR:
                  return (
                    <>
                      <AlertMessage
                        type="error"
                        title="Villa kom upp við undirritun"
                        message="Það hefur eitthvað farið úrskeiðis við undirritun, vinsamlegast reynið aftur."
                      />
                      <Box marginTop={3} justifyContent="center">
                        <Button
                          onClick={() =>
                            dispatchFileSignature({
                              type: FileSignatureActionTypes.RESET,
                            })
                          }
                          variant="primary"
                        >
                          Loka
                        </Button>
                      </Box>
                    </>
                  )
                default:
                  return null
              }
            })()}
          </>
        </Box>
      </ModalBase>
      <Box marginTop={3}>
        <AlertMessage
          type="info"
          title={formatMessage(m.contract.alert.title)}
          message={formatMessage(m.contract.alert.message)}
        />
      </Box>
      <Box marginTop={5}>
        <DescriptionText
          text={m.contract.general.description}
          format={{ otherParent: parent.name }}
        />
      </Box>
      <Box marginTop={5}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.labels.childName, {
            count: children.length,
          })}
        </Text>
        {children.map((child) => (
          <Text key={child.name}>{child.name}</Text>
        ))}
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={2}>
          {formatMessage(m.contract.labels.otherParentContactInformation)}
        </Text>
        <Text>{formatMessage(m.otherParent.inputs.emailLabel)}</Text>
        <Text fontWeight="medium" marginBottom={2}>
          {answers.contactInformation.email}
        </Text>
        <Text>{formatMessage(m.otherParent.inputs.phoneNumberLabel)}</Text>
        <Text fontWeight="medium">
          {answers.contactInformation.phoneNumber}
        </Text>
      </Box>
      {answers.reason && (
        <Box marginTop={4}>
          <Text variant="h4" marginBottom={1}>
            {formatMessage(m.reason.input.label)}
          </Text>
          <Text>{answers.reason}</Text>
        </Box>
      )}
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.labels.currentResidence, {
            count: children.length,
          })}
        </Text>
        <Text>{applicant?.fullName}</Text>
        <Text>{applicant?.legalResidence}</Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.labels.newResidence, {
            count: children.length,
          })}
        </Text>
        <Text>{parent?.name}</Text>
        <Text fontWeight="light">{parentAddress}</Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.duration.general.sectionTitle)}
        </Text>
        <Text>
          {answers.selectedDuration.length > 1
            ? answers.selectedDuration[1]
            : formatMessage(m.duration.permanentInput.label)}
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
          loading={loadingUrl}
          disabled={loadingUrl || !pdfUrl}
        >
          {formatMessage(m.contract.pdfButton.label)}
        </Button>
      </Box>
    </>
  )
}

export default Overview
