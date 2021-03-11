import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Input } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { reason } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const Reason = ({ application, field }: CRCFieldBaseProps) => {
  const { id } = field
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  return (
    <Controller
      name="reason"
      defaultValue={application.answers.residenceChangeReason}
      render={({ value, onChange }) => {
        return (
          <Box marginTop={4}>
            <Input
              id={id}
              name={`${id}`}
              label={formatMessage(reason.input.label)}
              value={value}
              placeholder={formatMessage(reason.input.placeholder)}
              textarea={true}
              rows={6}
              onChange={(e) => {
                onChange(e.target.value)
                setValue(id as string, e.target.value)
              }}
            />
          </Box>
        )
      }}
    />
  )
}

export default Reason
