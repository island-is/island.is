import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Input } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { DescriptionText } from '@island.is/application/templates/family-matters-core/components'
import { reason } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const Reason = ({ application, field }: CRCFieldBaseProps) => {
  const { id } = field
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  return (
    <Box>
      <Box marginTop={3}>
        <DescriptionText text={reason.general.description} />
      </Box>
      <Box marginTop={5}>
        <Controller
          name="reason"
          defaultValue={application.answers.residenceChangeReason}
          render={({ field: { onChange, value } }) => {
            return (
              <Input
                id={id}
                name={`${id}`}
                label={formatMessage(reason.input.label)}
                value={value}
                placeholder={formatMessage(reason.input.placeholder)}
                textarea={true}
                rows={5}
                backgroundColor="blue"
                onChange={(e) => {
                  onChange(e.target.value)
                  setValue(id as string, e.target.value)
                }}
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default Reason
