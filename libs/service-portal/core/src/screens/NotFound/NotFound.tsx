import React, { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { defineMessage, MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { useLocation } from 'react-router-dom'

interface Props {
  title?: string | MessageDescriptor
}

export const NotFound: FC<Props> = ({ title }) => {
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()

  return (
    <GridRow>
      <GridColumn span={['1/1', '10/12']} offset={['0', '1/12']}>
        <Box marginY={12} textAlign="center">
          <Text
            variant="eyebrow"
            as="div"
            marginBottom={2}
            color="purple400"
            fontWeight="semiBold"
          >
            404
          </Text>
          <Text variant="h1" as="h1" as="h1" marginBottom={3}>
            {formatMessage(
              title ||
                defineMessage({
                  id: 'service.portal:not-found',
                  defaultMessage: 'Síða finnst ekki',
                }),
            )}
          </Text>
          <Text variant="intro" as="p">
            {formatMessage(
              {
                id: 'service.portal:not-found-message',
                defaultMessage:
                  'Ekkert fannst á slóðinni {path}. Mögulega hefur síðan verið fjarlægð eða færð til',
              },
              {
                path: pathname,
              },
            )}
          </Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}
