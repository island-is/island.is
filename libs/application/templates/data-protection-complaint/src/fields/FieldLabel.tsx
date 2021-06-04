import { useLocale } from '@island.is/localization'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'

export const FieldLabel: FC<FieldBaseProps> = ({ application, field }) => {
  const { title } = field
  const { formatMessage } = useLocale()

  return (
    <Text variant="h4" marginTop={3}>
      {formatText(title, application, formatMessage)}
    </Text>
  )
}
