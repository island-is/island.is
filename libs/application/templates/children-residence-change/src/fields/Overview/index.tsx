import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useLazyQuery } from '@apollo/client'
import { FieldBaseProps, PdfTypes } from '@island.is/application/core'
import { Box, Text, AlertMessage, Button } from '@island.is/island-ui/core'
import {
  CREATE_PDF_PRESIGNED_URL,
  GET_PRESIGNED_URL,
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
import { ApplicationStates } from '../../lib/ChildrenResidenceChangeTemplate'

const Overview = ({ application }: FieldBaseProps) => {
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  const children = extractChildrenFromApplication(application)
  const answers = extractAnswersFromApplication(application)
  const { formatMessage } = useIntl()

  const [
    createPdfPresignedUrl,
    { loading: createLoadingUrl, data: createResponse },
  ] = useMutation(CREATE_PDF_PRESIGNED_URL, {
    onError: (e) => console.log('error', e),
  })

  const [
    getPresignedUrl,
    { data: getResponse, loading: getLoadingUrl },
  ] = useLazyQuery(GET_PRESIGNED_URL)

  useEffect(() => {
    const input = {
      variables: {
        input: {
          id: application.id,
          type: PdfTypes.CHILDREN_RESIDENCE_CHANGE,
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
  ])

  const pdfUrl =
    createResponse?.createPdfPresignedUrl?.attachments?.[
      PdfTypes.CHILDREN_RESIDENCE_CHANGE
    ] ||
    getResponse?.getPresignedUrl?.attachments?.[
      PdfTypes.CHILDREN_RESIDENCE_CHANGE
    ]

  return (
    <>
      <Box marginTop={0}>
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
          loading={createLoadingUrl || getLoadingUrl}
          disabled={!pdfUrl}
        >
          {formatMessage(m.contract.pdfButton.label)}
        </Button>
      </Box>
    </>
  )
}

export default Overview
