import React, { FC } from 'react'
import { Box, Typography } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

interface Props {
  name: string | MessageDescriptor
}

const ModuleLoadingScreen: FC<Props> = ({ name }) => {
  const { formatMessage } = useLocale()

  return (
    <Box padding={8}>
      <Typography variant="h2" as="h2">
        {formatMessage({
          id: 'service.portal:fetching',
          defaultMessage: 'Sæki',
        })}
        {formatMessage(name)}
      </Typography>
    </Box>
  )
}

export default ModuleLoadingScreen
