import { FormControl, Select } from '@contentful/f36-components'

import {
  type CalculatorNumberType,
  calculatorNumberTypes,
} from '@island.is/tax-calculators'

const numberTypeLabels: Record<CalculatorNumberType, string> = {
  currency: 'Currency',
  count: 'Count',
  year: 'Year',
  percentage: 'Percentage',
  plain: 'Plain number',
}

interface Props {
  fieldKey: string
  value?: CalculatorNumberType
  inferred?: string
  isDisabled?: boolean
  onChange: (numberType: CalculatorNumberType | undefined) => void
}

export const NumberTypeSelect = ({
  fieldKey,
  value,
  inferred,
  isDisabled,
  onChange,
}: Props) => (
  <FormControl marginBottom="none">
    <FormControl.Label>Number type</FormControl.Label>
    <Select
      aria-label={`Number type for ${fieldKey}`}
      value={value ?? ''}
      isDisabled={isDisabled}
      onChange={(ev) =>
        onChange(
          calculatorNumberTypes.find((option) => option === ev.target.value),
        )
      }
    >
      <Select.Option value="">{`Default (${
        inferred
          ? inferred.charAt(0) + inferred.slice(1).toLowerCase()
          : numberTypeLabels.plain
      })`}</Select.Option>
      {calculatorNumberTypes.map((option) => (
        <Select.Option key={option} value={option}>
          {numberTypeLabels[option]}
        </Select.Option>
      ))}
    </Select>
  </FormControl>
)
