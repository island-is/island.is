import React from 'react'
import { useIntl } from 'react-intl'
import { FieldBaseProps } from '@island.is/application/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { terms } from '../../lib/messages'
import { DescriptionText } from '../components'

const Terms = ({ field, error }: FieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useIntl()
  return (
    <>
      <Box marginTop={3} marginBottom={5}>
        <DescriptionText text={terms.general.description} />
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
            label: formatMessage(terms.residenceChangeCheckbox.label),
          },
        ]}
      />
    </>
  )
}

export default Terms
