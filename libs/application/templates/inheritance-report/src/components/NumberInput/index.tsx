import { Input } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { valueToNumber } from '../../lib/utils/helpers'

interface NumberInputProps {
  name: string
  placeholder?: string
  label?: string
  errorMessage?: string
  onAfterChange?: (value: number) => void
  disabled?: boolean
  required?: boolean
}

const numberInputRegex = new RegExp(/^\d+(,\d*)?$/)

export const NumberInput = ({
  name,
  placeholder,
  label,
  errorMessage,
  onAfterChange,
  disabled,
  required,
}: NumberInputProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={'0'}
      render={({ field: { onChange, value, name } }) => (
        <Input
          label={label}
          placeholder={placeholder}
          id={name}
          name={name}
          backgroundColor="blue"
          value={`${(value || '0')?.replace('.', ',')}`}
          onBlur={(e) => {
            const val = e.target.value ?? ''
            if (val.endsWith(',')) {
              const newVal = val.replace(',', '')
              onChange(newVal)
            }
          }}
          onChange={(e) => {
            e.preventDefault()

            let val = e.target.value || ''

            const len = val.length ?? 0

            if (len > 1 && val[1] !== ',' && val.startsWith('0')) {
              val = val.substring(1)
            }

            const validInput = numberInputRegex.test(val)
            const numberValue = valueToNumber(val, ',')

            if (val === '') {
              onChange('0')
              return onAfterChange?.(numberValue)
            }

            if (validInput) {
              onChange(val.replace(',', '.'))
              return onAfterChange?.(numberValue)
            }
          }}
          hasError={!!errorMessage}
          errorMessage={errorMessage}
          disabled={disabled}
          required={required}
        />
      )}
    />
  )
}

export default NumberInput
