import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
import { ReactIntlMessage } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'

interface Props {
  name: string | ReactIntlMessage
}

const ModuleLoadingScreen: FC<Props> = ({ name }) => {
  const { formatMessage } = useLocale()
  return (
    <Box padding={8}>
      <Typography variant="h2" as="h2">
        {formatMessage({
          id: 'sp:fetching',
          defaultMessage: 'Sæki',
        })}
        {formatMessage(name)}
      </Typography>
    </Box>
  )
}

export default ModuleLoadingScreen
