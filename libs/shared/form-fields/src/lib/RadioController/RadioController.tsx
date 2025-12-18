import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'

import {
  RadioButton,
  GridRow,
  GridColumn,
  InputError,
  InputBackgroundColor,
  TagVariant,
  BoxProps,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { clearInputsOnChange } from '@island.is/shared/utils'

interface Option extends TestSupport {
  value: string
  label: React.ReactNode
  subLabel?: React.ReactNode
  tooltip?: React.ReactNode
  tag?: {
    label: string
    variant?: TagVariant
    outlined?: boolean
  }
  excludeOthers?: boolean
  illustration?: React.FC<React.PropsWithChildren<unknown>>
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
  hasIllustration?: boolean
  paddingBottom?: BoxProps['paddingBottom']
  paddingTop?: BoxProps['paddingTop']
  clearOnChange?: string[]
  clearOnChangeDefaultValue?:
    | string
    | string[]
    | boolean
    | boolean[]
    | number
    | number[]
    | undefined
}

export const RadioController: FC<React.PropsWithChildren<Props>> = ({
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
  hasIllustration = false,
  paddingBottom = 2,
  paddingTop = 0,
  clearOnChange,
  clearOnChangeDefaultValue,
}) => {
  const { clearErrors, setValue } = useFormContext()

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <GridRow>
          {options.map((option, index) => (
            <GridColumn
              span={[smallScreenSplit, split]}
              paddingBottom={paddingBottom}
              paddingTop={paddingTop}
              key={`option-${option.value}`}
            >
              <RadioButton
                large={largeButtons}
                tooltip={option.tooltip}
                tag={option.tag}
                key={`${id}-${index}`}
                onChange={({ target }) => {
                  clearErrors(id)
                  onChange(target.value)
                  onSelect(target.value)
                  setValue(id, target.value)
                  if (clearOnChange) {
                    clearInputsOnChange(
                      clearOnChange,
                      setValue,
                      clearOnChangeDefaultValue,
                    )
                  }
                }}
                checked={option.value === value}
                dataTestId={option.dataTestId}
                id={`${id}-${index}`}
                name={`${id}`}
                label={option.label}
                subLabel={option.subLabel}
                value={option.value}
                disabled={disabled || option.disabled}
                hasError={error !== undefined}
                backgroundColor={backgroundColor}
                illustration={option.illustration}
                hasIllustration={hasIllustration}
              />
            </GridColumn>
          ))}

          {error && (
            <GridColumn
              span={['1/1', split]}
              paddingBottom={paddingBottom}
              paddingTop={paddingTop}
            >
              <InputError errorMessage={error} />
            </GridColumn>
          )}
        </GridRow>
      )}
    />
  )
}

export default RadioController
