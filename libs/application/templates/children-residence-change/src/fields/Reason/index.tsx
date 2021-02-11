import React from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { reason } from '../../lib/messages'

const Reason = ({ error, application, field }: FieldBaseProps) => {
  const { id } = field
  const getValue = (id: string) => {
    return getValueViaPath(application.answers, id) as string
  }
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  return (
    <Controller
      name="reason"
      defaultValue={getValue('reason')}
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
