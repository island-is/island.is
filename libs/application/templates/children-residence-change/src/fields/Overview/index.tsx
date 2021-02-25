import React, { useEffect, useState } from 'react'
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
import * as style from './Overview.treat'

const Overview = ({ application, setBeforeSubmitCallback }: FieldBaseProps) => {
  const [modalOpen, setModalOpen] = useState(false)
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
  ] = useMutation(REQUEST_FILE_SIGNATURE)
  const [uploadSignedFile] = useMutation(UPLOAD_SIGNED_FILE)

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

  setBeforeSubmitCallback(async () => {
    if (!pdfUrl) {
      return [false, 'no pdf url']
    }
    setModalOpen(true)
    const requestResponse = await requestFileSignature({
      variables: {
        input: {
          id: application.id,
          type: pdfType,
        },
      },
    })
    if (requestResponse?.data) {
      const documentToken = requestResponse.data.requestFileSignature?.externalData?.fileSignature?.data?.documentToken
      const signedFileReponse = await uploadSignedFile({
        variables: {
          input: {
            id: application.id,
            documentToken,
            type: pdfType,
          },
        },
      })
      if (signedFileReponse.data) {
        return [true, null]
      }
    }
    return [false, 'Failed to update application']
  })

  const controlCode =
    requestFileSignatureData?.requestFileSignature?.externalData?.fileSignature?.data?.controlCode
  return (
    <>
      <ModalBase
        baseId="myDialog"
        isVisible={modalOpen}
        hideOnClickOutside={false}
        className={style.modal}
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
          {controlCode ? (
            <>
              <Text variant="h2" marginBottom={2}>
                Öryggistala:{' '}
                <span className={style.controlCode}>{controlCode}</span>
              </Text>
              <Text>
                Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama
                öryggistala birtist í símanum þínum.
              </Text>
            </>
          ) : (
            <>
              <Box marginBottom={2}>
                <SkeletonLoader width="50%" height={30} />
              </Box>
              <SkeletonLoader repeat={2} space={1} />
            </>
          )}
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
