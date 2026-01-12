import { formatTextWithLocale } from '@island.is/application/core'
import { DisplayField, FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: DisplayField
}

export const DisplayFormField = ({ field, application }: Props) => {
  const {
    value,
    id,
    title,
    titleVariant = 'h4',
    label,
    variant,
    suffix,
    rightAlign = false,
    halfWidthOwnline = false,
    clearOnChange,
    clearOnChangeDefaultValue,
  } = field
  const { watch, setValue } = useFormContext()
  const allValues = watch()
  const { formatMessage, lang: locale } = useLocale()
  const [displayValue, setDisplayValue] = useState(allValues[id])

  useEffect(() => {
    const newDisplayValue = value(allValues, application.externalData)
    if (newDisplayValue !== displayValue) {
      setDisplayValue(newDisplayValue)
      setValue(id, newDisplayValue)
    }
  }, [allValues])

  return (
    <Box
      paddingY={3}
      display="flex"
      flexDirection="column"
      alignItems={halfWidthOwnline ? 'flexEnd' : undefined}
      marginTop={field.marginTop}
      marginBottom={field.marginBottom}
    >
      <Box
        width={halfWidthOwnline ? 'half' : 'full'}
        paddingLeft={halfWidthOwnline ? 'p2' : undefined}
      >
        {title ? (
          <Text variant={titleVariant} paddingBottom={1}>
            {formatTextWithLocale(
              title,
              application,
              locale as Locale,
              formatMessage,
            )}
          </Text>
        ) : null}

        <InputController
          id={id}
          name={id}
          label={
            label &&
            formatTextWithLocale(
              label,
              application,
              locale as Locale,
              formatMessage,
            )
          }
          rightAlign={rightAlign}
          readOnly
          backgroundColor="blue"
          currency={variant === 'currency'}
          suffix={
            suffix &&
            formatTextWithLocale(
              suffix,
              application,
              locale as Locale,
              formatMessage,
            )
          }
          type={
            variant === 'currency' || variant === 'textarea'
              ? undefined
              : variant
          }
          clearOnChange={clearOnChange}
          clearOnChangeDefaultValue={clearOnChangeDefaultValue}
        />
      </Box>
    </Box>
  )
}
