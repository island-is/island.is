import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { Text, Hidden, Box, Button } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'

interface Props {
  title?: string
}

const DetailHeader: FC<React.PropsWithChildren<Props>> = ({ title }) => {
  const { formatMessage } = useLocale()
  return (
    <Hidden print={true}>
      <Box marginBottom={4}>
        <Text variant="h3" marginBottom={5}>
          {title}
        </Text>

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
      </Box>
    </Hidden>
  )
}

export default DetailHeader
