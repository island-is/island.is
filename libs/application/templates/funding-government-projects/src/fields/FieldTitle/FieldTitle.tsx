import React from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, ResponsiveSpace, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

type Props = FieldBaseProps & {
  field: {
    props: {
      marginTop?: ResponsiveSpace
      required?: boolean
    }
  }
}

export const FieldTitle = ({ field, application }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Text
        variant="h4"
        marginTop={field.props.marginTop || 0}
        marginBottom={field.description ? 1 : 0}
      >
        {formatText(field.title, application, formatMessage)}
        {field.props.required && (
          <Text variant="h4" color="red400" as="span">
            {' *'}
          </Text>
        )}
      </Text>
      {field.description && (
        <Text>{formatText(field.description, application, formatMessage)}</Text>
      )}
    </>
  )
}
