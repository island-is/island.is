import React, { FC } from 'react'

import { formatText } from '@island.is/application/core'
import { Application, InformationCardField } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const InformationCardFormField: FC<
  React.PropsWithChildren<{
    field: InformationCardField
    application: Application
  }>
> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderWidth="standard"
      paddingY={field.paddingY}
      paddingX={field.paddingX}
    >
      {field.items.map((item) => {
        return (
          <Box display="flex">
            <Text fontWeight="semiBold">
              {formatText(item.label, application, formatMessage)}
            </Text>
            <Text>{formatText(item.value, application, formatMessage)}</Text>
          </Box>
        )
      })}
    </Box>
  )
}
