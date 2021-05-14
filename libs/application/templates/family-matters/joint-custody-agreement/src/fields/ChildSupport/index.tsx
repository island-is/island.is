import React from 'react'
import { useIntl } from 'react-intl'
import { Terms } from '@island.is/application/templates/family-matters-core/fields'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { childSupport } from '../../lib/messages'
import { JCAFieldBaseProps } from '../../types'

const ChildSupport = ({ field, error }: JCAFieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useIntl()
  return (
    <Terms
      id={id}
      error={error}
      disabled={disabled}
      options={[
        {
          value: 'yes',
          label: formatMessage(childSupport.childBenefitCheckbox.label),
        },
      ]}
    >
      <DescriptionText text={childSupport.general.description} />
    </Terms>
  )
}

export default ChildSupport
