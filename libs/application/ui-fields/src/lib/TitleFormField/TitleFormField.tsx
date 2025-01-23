import React, { FC } from 'react'

import { formatTextWithLocale } from '@island.is/application/core'
import { TitleField, Application } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'

export const TitleFormField: FC<
  React.PropsWithChildren<{
    field: TitleField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage, lang: locale } = useLocale()
  const {
    title = '',
    titleVariant = 'h5',
    color = 'dark400',
    marginTop = 5,
    marginBottom = 1,
  } = field

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <Text variant={titleVariant} color={color}>
        {formatTextWithLocale(
          title,
          application,
          locale as Locale,
          formatMessage,
        )}
      </Text>
    </Box>
  )
}
