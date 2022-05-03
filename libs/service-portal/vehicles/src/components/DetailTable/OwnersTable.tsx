import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { Owners } from '@island.is/api/schema'

interface PropTypes {
  data: Owners[]
}

const OwnersTable = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <Text variant="h4" fontWeight="semiBold" paddingBottom={2}>
        {formatMessage({
          id: 'sp.vehicles:owners-title',
          defaultMessage: 'Eigendaferill',
        })}
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
              {formatMessage({
                id: 'sp.vehicles:owners-name',
                defaultMessage: 'Nafn',
              })}
            </Text>
          </T.HeadData>
          <T.HeadData>
            <Text variant="small" fontWeight="semiBold">
              {formatMessage({
                id: 'sp.vehicles:owners-address',
                defaultMessage: 'Heimilisfang',
              })}
            </Text>
          </T.HeadData>
          <T.HeadData>
            <Text variant="small" fontWeight="semiBold">
              {formatMessage({
                id: 'sp.vehicles:owners-date',
                defaultMessage: 'Kaupdagur',
              })}
            </Text>
          </T.HeadData>
        </T.Head>
        <T.Body>
          {data?.map((owner: Owners | null, index: number) => {
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
