import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import HeaderRow from './HeaderRow'
import Column from './Column'
import Row from './Row'

interface PropTypes {
  data: any
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
          value={data.firstRegistrationDate}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-pre-reg',
            defaultMessage: 'Forskráning',
          })}
          value={data.preRegistrationDate}
        />
      </Row>
      <Row>
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-new-reg',
            defaultMessage: 'Nýskráning',
          })}
          value={data.newRegistrationDate}
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
          value={data.taxGroup}
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
          value={data.driversPassengers}
        />
        <Column
          label={formatMessage({
            id: 'sp.vehicles:reg-standing-passengers',
            defaultMessage: 'Farþegar í stæði',
          })}
          value={data.standingPassengers}
        />
      </Row>
      {data.specialName && (
        <Row>
          <Column
            label={formatMessage({
              id: 'sp.vehicles:reg-special-name',
              defaultMessage: 'Sérheiti',
            })}
            value={data.specialName}
          />
        </Row>
      )}
    </Box>
  )
}

export default RegistrationInfoItem
