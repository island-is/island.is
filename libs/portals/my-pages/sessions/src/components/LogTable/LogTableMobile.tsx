import * as kennitala from 'kennitala'
import { useIntl } from 'react-intl'

import { SessionsSession } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { Box, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ExpandHeader, ExpandRow } from '@island.is/portals/my-pages/core'
import { Country, getCountryByCode } from '@island.is/shared/utils'

import { SessionType } from '../../lib/types/sessionTypes'
import { getSessionType } from '../../utils/utils'
import Person from '../PersonIcon/PersonIcon'
import * as styles from '../LogTable/LogTable.css'
import { Client } from '../Client/Client'
import { m } from '../../lib/messages'

interface LogTableProps {
  sessions: SessionsSession[]
}

const LogTableMobile = ({ sessions }: LogTableProps) => {
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const { formatDate, formatTime } = useIntl()

  return (
    <Box className={styles.tableContainer}>
      <T.Table>
        <ExpandHeader
          data={[
            { value: '' },
            {
              value: formatMessage(m.client),
            },
            {
              value: formatMessage(m.date),
              align: 'left',
            },
          ]}
        />
        <T.Body>
          {sessions.map((session: SessionsSession) => {
            const type = getSessionType(
              session,
              userInfo?.profile.nationalId ?? '',
            )

            return (
              <ExpandRow
                data={[
                  {
                    value: <Client client={session.client} />,
                  },
                  {
                    value: (
                      <Box>
                        <Text variant="small">
                          {formatDate(session.timestamp, {
                            dateStyle: 'medium',
                          })}
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
                            {formatTime(session.timestamp, {
                              timeStyle: 'short',
                            })}
                          </Text>
                        </Box>
                      </Box>
                    ),
                  },
                ]}
              >
                <Box>
                  <T.Table>
                    <T.Head>
                      <T.Row>
                        <T.HeadData>{formatMessage(m.device)}</T.HeadData>
                        <T.HeadData>{formatMessage(m.person)}</T.HeadData>
                      </T.Row>
                    </T.Head>
                    <T.Body>
                      <T.Row>
                        <T.Data>
                          <div className={styles.textEllipsis}>
                            {session.device}
                          </div>
                          {!session.ipLocation && (
                            <Text variant="small">{session.ip}</Text>
                          )}
                          {session.ipLocation && (
                            <Text variant="small">
                              {(
                                getCountryByCode(
                                  session?.ipLocation ?? '',
                                ) as Country
                              )?.name ?? session.ipLocation}{' '}
                              {`(${session.ip})`}
                            </Text>
                          )}
                        </T.Data>
                        <T.Data>
                          <Box
                            display="flex"
                            alignItems="center"
                            columnGap="gutter"
                          >
                            <Box justifyContent="flexStart">
                              <Person sessionType={type} />
                            </Box>
                            <Box>
                              <Text variant="eyebrow">
                                {type === SessionType.myBehalf ||
                                type === SessionType.company
                                  ? session.actor.name
                                  : session.subject.name}
                              </Text>
                              <Text variant="small">
                                {kennitala.format(
                                  type === SessionType.myBehalf ||
                                    type === SessionType.company
                                    ? session.actor.nationalId
                                    : session.subject.nationalId,
                                )}
                              </Text>
                            </Box>
                          </Box>
                        </T.Data>
                      </T.Row>
                    </T.Body>
                  </T.Table>
                </Box>
              </ExpandRow>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default LogTableMobile
