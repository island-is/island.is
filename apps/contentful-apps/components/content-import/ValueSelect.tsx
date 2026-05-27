import { FormControl, Select } from '@contentful/f36-components'

interface ValueSelectProps {
  selectedValue: string | null
  setSelectedValue: (value: string) => void
  options: { label: string; value: string }[]
  disabled?: boolean
  label: string
}

export const ValueSelect = ({
  selectedValue,
  setSelectedValue,
  options,
  disabled = false,
  label,
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
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  )
}
