import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import {
  Text,
  Hidden,
  Column,
  Columns,
  Box,
  Button,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'

interface Props {
  title?: string
}

const DetailHeader: FC<Props> = ({ title }) => {
  const { formatMessage } = useLocale()
  return (
    <Hidden print={true}>
      <Box marginBottom={3}>
        <Columns alignY="center" space="auto">
          <Column>
            <Text variant="h3">{title}</Text>
          </Column>
          <Column width="content">
            <Button
              colorScheme="default"
              icon="print"
              iconType="filled"
              onClick={() => window.print()}
              preTextIconType="filled"
              size="default"
              type="button"
              variant="utility"
            >
              {formatMessage(m.print)}
            </Button>
          </Column>
        </Columns>
      </Box>
    </Hidden>
  )
}

export default DetailHeader
