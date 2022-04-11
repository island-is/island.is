import { ActionCard, Box, Button, Text, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
  vehicle: any
}

export const VehicleCard: FC<Props> = ({ vehicle }) => {
  const { formatMessage } = useLocale()
  const history = useHistory()

  const handleClick = () =>
    vehicle.permno &&
    history.push(
      ServicePortalPath.AssetsVehiclesDetail.replace(':id', vehicle.permno),
    )
  return (
    <ActionCard
      heading={
        vehicle.type && vehicle.productYear
          ? `${vehicle.type}${', '}${vehicle.productYear}`
          : ''
      }
      headingVariant="h4"
      text={vehicle.regno || vehicle.permno || ''}
      cta={{
        label: formatMessage({
          id: 'sp.vehicles:see-info',
          defaultMessage: 'Skoða nánar',
        }),
        variant: 'text',
        onClick: () => handleClick(),
      }}
    />
  )
}
