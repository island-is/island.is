import React from 'react'
import { useIntl } from 'react-intl'
import { Terms } from '@island.is/application/templates/family-matters-core/fields'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { terms } from '../../lib/messages'
import { JCAFieldBaseProps } from '../../types'

const JCATerms = ({ field, error }: JCAFieldBaseProps) => {
  const { id, disabled } = field
  const { formatMessage } = useIntl()
  return (
    <Terms
      id={id}
      error={error}
      disabled={disabled}
      options={[
        {
          value: 'effect',
          label: formatMessage(terms.jointCustodyCheckbox.label),
        },
        {
          value: 'legalResidence',
          label: formatMessage(terms.legalResidenceCheckbox.label),
        },
      ]}
    >
      <DescriptionText text={terms.general.description} />
    </Terms>
  )
}

export default JCATerms
