import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Checkbox } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'

const ConfirmCheckbox: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  field,
  application,
}) => {
  const { id, disabled } = field
  const { setValue } = useFormContext()
  const defaultValue = getValueViaPath(
    application.answers,
    id as string,
    false,
  ) as boolean
  const { formatMessage } = useLocale()

  return (
    <Controller
      name={id}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => {
        return (
          <Box
            border="standard"
            borderColor="blue200"
            borderRadius="large"
            padding={3}
          >
            <Checkbox
              id={id}
              disabled={disabled}
              name={`${id}`}
              label={formatText(
                m.confirmCorrectInfo,
                application,
                formatMessage,
              )}
              hasError={!!error}
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked)
                setValue(id as string, e.target.checked)
              }}
            />
          </Box>
        )
      }}
    />
  )
}

export default ConfirmCheckbox
