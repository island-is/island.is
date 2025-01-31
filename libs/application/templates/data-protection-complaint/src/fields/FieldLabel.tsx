import { useLocale } from '@island.is/localization'
import { formatTextWithLocale } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { Locale } from '@island.is/shared/types'

export const FieldLabel: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
}) => {
  const { title = '' } = field
  const { formatMessage, lang: locale } = useLocale()

  return (
    <Text variant="h4" marginTop={3}>
      {formatTextWithLocale(
        title,
        application,
        locale as Locale,
        formatMessage,
      )}
    </Text>
  )
}
