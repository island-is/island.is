import {
  Box,
  Icon,
  Text,
  Table,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import React from 'react'
import Person from '../PersonIcon/PersonIcon'
import { SessionsSession } from '@island.is/api/schema'
import { formatNationalId, getSessionType } from '../../utils/utils'
import { useAuth } from '@island.is/auth/react'
import { dateFormat } from '@island.is/shared/constants'
import { formatDate, getTime } from '@island.is/shared/utils'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface LogTableProps {
  data: SessionsSession[]
  loading: boolean
}
const LogTable: React.FC<LogTableProps> = ({ data, loading }) => {
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
      {!loading ? (
        <Table.Body>
          {[...data, ...data].map((session: SessionsSession, index: number) => {
            const type = getSessionType(
              session,
              userInfo?.profile.nationalId ?? '',
            )

            return (
              <Table.Row key={index}>
                <Table.Data>
                  <div>
                    {formatDate(session.timestamp, dateFormat.is).toString()}
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
                    {getTime(session.timestamp)}
                  </Box>
                </Table.Data>
                <Table.Data>
                  <div>{session.userAgent.split(';')[0] + ')'}</div>
                  <div>{session.ipLocation}</div>
                </Table.Data>
                <Table.Data>
                  <Text variant="eyebrow">
                    {session.client.name || 'Landsspítalaappið'}
                  </Text>
                </Table.Data>
                <Table.Data>
                  <Box display="flex" alignItems="center" columnGap="gutter">
                    <Box justifyContent={'flexStart'}>
                      <Person sessionType={type} />
                    </Box>
                    <Box style={{ minWidth: 'fit-content' }}>
                      <Text variant="eyebrow">{session.actor.name}</Text>
                      <Text variant="small">
                        {formatNationalId(session.actor.nationalId)}
                      </Text>
                    </Box>
                  </Box>
                </Table.Data>
              </Table.Row>
            )
          })}
        </Table.Body>
      ) : (
        <Skeleton />
      )}
    </Table.Table>
  )
}

const Skeleton = () => (
  <Table.Body>
    {new Array(10).fill('').map((_, index) => {
      return (
        <Table.Row key={index}>
          <Table.Data>
            <div>
              <SkeletonLoader />
            </div>
            <Box alignItems="center" display="flex" columnGap={'smallGutter'}>
              <SkeletonLoader width={'16px'} height={'16px'} />
              <SkeletonLoader />
            </Box>
          </Table.Data>
          <Table.Data>
            <SkeletonLoader />
            <SkeletonLoader />
          </Table.Data>
          <Table.Data>
            <Text variant="eyebrow">
              <SkeletonLoader width={126} />
            </Text>
          </Table.Data>
          <Table.Data>
            <Box display="flex" alignItems="center" columnGap="gutter">
              <Box justifyContent={'flexStart'}>
                <SkeletonLoader height={32} width={48} />
              </Box>
              <Box display="flex" flexDirection={'column'}>
                <SkeletonLoader width={122} height={20} repeat={2} />
              </Box>
            </Box>
          </Table.Data>
        </Table.Row>
      )
    })}
  </Table.Body>
)

export default LogTable
