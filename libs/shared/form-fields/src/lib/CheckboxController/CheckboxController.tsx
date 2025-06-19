import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Checkbox,
  InputError,
  GridRow,
  GridColumn,
  InputBackgroundColor,
} from '@island.is/island-ui/core'
import { clearInputsOnChange, setInputsOnChange } from '@island.is/shared/utils'

type CheckboxProps = React.ComponentProps<typeof Checkbox>

interface Option {
  value: string
  label: React.ReactNode
  subLabel?: React.ReactNode
  tooltip?: React.ReactNode
  disabled?: boolean
  excludeOthers?: boolean
  rightContent?: React.ReactNode
}
interface CheckboxControllerProps {
  defaultValue?: string[]
  disabled?: boolean
  error?: string
  id: string
  labelVariant?: CheckboxProps['labelVariant']
  name?: string
  large?: boolean
  spacing?: 0 | 1 | 2
  strong?: boolean
  options?: Option[]
  split?: '1/1' | '1/2' | '1/3' | '1/4'
  backgroundColor?: InputBackgroundColor
  onSelect?: (s: string[]) => void
  clearOnChange?: string[]
  setOnChange?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { key: string; value: any }[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((value: string[]) => Promise<{ key: string; value: any }[]>)
}
export const CheckboxController: FC<
  React.PropsWithChildren<CheckboxControllerProps>
> = ({
  defaultValue = [],
  disabled = false,
  labelVariant,
  spacing = 2,
  error,
  id,
  name = id,
  large,
  strong,
  options = [],
  split = '1/1',
  backgroundColor,
  onSelect = () => undefined,
  clearOnChange,
  setOnChange,
}) => {
  const { clearErrors, setValue } = useFormContext()

  // eslint-disable-next-line func-style
  function handleSelect(option: Option, checkedValues: string[]) {
    const excludeOptionsLookup = options.map((o) => o.excludeOthers && o.value)

    let newChoices = []
    if (option.excludeOthers && !checkedValues.includes(option.value)) {
      return [option.value]
    }

    newChoices = checkedValues?.includes(option.value)
      ? checkedValues?.filter((val) => val !== option.value)
      : [...checkedValues, option.value]

    newChoices = newChoices.filter(
      (choice) => !excludeOptionsLookup.includes(choice),
    )

    return newChoices
  }

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <GridRow>
          {options.map((option, index) => (
            <GridColumn
              span={['1/1', split]}
              paddingBottom={spacing}
              key={`option-${option.value}`}
            >
              <Checkbox
                disabled={disabled || option.disabled}
                large={large}
                onChange={async () => {
                  clearErrors(id)
                  const newChoices = handleSelect(
                    option,
                    Array.isArray(value) ? value : [value],
                  )
                  onChange(newChoices)
                  setValue(id, newChoices)
                  onSelect(newChoices)
                  if (clearOnChange) {
                    clearInputsOnChange(clearOnChange, setValue)
                  }
                  if (setOnChange) {
                    setInputsOnChange(
                      typeof setOnChange === 'function'
                        ? await setOnChange(newChoices)
                        : setOnChange,
                      setValue,
                    )
                  }
                }}
                rightContent={option.rightContent}
                checked={value && value.includes(option.value)}
                name={name}
                id={`${id}[${index}]`}
                label={option.label}
                strong={strong}
                labelVariant={labelVariant}
                subLabel={option.subLabel}
                value={option.value}
                hasError={error !== undefined}
                tooltip={option.tooltip}
                backgroundColor={backgroundColor}
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

export default CheckboxController
