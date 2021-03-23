import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { constructParentAddressString } from '../../lib/utils'
import { newResidence } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '../components'

const ChangeInformation = ({
  field,
  application,
  error,
}: CRCFieldBaseProps) => {
  const { id, disabled } = field
  const { externalData } = application
  const { formatMessage } = useIntl()
  const applicant = externalData.nationalRegistry.data
  const otherParent = applicant?.children?.[0].otherParent
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
        <Text fontWeight="light">
          {constructParentAddressString(applicant?.address)}
        </Text>
      </Box>
      <Box marginBottom={5}>
        <Text variant="h4">
          {formatMessage(newResidence.information.newResidenceLabel)}
        </Text>
        <Text variant="h4" color="blue400">
          {otherParent?.fullName}
        </Text>
        <Text fontWeight="light">
          {constructParentAddressString(otherParent?.address)}
        </Text>
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
