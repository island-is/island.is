import { Controller, useFormContext } from 'react-hook-form'

import { Checkbox, GridColumn } from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorInputSectionField } from '@island.is/tax-calculators'
import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '@island.is/web/graphql/schema'

import type { InputContractField } from '../contract'
import { monthOptions, yearOptions } from '../utils/optionSources'
import { localized } from '../utils/text'

interface Props {
  field: CalculatorInputSectionField
  contractField: InputContractField
  label: string
  locale: Locale
  disabled: boolean
  error?: string
}

/* `span` is a number 1-12 in the config, but GridColumn takes the fraction as a
 * string literal, so the two are bridged by position rather than interpolation. */
const TWELFTHS = [
  '1/12',
  '2/12',
  '3/12',
  '4/12',
  '5/12',
  '6/12',
  '7/12',
  '8/12',
  '9/12',
  '10/12',
  '11/12',
  '12/12',
] as const

export const CalculatorField = ({
  field,
  contractField,
  label,
  locale,
  disabled,
  error,
}: Props) => {
  const { control } = useFormContext()
  const { key, type, semantic, required } = contractField

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
              label: option,
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
            return <SelectController {...select} options={yearOptions()} />

          case TaxCalculatorInputFieldSemantic.Month:
            return (
              <SelectController {...select} options={monthOptions(locale)} />
            )

          case TaxCalculatorInputFieldSemantic.Currency:
            return <InputController {...input} type="number" currency />

          case TaxCalculatorInputFieldSemantic.Percentage:
            /* Percentage values use whole percents. */
            return (
              <InputController
                {...input}
                type="number"
                suffix="%"
                min={0}
                max={100}
                allowNegative={false}
              />
            )

          /* NumberFormat enforces whole, non-negative count values. */
          case TaxCalculatorInputFieldSemantic.Count:
            return (
              <InputController
                {...input}
                type="number"
                min={0}
                decimalScale={0}
                allowNegative={false}
              />
            )

          default:
            return <InputController {...input} type="number" />
        }

      default: {
        const unhandled: never = type
        return unhandled
      }
    }
  }

  return (
    <GridColumn span={['1/1', '1/1', TWELFTHS[field.span - 1] ?? '12/12']}>
      {renderControl()}
    </GridColumn>
  )
}
