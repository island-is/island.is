import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { Box } from '@island.is/island-ui/core'
import { Operator } from '@island.is/api/schema'

interface PropTypes {
  data: Operator
}

const OperatorInfoItem = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <HeaderRow>
        {formatMessage({
          id: 'sp.vehicles:operator-title',
          defaultMessage: 'Umráðamaður',
        })}
      </HeaderRow>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:operator-owner',
            defaultMessage: 'Nafn',
          })}
          value={data.name}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:operator-ssn',
            defaultMessage: 'Kennitala',
          })}
          value={data.persidno}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:operator-address',
            defaultMessage: 'Heimilisfang',
          })}
          value={data.address}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:operator-postalcode',
            defaultMessage: 'Póstnúmer',
          })}
          value={data.postalcode}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:operator-city',
            defaultMessage: 'Borg/bær',
          })}
          value={data.city}
        />

        <Column
          label={formatMessage({
            id: 'sp.vehicles:operator-start-date',
            defaultMessage: 'Dagsetning frá',
          })}
          value={
            data.startDate && new Date(data.startDate).toLocaleDateString()
          }
        />
      </Row>
    </Box>
  )
}

export default OperatorInfoItem
