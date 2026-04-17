export interface InputProps {
  onBlur: (value: string) => void
  onChange?: (value: string) => void
  disabled?: boolean
  value?: string
  required?: boolean

  // Use `label` to overwrite the default label
  label?: string

  // Use `placeholder` to overwrite the default placeholder text
  placeholder?: string
}
