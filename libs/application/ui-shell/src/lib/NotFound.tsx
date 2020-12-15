import React, { FC } from 'react'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { defineMessage } from 'react-intl'
import { useLocale } from '@island.is/localization'
import { StaticText } from '@island.is/application/core'

interface Props {
  title?: StaticText
  subTitle?: StaticText
}

export const NotFound: FC<Props> = ({ title, subTitle }) => {
  const { formatMessage } = useLocale()

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
          <Text variant="h1" as="h1" marginBottom={3}>
            {formatMessage(
              title ||
                defineMessage({
                  id: 'application.system:not-found',
                  defaultMessage: 'Umsókn finnst ekki',
                }),
            )}
          </Text>
          <Text variant="intro" as="p">
            {formatMessage(
              subTitle || {
                id: 'application.system:not-found-message',
                defaultMessage: 'Engin umsókn fannst á þessari slóð.',
              },
            )}
          </Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}
