import { Box, Icon, Text, Table } from '@island.is/island-ui/core'
import React from 'react'
import Person from '../PersonIcon/PersonIcon'
import { SessionsSession } from '@island.is/api/schema'
import { formatNationalId, getSessionType } from '../../utils/utils'
import { useAuth } from '@island.is/auth/react'
import { dateFormat } from '@island.is/shared/constants'
import { formatDate, getTime } from '@island.is/shared/utils'

interface IProps {
  data: SessionsSession[]
}
const HistoryTable: React.FC<IProps> = ({ data }) => {
  const { userInfo } = useAuth()
  console.log(userInfo)
  return (
    <Table.Table>
      <Table.Head>
        <Table.Row>
          <Table.HeadData>Dags</Table.HeadData>
          <Table.HeadData>Tæki og staður</Table.HeadData>
          <Table.HeadData>Kerfi</Table.HeadData>
          <Table.HeadData>Aðili</Table.HeadData>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.map((session: any, index: number) => {
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
                <div>{session.userAgent.split(')')[0] + ')'}</div>
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
    </Table.Table>
  )
}

export default HistoryTable
