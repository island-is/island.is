import { FormControl, Select } from '@contentful/f36-components'

interface ValueSelectProps {
  selectedValue: string | null
  setSelectedValue: (value: string) => void
  options: { label: string; value: string }[]
  disabled?: boolean
  label: string
  placeholder?: string
}

export const ValueSelect = ({
  selectedValue,
  setSelectedValue,
  options,
  disabled = false,
  label,
  placeholder,
}: ValueSelectProps) => {
  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <Select
        id="value-select"
        name="value-select"
        value={selectedValue}
        onChange={(ev) => {
          setSelectedValue(ev.target.value)
        }}
        isDisabled={disabled}
      >
        {Boolean(placeholder) && (
          <Select.Option value="">{placeholder}</Select.Option>
        )}
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  )
}
