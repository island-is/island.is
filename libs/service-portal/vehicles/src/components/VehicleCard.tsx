import { VehiclesUserVehicle } from '@island.is/api/schema'
import { ActionCard } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
  vehicle: VehiclesUserVehicle
}

export const VehicleCard: FC<Props> = ({ vehicle }) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const handleClick = () =>
    vehicle.permno &&
    history.push(
      ServicePortalPath.AssetsVehiclesDetail.replace(':id', vehicle.permno),
    )
  if (!vehicle) {
    return null
  }
  const year = vehicle.productYear
    ? '(' + vehicle.productYear + ')'
    : vehicle.firstRegDate
    ? '(' + new Date(vehicle.firstRegDate).getFullYear() + ')'
    : ''

  const heading = vehicle.type + ' ' + year
  const plate = vehicle.regno || vehicle.permno || ''
  const text = vehicle.color ? vehicle.color + ' - ' + plate : plate

  return (
    <ActionCard
      heading={heading}
      headingVariant="h4"
      text={text}
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
