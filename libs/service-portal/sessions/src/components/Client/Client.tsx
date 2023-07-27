import { SessionsSession } from '@island.is/api/schema'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'

import { m } from '../../lib/messages'

import * as styles from '../LogTable/LogTable.css'
import { useWindowSize } from 'react-use'

interface ClientProps {
  client: SessionsSession['client']
}

export const Client = ({ client }: ClientProps) => {
  const { width } = useWindowSize()
  const { formatMessage } = useLocale()
  return (
    <>
      {client.clientName && (
        <Box display={'flex'} columnGap={1} alignItems={'center'}>
          <Tooltip text={client.domain?.displayName}>
            <Box
              className={styles.logo}
              style={{
                backgroundImage: `url(${client.domain?.organisationLogoUrl})`,
              }}
            ></Box>
          </Tooltip>
          <Text variant={width > theme.breakpoints.lg ? 'eyebrow' : 'h5'}>
            {client.clientName}
          </Text>
        </Box>
      )}
      {!client.clientName && (
        <Tooltip text={client.clientId}>
          <Text variant="small">{formatMessage(m.clientUnknown)}</Text>
        </Tooltip>
      )}
    </>
  )
}
