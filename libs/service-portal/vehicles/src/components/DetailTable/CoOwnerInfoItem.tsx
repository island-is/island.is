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

const CoOwnerInfoItem = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <HeaderRow>
        {formatMessage({
          id: 'sp.vehicles:co-owner-title',
          defaultMessage: 'Meðeigandi',
        })}
      </HeaderRow>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:co-owner-owner',
            defaultMessage: 'Nafn',
          })}
          value={data.owner}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:co-owner-ssn',
            defaultMessage: 'Kennitala',
          })}
          value={data.persidno}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:co-owner-address',
            defaultMessage: 'Heimilisfang',
          })}
          value={data.address}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:co-owner-postalcode',
            defaultMessage: 'Póstnúmer',
          })}
          value={data.postalcode}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:co-owner-city',
            defaultMessage: 'Borg/bær',
          })}
          value={data.city}
        />
      </Row>
    </Box>
  )
}

export default CoOwnerInfoItem
