import React from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { ResponsiveSpace, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

type Props = FieldBaseProps & {
  field: {
    props: {
      marginTop?: ResponsiveSpace
    }
  }
}

export const FieldTitle = ({ field, application }: Props) => {
  const { formatMessage } = useLocale()
  return (
    <>
      <Text variant="h5" marginTop={field.props.marginTop || 0}>
        {formatText(field.title, application, formatMessage)}
      </Text>
      {field.description && (
        <Text>{formatText(field.description, application, formatMessage)}</Text>
      )}
    </>
  )
}
