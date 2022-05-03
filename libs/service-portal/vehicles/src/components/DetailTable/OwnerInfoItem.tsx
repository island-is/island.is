import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { CurrentOwnerInfo } from '@island.is/api/schema'

interface PropTypes {
  data: CurrentOwnerInfo
}

const OwnerInfoItem = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <HeaderRow>
        {formatMessage({
          id: 'sp.vehicles:owner-title',
          defaultMessage: 'Eigandi',
        })}
      </HeaderRow>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:owner-owner',
            defaultMessage: 'Eigandi',
          })}
          value={data.owner}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:owner-ssn',
            defaultMessage: 'Kennitala',
          })}
          value={data.persidno}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:owner-address',
            defaultMessage: 'Heimilisfang',
          })}
          value={data.address}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:owner-postalcode',
            defaultMessage: 'Póstnúmer',
          })}
          value={data.postalcode}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:owner-city',
            defaultMessage: 'Borg/bær',
          })}
          value={data.city}
        />
        {data.dateOfPurchase && (
          <Column
            label={formatMessage({
              id: 'sp.vehicles:owner-purchase-date',
              defaultMessage: 'Kaupdagur',
            })}
            value={new Date(data.dateOfPurchase).toLocaleDateString()}
          />
        )}
      </Row>
    </Box>
  )
}

export default OwnerInfoItem
