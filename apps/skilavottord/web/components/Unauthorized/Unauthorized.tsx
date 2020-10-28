import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'

export const Unauthorized: FC = () => {
  const {
    t: { unauthorized: t },
  } = useI18n()

  return (
    <Box textAlign="center" margin={20}>
      <Text variant="h4">{t.message}</Text>
    </Box>
  )
}

export default Unauthorized
