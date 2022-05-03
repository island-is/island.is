import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'
import { RegistrationInfo } from '@island.is/api/schema'

interface PropTypes {
  data: RegistrationInfo
}

const RegistrationInfoItem = ({ data }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={4}>
      <HeaderRow>
        {formatMessage({
          id: 'sp.vehicles:reg-title',
          defaultMessage: 'Skráning',
        })}
      </HeaderRow>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-first-reg',
            defaultMessage: 'Fyrsta skráning',
          })}
          value={
            data.firstRegistrationDate &&
            new Date(data.firstRegistrationDate).toLocaleDateString()
          }
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-pre-reg',
            defaultMessage: 'Forskráning',
          })}
          value={
            data.preRegistrationDate &&
            new Date(data.preRegistrationDate).toLocaleDateString()
          }
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-new-reg',
            defaultMessage: 'Nýskráning',
          })}
          value={
            data.newRegistrationDate &&
            new Date(data.newRegistrationDate).toLocaleDateString()
          }
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-vehicle-group',
            defaultMessage: 'Ökutækisflokkur',
          })}
          value={data.vehicleGroup}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-color',
            defaultMessage: 'Litur',
          })}
          value={data.color}
        />

        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-type',
            defaultMessage: 'Skráningarflokkur',
          })}
          value={data.reggroup}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-passengers',
            defaultMessage: 'Farþegar',
          })}
          value={data.passengers}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-use-group',
            defaultMessage: 'Notkunarflokkur',
          })}
          value={data.useGroup}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-drivers-passengers',
            defaultMessage: 'Farþegar hjá ökumanni',
          })}
          value={data.driversPassengers ? 'Já' : 'Nei'}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-standing-passengers',
            defaultMessage: 'Farþegar í stæði',
          })}
          value={data.standingPassengers}
        />
      </Row>
    </Box>
  )
}

export default RegistrationInfoItem
