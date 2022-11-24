import { VehiclesVehicle } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { formatDate } from '@island.is/service-portal/core'
import differenceInMonths from 'date-fns/differenceInMonths'
import { messages } from '../lib/messages'
import { ActionCard } from '@island.is/service-portal/core'
import { translateType } from '../utils/vehicleCardMapper'

interface Props {
  vehicle: VehiclesVehicle
}

export const VehicleCard: FC<Props> = ({ vehicle }) => {
  const { formatMessage } = useLocale()
  if (!vehicle) {
    return null
  }
  const year = vehicle.modelYear ? '(' + vehicle.modelYear + ')' : ''

  const heading = vehicle.type + ' ' + year
  const plate = vehicle.regno || vehicle.permno || ''
  const text = vehicle.color ? vehicle.color + ' - ' + plate : plate
  const colorCode = vehicle.colorCode ?? '999' // 999 is default if no value is set
  const vehicleCode = vehicle.vehGroup?.split('(')[1].split(')')[0] ?? 'AA' // type from vehgroup = "Vörubifreið II (N3)" = N3 otherwise AA is default

  return (
    <ActionCard
      image={{
        type: 'component',
        component: translateType(vehicleCode, colorCode),
      }}
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
        url: vehicle.permno
          ? ServicePortalPath.AssetsVehiclesDetail.replace(
              ':id',
              vehicle.permno,
            )
          : undefined,
      }}
    />
  )
}
