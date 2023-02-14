import { SessionsSession } from '@island.is/api/schema'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

import * as styles from '../LogTable/LogTable.css'

interface ClientProps {
  client: SessionsSession['client']
}

export const Client = ({ client }: ClientProps) => {
  const { formatMessage } = useLocale()

  return (
    <>
      {client.clientName && (
        <Box display={'flex'} columnGap={1} alignItems={'center'}>
          <Box
            className={styles.logo}
            style={{
              backgroundImage: `url(${client.domain?.organisationLogoUrl})`,
            }}
          ></Box>
          <Text as="h5" variant="h5">
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
