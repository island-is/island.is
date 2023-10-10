import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { AirDiscountSchemeFlightLeg } from '@island.is/api/schema'
import { messages as m } from '../../lib/messages'
import { formatDateWithTime } from '@island.is/service-portal/core'

interface PropTypes {
  data: AirDiscountSchemeFlightLeg[]
}

const UsageTable = ({ data }: PropTypes) => {
  useNamespaces('sp.air-discount')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="small" fontWeight="semiBold">
                {formatMessage(m.user)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="small" fontWeight="semiBold">
                {formatMessage(m.flight)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="small" fontWeight="semiBold">
                {formatMessage(m.date)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.map((item: AirDiscountSchemeFlightLeg, index: number) => {
            return (
              <T.Row key={index + ' airfare usage table'}>
                <T.Data>
                  <Text variant="small">{item.flight.user.name}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="small">{item?.travel}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="small">
                    {item?.flight.bookingDate &&
                      formatDateWithTime(item.flight.bookingDate)}
                  </Text>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default UsageTable
