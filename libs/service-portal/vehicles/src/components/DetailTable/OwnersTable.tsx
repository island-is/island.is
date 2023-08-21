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
  const { formatMessage, lang } = useLocale()
  return (
    <Box marginBottom={4} marginTop="containerGutter">
      <Text variant="h4" fontWeight="semiBold" paddingBottom={2}>
        {title}
      </Text>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                #
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.name)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.address)}
              </Text>
            </T.HeadData>
            <T.HeadData>
              <Text variant="medium" fontWeight="semiBold">
                {formatMessage(messages.purchaseDate)}
              </Text>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {data?.map((owner: VehiclesOwners | null, index: number) => {
            return (
              <T.Row key={index + 'owners table'}>
                <T.Data>
                  <Text variant="medium">{data.length - index}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{owner?.name}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">{owner?.address}</Text>
                </T.Data>
                <T.Data>
                  <Text variant="medium">
                    {owner?.dateOfPurchase &&
                      new Date(owner.dateOfPurchase).toLocaleDateString(
                        lang === 'en' ? 'en-US' : 'is-IS',
                      )}
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

export default OwnersTable
