import React from 'react'
import { useIntl } from 'react-intl'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { terms } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { DescriptionText } from '../components'

const Terms = ({ field, error }: CRCFieldBaseProps) => {
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
        defaultValue={[]}
        options={[
          {
            value: 'effect',
            label: formatMessage(terms.residenceChangeCheckbox.label),
          },
          {
            value: 'childBenefit',
            label: formatMessage(terms.familySupportCheckbox.label),
          },
        ]}
      />
    </>
  )
}

export default Terms
