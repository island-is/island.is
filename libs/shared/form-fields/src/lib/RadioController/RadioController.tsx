import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import {
  RadioButton,
  Tooltip,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

interface Option {
  value: string
  label: React.ReactNode
  tooltip?: React.ReactNode
  excludeOthers?: boolean
}
interface Props {
  defaultValue?: string[]
  disabled?: boolean
  error?: string
  id: string
  name?: string
  options?: Option[]
  largeButtons?: boolean
  split?: '1/1' | '1/2' | '1/3' | '1/4'
  emphasize?: boolean
  onSelect?: (s: string) => void
}
export const RadioController: FC<Props> = ({
  defaultValue,
  disabled = false,
  error,
  id,
  name = id,
  options = [],
  largeButtons = false,
  emphasize = false,
  onSelect = () => undefined,
  split = '1/1',
}) => {
  const { clearErrors, setValue } = useFormContext()

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ value, onChange }) => (
        <GridRow>
          {options.map((option, index) => (
            <GridColumn span={['1/1', split]} paddingBottom={2}>
              <RadioButton
                large={largeButtons || emphasize}
                filled={emphasize}
                tooltip={option.tooltip}
                key={`${id}-${index}`}
                onChange={({ target }) => {
                  clearErrors(id)
                  onChange(target.value)
                  onSelect(target.value)
                  setValue(id, target.value)
                }}
                checked={option.value === value}
                id={`${id}-${index}`}
                name={`${id}`}
                label={option.label}
                value={option.value}
                disabled={disabled}
                errorMessage={index === options.length - 1 ? error : undefined}
                hasError={error !== undefined}
              />
            </GridColumn>
          ))}
        </GridRow>
      )}
    />
  )
}

export default RadioController
