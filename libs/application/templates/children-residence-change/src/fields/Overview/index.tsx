import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from '@apollo/client'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, AlertMessage, Button } from '@island.is/island-ui/core'
import { CREATE_PDF_PRESIGNED_URL } from '@island.is/application/graphql'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
  extractAnswersFromApplication,
  constructParentAddressString,
  extractApplicantFromApplication,
} from '../../lib/utils'
import * as m from '../../lib/messages'
import { DescriptionText } from '../components'

const Overview = ({ application }: FieldBaseProps) => {
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  const children = extractChildrenFromApplication(application)
  const answers = extractAnswersFromApplication(application)
  const { formatMessage } = useIntl()

  const [createPdfPresignedUrl, { loading: loadingUrl, data }] = useMutation(
    CREATE_PDF_PRESIGNED_URL,
    {
      onError: (e) => console.log('error', e),
    },
  )

  useEffect(() => {
    createPdfPresignedUrl({
      variables: {
        input: {
          id: application.id,
          type: 'ChildrenResidenceChange',
        },
      },
    })
  }, [application.id, createPdfPresignedUrl])

  const pdfUrl =
    data?.createPdfPresignedUrl?.attachments?.ChildrenResidenceChange

  return (
    <>
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
