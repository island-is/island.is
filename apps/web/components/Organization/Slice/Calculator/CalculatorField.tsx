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

import type { InputContractField } from './contract'
import { monthOptions, yearOptions } from './optionSources'
import { localized } from './text'

interface Props {
  field: CalculatorInputSectionField
  contractField: InputContractField
  /* Resolved by the section, which drops the field outright when the editor
   * authored no label -- so this component never has to represent that case. */
  label: string
  locale: Locale
  disabled: boolean
  /* A domain validation error keyed to this field. Not react-hook-form's own
   * error state: this is an answer from RSK, not a validation result, so it is
   * passed in rather than read off the form. */
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

  /* Two stages: the field's `type` picks the control, and `semantic` -- which
   * only number fields carry -- refines it. Extracted from the return so the
   * `never` guard closing the switch survives. */
  const renderControl = () => {
    switch (type) {
      case TaxCalculatorInputFieldType.Select:
        return (
          <SelectController
            {...select}
            /* Raw identifiers -- `configJson` has nowhere to author option text. */
            options={(contractField.options ?? []).map((option) => ({
              label: option,
              value: option,
            }))}
          />
        )

      case TaxCalculatorInputFieldType.Boolean:
        /* Not a CheckboxController: that one holds a string[], which no boolean
         * `dependsOn` could ever match. */
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
            /* Whole percent by contract, in both directions. The client's
             * mappers convert to and from RSK's 0-1 ratio; nothing above them
             * scales. */
            return (
              <InputController
                {...input}
                type="number"
                suffix="%"
                min={0}
                max={100}
              />
            )

          /* The domain rejects a fractional or negative count outright, so the
           * control does not offer one. `decimalScale` rather than `step`:
           * `type="number"` routes through NumberFormat, which ignores `step`
           * and enforces `min` through `isAllowed`. */
          case TaxCalculatorInputFieldSemantic.Count:
            return (
              <InputController
                {...input}
                type="number"
                min={0}
                decimalScale={0}
              />
            )

          /* A number with no semantic is the commonest field of all, so the
           * fallback is spelled out rather than left to fall through. */
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
