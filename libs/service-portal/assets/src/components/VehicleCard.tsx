import { VehiclesVehicle } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { formatDate } from '@island.is/service-portal/core'
import differenceInMonths from 'date-fns/differenceInMonths'
import { messages, vehicleMessage } from '../lib/messages'
import { ActionCard } from '@island.is/service-portal/core'
import { AssetsPaths } from '../lib/paths'

interface Props {
  vehicle: VehiclesVehicle
}

export const VehicleCard: FC<React.PropsWithChildren<Props>> = ({
  vehicle,
}) => {
  const { formatMessage } = useLocale()
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
              label: `${formatMessage(
                vehicleMessage.nextAnyInspection,
              )} ${formatDate(vehicle.nextInspection.nextInspectionDate)}`,
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
        label: formatMessage(messages.seeInfo),
        variant: 'text',
        url: vehicle.permno
          ? AssetsPaths.AssetsVehiclesDetail.replace(':id', vehicle.permno)
          : undefined,
      }}
    />
  )
}
