import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import {
  RadioButton,
  GridRow,
  GridColumn,
  InputError,
  InputBackgroundColor,
} from '@island.is/island-ui/core'

interface Option {
  value: string
  label: React.ReactNode
  subLabel?: string
  tooltip?: React.ReactNode
  excludeOthers?: boolean
  illustration?: React.FC
  disabled?: boolean
}

interface Props {
  defaultValue?: any
  disabled?: boolean
  error?: string
  id: string
  name?: string
  options?: Option[]
  largeButtons?: boolean
  split?: '1/1' | '1/2' | '1/3' | '1/4' | '1/5'
  smallScreenSplit?: '1/1' | '1/2' | '1/3' | '1/4' | '1/5'
  backgroundColor?: InputBackgroundColor
  onSelect?: (s: string) => void
}

export const RadioController: FC<Props> = ({
  defaultValue,
  disabled = false,
  error,
  id,
  name = id,
  options = [],
  largeButtons = true,
  onSelect = () => undefined,
  backgroundColor = 'blue',
  split = '1/1',
  smallScreenSplit = '1/1',
}) => {
  const { clearErrors, setValue } = useFormContext()

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ value, onChange }) => (
        <GridRow>
          {options.map((option, index) => (
            <GridColumn
              span={[smallScreenSplit, split]}
              paddingBottom={2}
              key={`option-${option.value}`}
            >
              <RadioButton
                large={largeButtons}
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
                subLabel={option.subLabel}
                value={option.value}
                disabled={disabled || option.disabled}
                hasError={error !== undefined}
                backgroundColor={backgroundColor}
                illustration={option.illustration}
              />
            </GridColumn>
          ))}

          {error && (
            <GridColumn span={['1/1', split]} paddingBottom={2}>
              <InputError errorMessage={error} />
            </GridColumn>
          )}
        </GridRow>
      )}
    />
  )
}

export default RadioController
