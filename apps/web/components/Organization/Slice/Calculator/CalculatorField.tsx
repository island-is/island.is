import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { Checkbox } from '@island.is/island-ui/core'
import {
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorLocalizedText,
  CalculatorSectionField,
} from '@island.is/tax-calculators'
import {
  TaxCalculatorField,
  TaxCalculatorFieldInputType,
} from '@island.is/web/graphql/schema'

import { monthOptions, yearOptions } from './optionSources'
import { localized } from './text'

interface Props {
  field: CalculatorSectionField
  contractField: TaxCalculatorField
  locale: Locale
  disabled: boolean
}

export const CalculatorField = ({
  field,
  contractField,
  locale,
  disabled,
}: Props) => {
  const { control } = useFormContext()
  const { dependsOn, key, inputType, required } = contractField

  /* Hooks cannot be conditional, so this always runs: an empty name matches no
   * registered field and yields undefined, which no dependency ever equals. */
  const dependencyValue = useWatch({ control, name: dependsOn?.field ?? '' })

  if (dependsOn && dependencyValue !== dependsOn.equals) return null

  const label = localized(field.label, locale) ?? key
  const placeholder = localized(field.placeholder, locale)

  const common = {
    id: field.uid,
    name: key,
    label,
    disabled,
    required,
    size: 'sm' as const,
    backgroundColor: 'white' as const,
  }

  const select = { ...common, placeholder }
  const input = { ...common, control, placeholder }

  switch (inputType) {
    case TaxCalculatorFieldInputType.Year:
      return <SelectController {...select} options={yearOptions()} />

    case TaxCalculatorFieldInputType.Month:
      return <SelectController {...select} options={monthOptions(locale)} />

    case TaxCalculatorFieldInputType.Enum:
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

    case TaxCalculatorFieldInputType.Boolean:
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
              onChange={(event) => onChange(event.target.checked)}
            />
          )}
        />
      )

    case TaxCalculatorFieldInputType.Date:
      return <DatePickerController {...select} locale={locale} />

    case TaxCalculatorFieldInputType.Currency:
      return <InputController {...input} type="number" currency />

    case TaxCalculatorFieldInputType.Percentage:
      return <InputController {...input} type="number" suffix="%" />

    case TaxCalculatorFieldInputType.Count:
    case TaxCalculatorFieldInputType.Number:
      return <InputController {...input} type="number" />

    case TaxCalculatorFieldInputType.String:
      return <InputController {...input} type="text" />
  }
}
