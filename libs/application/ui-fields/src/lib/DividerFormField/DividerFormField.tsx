import React, { FC } from 'react'

import { formatTextWithLocale } from '@island.is/application/core'
import { DividerField, Application } from '@island.is/application/types'
import { Box, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'

export const DividerFormField: FC<
  React.PropsWithChildren<{
    field: DividerField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage, lang: locale } = useLocale()
  if (field.title) {
    return (
      <Box marginTop={5} marginBottom={1}>
        <Text variant="h5" color={field.color ?? 'blue400'}>
          {formatTextWithLocale(
            field.title,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      </Box>
    )
  }

  return (
    <Box paddingTop={2} paddingBottom={2}>
      <Divider />
    </Box>
  )
}
