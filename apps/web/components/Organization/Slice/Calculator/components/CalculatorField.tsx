import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import type { GridColumnProps } from '@island.is/island-ui/core'
import { Checkbox, GridColumn } from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorInputFieldSize,
  CalculatorInputValueField,
} from '@island.is/tax-calculators'
import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '@island.is/web/graphql/schema'

import type { InputContractField } from '../contract'
import { inputSemantic } from '../utils/numberType'
import { monthOptions, yearOptions } from '../utils/optionSources'
import { localized } from '../utils/text'

interface Props {
  field: CalculatorInputValueField
  contractField: InputContractField
  label: string
  locale: Locale
  disabled: boolean
  error?: string
}

const SPANS: Record<CalculatorInputFieldSize, GridColumnProps['span']> = {
  small: ['6/12', '4/12', '6/12', '4/12'],
  medium: ['12/12', '6/12', '12/12', '8/12', '6/12'],
  large: ['12/12', '12/12', '12/12', '12/12', '8/12'],
}

export const CalculatorField = ({
  field,
  contractField,
  label,
  locale,
  disabled,
  error,
}: Props) => {
  const { control, getValues, setValue } = useFormContext()
  const { key, type, required, min, max, integer } = contractField
  const semantic = inputSemantic(contractField, field.numberType)
  const defaultValue = contractField.defaultValue?.toString()

  const limits = {
    min,
    allowNegative: min === undefined || min < 0,
    ...(integer && { decimalScale: 0 }),
  }

  useEffect(() => {
    if (defaultValue !== undefined && getValues(key) === undefined) {
      setValue(key, defaultValue)
    }
  }, [key, defaultValue, getValues, setValue])

  const placeholder = localized(field.placeholder, locale)

  const common = {
    id: field.uid,
    name: key,
    label,
    disabled,
    required,
    size: 'sm' as const,
    backgroundColor: 'white' as const,
    error,
  }

  /* `DatePickerController` takes no `control` prop -- it reads `useFormContext`
   * itself -- so the two spreads are deliberately different. */
  const select = { ...common, placeholder }
  const input = { ...common, control, placeholder }

  const renderControl = () => {
    switch (type) {
      case TaxCalculatorInputFieldType.Select:
        return (
          <SelectController
            {...select}
            options={(contractField.options ?? []).map((option) => ({
              label:
                (field.optionLabelsEnabled
                  ? localized(field.optionLabels?.[option], locale)
                  : undefined) ?? option,
              value: option,
            }))}
          />
        )

      case TaxCalculatorInputFieldType.Boolean:
        return (
          <Controller
            control={control}
            name={key}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                id={field.uid}
                name={key}
                label={label}
                checked={Boolean(value)}
                disabled={disabled}
                hasError={Boolean(error)}
                errorMessage={error}
                onChange={(event) => onChange(event.target.checked)}
              />
            )}
          />
        )

      case TaxCalculatorInputFieldType.Date:
        return <DatePickerController {...select} locale={locale} />

      case TaxCalculatorInputFieldType.String:
        return <InputController {...input} type="text" />

      case TaxCalculatorInputFieldType.Number:
        switch (semantic) {
          case TaxCalculatorInputFieldSemantic.Year:
            return (
              <SelectController {...select} options={yearOptions(min, max)} />
            )

          case TaxCalculatorInputFieldSemantic.Month:
            return (
              <SelectController {...select} options={monthOptions(locale)} />
            )

          case TaxCalculatorInputFieldSemantic.Currency:
            return (
              <InputController {...input} {...limits} type="number" currency />
            )

          case TaxCalculatorInputFieldSemantic.Percentage:
            return (
              <InputController
                {...input}
                {...limits}
                type="number"
                suffix="%"
              />
            )

          case TaxCalculatorInputFieldSemantic.Count:
          default:
            return <InputController {...input} {...limits} type="number" />
        }

      default: {
        const unhandled: never = type
        return unhandled
      }
    }
  }

  return <GridColumn span={SPANS[field.size]}>{renderControl()}</GridColumn>
}
