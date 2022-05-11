import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { VehiclesOwners } from '@island.is/api/schema'
import { messages } from '../../lib/messages'

interface PropTypes {
  data: VehiclesOwners[]
  title: string
}

const OwnersTable = ({ data, title }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <Text variant="h4" fontWeight="semiBold" paddingBottom={2}>
        {title}
      </Text>
      <T.Table>
        <T.Head>
          <T.HeadData>
            <Text variant="small" fontWeight="semiBold">
              {'#'}
            </Text>
          </T.HeadData>
          <T.HeadData>
            <Text variant="small" fontWeight="semiBold">
              {formatMessage(messages.name)}
            </Text>
          </T.HeadData>
          <T.HeadData>
            <Text variant="small" fontWeight="semiBold">
              {formatMessage(messages.address)}
            </Text>
          </T.HeadData>
          <T.HeadData>
            <Text variant="small" fontWeight="semiBold">
              {formatMessage(messages.purchaseDate)}
            </Text>
          </T.HeadData>
        </T.Head>
        <T.Body>
          {data?.map((owner: VehiclesOwners | null, index: number) => {
            return (
              <T.Row key={index + 'owners table'}>
                <T.Data>{index + 1}</T.Data>
                <T.Data>{owner?.name}</T.Data>
                <T.Data>{owner?.address}</T.Data>
                <T.Data>
                  {owner?.dateOfPurchase &&
                    new Date(owner.dateOfPurchase).toLocaleDateString()}
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

export default OwnersTable
