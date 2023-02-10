import {
  Box,
  Icon,
  SkeletonLoader,
  Table,
  Text,
} from '@island.is/island-ui/core'
import React from 'react'
import Person from '../PersonIcon/PersonIcon'
import { SessionsSession } from '@island.is/api/schema'
import { formatNationalId, getSessionType } from '../../utils/utils'
import { useAuth } from '@island.is/auth/react'
import { dateFormat } from '@island.is/shared/constants'
import {
  formatDate,
  getOrganizationLogoUrl,
  getTime,
} from '@island.is/shared/utils'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { SessionType } from '../../lib/types/sessionTypes'
import * as styles from '../LogTable/LogTable.css'

interface LogTableProps {
  data: SessionsSession[]
}
const LogTable: React.FC<LogTableProps> = ({ data }) => {
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()

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

          const formattedDate = new Date(+session.timestamp).toUTCString()

          return (
            <Table.Row key={index}>
              <Table.Data>
                <div>{formatDate(formattedDate, dateFormat.is).toString()}</div>
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
                  {getTime(new Date(formattedDate).toString())}
                </Box>
              </Table.Data>
              <Table.Data>
                <Box>
                  <div className={styles.textEllipsis}>{session.userAgent}</div>
                  <div>{session.ip}</div>
                </Box>
              </Table.Data>
              <Table.Data>
                <Text variant="eyebrow">{session.client.name || 'Óþekkt'}</Text>
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
                      {formatNationalId(
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
