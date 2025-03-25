import React, { FC, useMemo } from 'react'

import { buildFieldItems, formatText } from '@island.is/application/core'
import { Application, InformationCardField } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'

export const InformationCardFormField: FC<
  React.PropsWithChildren<{
    field: InformationCardField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage, lang: locale } = useLocale()
  const { items } = field

  const finalItems = useMemo(
    () => buildFieldItems(items, application, field, locale),
    [items, application, locale],
  )

  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderWidth="standard"
      paddingY={field.paddingY}
      paddingX={field.paddingX}
    >
      {finalItems.map((item) => {
        return (
          <Box display="flex" key={`item-key-${item.value}`}>
            <Text fontWeight="semiBold">
              {formatText(item.label, application, formatMessage)}
              &nbsp;
            </Text>
            <Box>
              <Markdown>
                {(formatText(
                  item.value,
                  application,
                  formatMessage,
                ) as string) ?? ''}
              </Markdown>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
