import React from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import {
  extractApplicantFromApplication,
  extractParentFromApplication,
  constructParentAddressString,
} from '../../lib/utils'
import { newResidence } from '../../lib/messages'
import { DescriptionText } from '../components'

const ChangeInformation = ({ field, application, error }: FieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useLocale()
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  const description = newResidence.general.description.defaultMessage
  return (
    <>
      <DescriptionText textNode={description} />
      <Box marginBottom={4}>
        <Text variant="h4">
          {formatMessage(newResidence.information.currentResidenceLabel)}
        </Text>
        <Text variant="h4" color="blue400">
          {applicant?.fullName}
        </Text>
        <Text fontWeight="light">{applicant?.legalResidence}</Text>
      </Box>
      <Box marginBottom={5}>
        <Text variant="h4">
          {formatMessage(newResidence.information.newResidenceLabel)}
        </Text>
        <Text variant="h4" color="blue400">
          {parent?.name}
        </Text>
        <Text fontWeight="light">{parentAddress}</Text>
      </Box>
      <CheckboxController
        id={id}
        disabled={disabled}
        name={`${id}`}
        error={error}
        large={true}
        options={[
          {
            value: 'yes',
            label: formatMessage(newResidence.checkbox.label),
          },
        ]}
      />
    </>
  )
}

export default ChangeInformation
