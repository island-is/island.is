import { FieldBaseProps, formatText } from '@island.is/application/core'
import { ResponsiveSpace, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'

type Props = FieldBaseProps & {
  field: {
    props: {
      marginTop?: ResponsiveSpace
      marginBottom?: ResponsiveSpace
      required?: boolean
    }
  }
}

export const FieldTitle = ({ field, application }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Text
        variant="h2"
        marginTop={field.props.marginTop || 0}
        marginBottom={field.props.marginBottom || 0}
      >
        {formatText(field.title, application, formatMessage)}
        {field.props.required && (
          <Text variant="h2" color="red400" as="span">
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
