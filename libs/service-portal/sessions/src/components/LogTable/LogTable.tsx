import { Box, Icon, Table, Text } from '@island.is/island-ui/core'
import React from 'react'
import Person from '../PersonIcon/PersonIcon'
import { SessionsSession } from '@island.is/api/schema'
import { getSessionType } from '../../utils/utils'
import { useAuth } from '@island.is/auth/react'
import { dateFormat, timeFormat } from '@island.is/shared/constants'

import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { SessionType } from '../../lib/types/sessionTypes'
import * as styles from '../LogTable/LogTable.css'
import * as kennitala from 'kennitala'

interface LogTableProps {
  data: SessionsSession[]
}
const LogTable: React.FC<LogTableProps> = ({ data }) => {
  const { userInfo } = useAuth()
  const { formatMessage, formatDateFns } = useLocale()

  return (
    <Table.Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadData>{formatMessage(m.date)}</Table.HeadData>
          <Table.HeadData>{formatMessage(m.geolocation)}</Table.HeadData>
          <Table.HeadData>{formatMessage(m.client)}</Table.HeadData>
          <Table.HeadData>{formatMessage(m.person)}</Table.HeadData>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.map((session: SessionsSession, index: number) => {
          const type = getSessionType(
            session,
            userInfo?.profile.nationalId ?? '',
          )

          return (
            <Table.Row key={index}>
              <Table.Data>
                <div>{formatDateFns(session.timestamp, dateFormat.is)}</div>
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
                  {formatDateFns(session.timestamp, timeFormat.is)}
                </Box>
              </Table.Data>
              <Table.Data>
                <Box>
                  <div className={styles.textEllipsis}>{session.userAgent}</div>
                  <div>{session.ip}</div>
                </Box>
              </Table.Data>
              <Table.Data>
                <Box display={'flex'} columnGap={1} alignItems={'center'}>
                  <Box
                    className={styles.logo}
                    style={{
                      backgroundImage: `url(${session.client.domain?.organisationLogoUrl})`,
                    }}
                  ></Box>
                  <Text variant="eyebrow">{session.client.clientName}</Text>
                </Box>
              </Table.Data>
              <Table.Data>
                <Box display="flex" alignItems="center" columnGap="gutter">
                  <Person sessionType={type} />

                  <Box style={{ minWidth: 'fit-content' }}>
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
              </Table.Data>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Table>
  )
}

export default React.memo(LogTable)
