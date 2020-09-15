import React, { FC } from 'react'
import { Box } from '../Box/Box'
import { RadioButton } from '../RadioButton/RadioButton'
import { Stack } from '../Stack/Stack'
import { Tooltip } from '../Tooltip/Tooltip'
import { useFormContext, Controller } from 'react-hook-form'

interface Option {
  value: string
  label: string
  tooltip?: string
  excludeOthers?: boolean
}
interface Props {
  defaultValue?: string[]
  error?: string
  id: string
  name?: string
  options?: Option[]
}
export const RadioController: FC<Props> = ({
  defaultValue,
  error,
  id,
  name = id,
  options = [],
}) => {
  const { clearErrors, setValue } = useFormContext()
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ value, onChange }) => {
        return (
          <Stack space={2}>
            {options.map((option, index) => (
              <Box display="flex" alignItems="center" key={option.value}>
                <RadioButton
                  key={`${id}-${index}`}
                  onChange={({ target }) => {
                    clearErrors(id)
                    onChange(target.value)
                    setValue(id, target.value)
                  }}
                  checked={option.value === value}
                  id={`${id}-${index}`}
                  name={`${id}`}
                  label={option.label}
                  value={option.value}
                  errorMessage={
                    index === options.length - 1 ? error : undefined
                  }
                  hasError={error !== undefined}
                />
                {option.tooltip && (
                  <Box marginLeft={1}>
                    <Tooltip
                      colored={true}
                      placement="top"
                      text={option.tooltip}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )
      }}
    />
  )
}

export default RadioController
