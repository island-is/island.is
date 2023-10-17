import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { Box, Checkbox } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'

const ChildDoesNotHaveNationalIdCheckbox: FC<FieldBaseProps> = ({
  error,
  field,
  application,
}) => {
  const { id } = field
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const defaultValue = getValueViaPath(
    application.answers,
    id as string,
    false,
  ) as boolean

  return (
    <Controller
      name={id}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => {
        return (
          <Box>
            <Checkbox
              id={id}
              name={id}
              label={formatText(
                oldAgePensionFormMessage.connectedApplications
                  .childPensionChildDoesNotHaveNationalId,
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

export default ChildDoesNotHaveNationalIdCheckbox
