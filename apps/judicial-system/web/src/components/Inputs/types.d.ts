export interface InputProps {
  onChange: (value: string) => void
  onBlur: (value: string) => void
  disabled?: boolean
  value?: string

  // Use `label` to overwrite the default label
  label?: string

  // Use `placeholder` to overwrite the default placeholder text
  placeholder?: string
}
