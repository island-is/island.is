import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import {
  extractApplicantFromApplication,
  extractParentFromApplication,
  constructParentAddressString,
} from '../../lib/utils'
import { newResidence } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '../components'

const ChangeInformation = ({
  field,
  application,
  error,
}: CRCFieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useIntl()
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={newResidence.general.description} />
      </Box>
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
        defaultValue={[]}
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
