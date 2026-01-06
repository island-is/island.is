import { VehicleListed } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { formatDate } from '@island.is/portals/my-pages/core'
import differenceInMonths from 'date-fns/differenceInMonths'
import { messages, vehicleMessage } from '../lib/messages'
import { ActionCard } from '@island.is/portals/my-pages/core'
import { AssetsPaths } from '../lib/paths'

interface Props {
  vehicle: VehicleListed
}

export const VehicleCard: FC<React.PropsWithChildren<Props>> = ({
  vehicle,
}) => {
  const { formatMessage } = useLocale()

  if (!vehicle) {
    return null
  }
  const year = vehicle.modelYear ? '(' + vehicle.modelYear + ')' : ''

  const heading = vehicle.make + ' ' + year
  const plate = vehicle.regno || vehicle.permno || ''
  const text = vehicle.colorName ? vehicle.colorName + ' - ' + plate : plate

  return (
    //TODO: Replace with Island UI Card, decide if we should add secondaryTag or find another solution
    <ActionCard
      heading={heading}
      text={text}
      tag={
        vehicle?.nextMainInspection
          ? {
              label: `${formatMessage(
                vehicleMessage.nextAnyInspection,
              )} ${formatDate(vehicle.nextMainInspection)}`,
              variant:
                differenceInMonths(
                  new Date(vehicle.nextMainInspection),
                  new Date(),
                ) > 0
                  ? 'blue'
                  : 'red',
              outlined: false,
            }
          : undefined
      }
      secondaryTag={
        vehicle.requiresMileageRegistration
          ? {
              label: formatMessage(vehicleMessage.mileageTagText),
              variant: 'warn',
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
