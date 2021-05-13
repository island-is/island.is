import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { RadioController } from '@island.is/shared/form-fields'
import { getOtherParentInformation } from '@island.is/application/templates/family-matters-core/utils'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { selectLegalResidence } from '../../lib/messages'
import { JCAFieldBaseProps } from '../../types'

const SelectLegalResidence = ({
  field,
  application,
  error,
}: JCAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const {
    externalData: { nationalRegistry },
    answers,
  } = application
  const applicant = nationalRegistry.data
  const otherParent = getOtherParentInformation(
    applicant.children,
    answers.selectedChildren,
  )
  return (
    <>
      <Box marginTop={3}>
        <DescriptionText text={selectLegalResidence.general.description} />
      </Box>
      <Box marginTop={5}>
        <Text variant="h4" marginBottom={2}>
          {formatMessage(selectLegalResidence.inputs.label)}
        </Text>
        <RadioController
          id={`${field.id}`}
          largeButtons={true}
          error={error}
          defaultValue={answers.selectedLegalResidence}
          options={[
            {
              value: applicant.nationalId,
              label: applicant.fullName,
            },
            {
              value: otherParent.nationalId,
              label: otherParent.fullName,
            },
          ]}
        />
      </Box>
    </>
  )
}

export default SelectLegalResidence
