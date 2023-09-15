import * as kennitala from 'kennitala'
import React from 'react'
import { useIntl } from 'react-intl'

import { SessionsSession } from '@island.is/api/schema'
import { useAuth } from '@island.is/auth/react'
import { Box, Icon, Table, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'
import { SessionType } from '../../lib/types/sessionTypes'
import { getSessionType } from '../../utils/utils'
import * as styles from '../LogTable/LogTable.css'
import Person from '../PersonIcon/PersonIcon'
import { Client } from '../Client/Client'
import { getCountryByCode, Country } from '@island.is/shared/utils'

interface LogTableProps {
  data: SessionsSession[]
}
const LogTable: React.FC<React.PropsWithChildren<LogTableProps>> = ({
  data,
}) => {
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const { formatDate, formatTime } = useIntl()

  return (
    <Table.Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadData>{formatMessage(m.date)}</Table.HeadData>
          <Table.HeadData>
            <Box
              display={'flex'}
              textAlign={'center'}
              columnGap={'smallGutter'}
            >
              {formatMessage(m.geolocation)}{' '}
              <Tooltip
                placement="right"
                as="button"
                text={formatMessage(m.geoInfoDesc)}
              />
            </Box>
          </Table.HeadData>
          <Table.HeadData>{formatMessage(m.client)}</Table.HeadData>
          <Table.HeadData>{formatMessage(m.person)}</Table.HeadData>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.map((session: SessionsSession) => {
          const type = getSessionType(
            session,
            userInfo?.profile.nationalId ?? '',
          )
          const country = getCountryByCode(session?.ipLocation ?? '') as Country

          return (
            <Table.Row key={session.id}>
              <Table.Data>
                <div>
                  {formatDate(session.timestamp, { dateStyle: 'medium' })}
                </div>
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
                  {formatTime(session.timestamp, { timeStyle: 'short' })}
                </Box>
              </Table.Data>
              <Table.Data>
                <div className={styles.textEllipsis}>{session.device}</div>
                {!session.ipLocation && <div>{session.ip}</div>}
                {session.ipLocation && (
                  <Tooltip
                    text={formatMessage(m.ipLocation) + ' ' + session.ip}
                  >
                    <div style={{ width: 'fit-content' }}>
                      {country?.name ?? session.ipLocation}
                    </div>
                  </Tooltip>
                )}
              </Table.Data>
              <Table.Data>
                <Client client={session.client} />
              </Table.Data>
              <Table.Data>
                <Box display="flex" alignItems="center" columnGap="gutter">
                  <Person sessionType={type} />

                  <Box className={styles.fitContent}>
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
