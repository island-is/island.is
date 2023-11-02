import * as kennitala from 'kennitala'
import { FC } from 'react'
import { useIntl } from 'react-intl'

import { SessionsSession } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { Box, Divider, Icon, Text } from '@island.is/island-ui/core'

import { SessionType } from '../../lib/types/sessionTypes'
import { getSessionType } from '../../utils/utils'
import Person from '../PersonIcon/PersonIcon'

import * as styles from '../LogTable/LogTable.css'
import { Client } from '../Client/Client'

interface LogTableProps {
  sessions: SessionsSession[]
}

const ExpandedDivider = () => (
  <div className={styles.divider}>
    <Divider />
  </div>
)

const LogTableMobile: FC<React.PropsWithChildren<LogTableProps>> = ({
  sessions,
}) => {
  const { userInfo } = useAuth()
  const { formatDate, formatTime } = useIntl()

  return (
    <>
      {sessions.map((session: SessionsSession) => {
        const type = getSessionType(session, userInfo?.profile.nationalId ?? '')

        return (
          <div style={{ width: '100%' }} key={session.id}>
            <ExpandedDivider />
            <Box
              paddingY={3}
              display={'flex'}
              flexDirection={'column'}
              rowGap={'gutter'}
            >
              <Box
                display="flex"
                justifyContent="spaceBetween"
                alignItems="center"
              >
                <Client client={session.client} />
                <Box>
                  <Text variant="small">
                    {formatDate(session.timestamp, { dateStyle: 'medium' })}
                  </Text>
                  <Box
                    alignItems="center"
                    display="flex"
                    columnGap={'smallGutter'}
                  >
                    <Icon
                      icon="time"
                      size="small"
                      type="outline"
                      color="blue400"
                    />
                    <Text variant="small">
                      {formatTime(session.timestamp, { timeStyle: 'short' })}
                    </Text>
                  </Box>
                </Box>
              </Box>
              {type !== SessionType.self && (
                <Box display="flex" alignItems="center" columnGap="gutter">
                  <Box justifyContent="flexStart">
                    <Person sessionType={type} />
                  </Box>
                  <Box>
                    <Text variant="h5">
                      {type === SessionType.myBehalf ||
                      type === SessionType.company
                        ? session.actor.name
                        : session.subject.name}
                    </Text>
                    <Text>
                      {kennitala.format(
                        type === SessionType.myBehalf ||
                          type === SessionType.company
                          ? session.actor.nationalId
                          : session.subject.nationalId,
                      )}
                    </Text>
                  </Box>
                </Box>
              )}
            </Box>
          </div>
        )
      })}
      <ExpandedDivider />
    </>
  )
}

export default LogTableMobile
