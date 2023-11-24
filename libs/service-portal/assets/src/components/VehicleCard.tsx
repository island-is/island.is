import { VehiclesVehicle } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import React, { FC, useEffect, useState } from 'react'
import { formatDate } from '@island.is/service-portal/core'
import differenceInMonths from 'date-fns/differenceInMonths'
import { messages, vehicleMessage } from '../lib/messages'
import { ActionCard } from '@island.is/service-portal/core'
import { AssetsPaths } from '../lib/paths'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

interface Props {
  vehicle: VehiclesVehicle
}

export const VehicleCard: FC<React.PropsWithChildren<Props>> = ({
  vehicle,
}) => {
  const { formatMessage } = useLocale()

  // Remove flag functionality once feature goes live.
  const [enabledMileageFlag, setEnabledMileageFlag] = useState<boolean>(false)
  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalVehicleMileagePageEnabled`,
        false,
      )
      if (ffEnabled) {
        setEnabledMileageFlag(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      secondaryTag={
        vehicle.requiresMileageRegistration && enabledMileageFlag
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
