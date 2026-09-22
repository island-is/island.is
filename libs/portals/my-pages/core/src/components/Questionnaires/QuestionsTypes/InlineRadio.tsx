import { Box, InputError, RadioButton } from '@island.is/island-ui/core'
import { FC } from 'react'

export interface InlineRadioOption {
  label: string
  value: string
  disabled?: boolean
}

export interface InlineRadioProps {
  id: string
  options: InlineRadioOption[]
  value?: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  labelledBy?: string
}

/** Two-option question laid out in a row - more options use `Radio` instead */
export const InlineRadio: FC<InlineRadioProps> = ({
  id,
  options,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  labelledBy,
}) => {
  const errorId = error ? `${id}-error` : undefined

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        columnGap={4}
        rowGap={2}
        role="radiogroup"
        aria-required={required}
        aria-invalid={error !== undefined}
        aria-describedby={errorId}
        aria-labelledby={labelledBy}
      >
        {options.map((option) => (
          <RadioButton
            key={option.value}
            id={`${id}-${option.value}`}
            name={id}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled || option.disabled}
            hasError={!!error}
          />
        ))}
      </Box>
      {error && <InputError id={errorId} errorMessage={error} />}
    </Box>
  )
}
