import { VehiclesVehicle } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { formatDate } from '@island.is/service-portal/core'
import differenceInMonths from 'date-fns/differenceInMonths'
import { messages } from '../lib/messages'
import { ActionCard } from '@island.is/service-portal/core'

interface Props {
  vehicle: VehiclesVehicle
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
  const year = vehicle.modelYear ? '(' + vehicle.modelYear + ')' : ''

  const heading = vehicle.type + ' ' + year
  const plate = vehicle.regno || vehicle.permno || ''
  const text = vehicle.color ? vehicle.color + ' - ' + plate : plate

  return (
    <ActionCard
      heading={heading}
      text={text}
      tag={
        vehicle?.nextInspection?.nextInspectionDate
          ? {
              label: `${formatMessage(messages.nextAnyInspection)} ${formatDate(
                vehicle.nextInspection.nextInspectionDate,
              )}`,
              variant:
                differenceInMonths(
                  new Date(vehicle.nextInspection.nextInspectionDate),
                  new Date(),
                ) > 0
                  ? 'blue'
                  : 'red',
              outlined: false,
            }
          : undefined
      }
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
