import React, { FC } from 'react'
import { Box, Divider, Icon, Text } from '@island.is/island-ui/core'
import Person from '../PersonIcon/PersonIcon'
import * as styles from '../LogTable/LogTable.css'
import { SessionsSession } from '@island.is/api/schema'
import { formatNationalId, getSessionType } from '../../utils/utils'
import { useAuth } from '@island.is/auth/react'
import { SessionType } from '../../lib/types/sessionTypes'
import { formatDate, getTime } from '@island.is/shared/utils'
import { dateFormat } from '@island.is/shared/constants'

interface LogTableProps {
  sessions: SessionsSession[]
}

const ExpandedDivider = () => (
  <div className={styles.divider}>
    <Divider />
  </div>
)

const LogTableMobile: FC<LogTableProps> = ({ sessions }) => {
  const { userInfo } = useAuth()
  return (
    <>
      {sessions.map((session: SessionsSession, index: number) => {
        const type = getSessionType(session, userInfo?.profile.nationalId ?? '')
        const formattedDate = new Date(+session.timestamp).toUTCString()

        return (
          <div style={{ width: '100%' }} key={index}>
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
                <Text as="h5" variant="h5">
                  {session.client.name || 'Óþekkt'}
                </Text>
                <Box>
                  <Text variant="small">
                    {formatDate(formattedDate, dateFormat.is)}
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
                    <Text variant="small">{getTime(formattedDate)}</Text>
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
                      {formatNationalId(
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
