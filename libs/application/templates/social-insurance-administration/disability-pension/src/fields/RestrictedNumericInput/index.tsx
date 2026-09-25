import { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { Application, Field } from '@island.is/application/types'
import { Box, Input } from '@island.is/island-ui/core'
import NumberFormat from 'react-number-format'
import { useLocale } from '@island.is/localization'
import { formatTextWithLocale } from '@island.is/application/core'
import { Locale } from '@island.is/shared/types'

interface RestrictedNumericInputProps {
  application: Application
  error?: string
  field: Field & {
    props?: {
      min?: number
      max?: number
      label?: string
      placeholder?: string
    }
  }
}

export const RestrictedNumericInput: FC<RestrictedNumericInputProps> = ({
  application,
  error,
  field,
}) => {
  const { id, props } = field
  const { min = 0, max = 100, label, placeholder } = props ?? {}
  const { clearErrors } = useFormContext()
  const { formatMessage, lang: locale } = useLocale()

  const formattedLabel = label
    ? formatTextWithLocale(label, application, locale as Locale, formatMessage)
    : undefined

  const formattedPlaceholder = placeholder
    ? formatTextWithLocale(
        placeholder,
        application,
        locale as Locale,
        formatMessage,
      )
    : undefined

  return (
    <Box>
      <Controller
        name={id}
        render={({ field: { onChange, value, name } }) => (
          <NumberFormat
            customInput={Input}
            id={id}
            name={name}
            label={formattedLabel}
            placeholder={formattedPlaceholder}
            value={value}
            hasError={error !== undefined}
            errorMessage={error}
            required
            isAllowed={(values) => {
              const { floatValue } = values
              if (floatValue === undefined) return true
              return floatValue >= min && floatValue <= max
            }}
            onValueChange={({ value: newValue }) => {
              if (error) {
                clearErrors(id)
              }
              onChange(newValue)
            }}
          />
        )}
      />
    </Box>
  )
}
