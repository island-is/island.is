import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { Box, Text, AlertMessage } from '@island.is/island-ui/core'
import { DescriptionText } from '../components'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
  extractAnswersFromApplication,
  constructParentAddressString,
  extractApplicantFromApplication,
} from '../../lib/utils'
import * as m from '../../lib/messages'

const Overview = ({ application }: FieldBaseProps) => {
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  const children = extractChildrenFromApplication(application)
  const usePluralForChildren = children.length > 1
  const answers = extractAnswersFromApplication(application)
  const { formatMessage } = useLocale()
  return (
    <>
      <Box marginTop={3}>
        <AlertMessage
          type="info"
          title="Upphafsdagur samnings"
          message="Breyting á lögheimili og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur afgreitt hana."
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
      <Box marginTop={4} marginBottom={6}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.duration.general.sectionTitle)}
        </Text>
        <Text>
          {answers.durationDate
            ? answers.durationDate
            : formatMessage(m.duration.permanentInput.label)}
        </Text>
      </Box>
    </>
  )
}

export default Overview
