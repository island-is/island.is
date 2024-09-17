import { AlertMessage, Box } from '@island.is/island-ui/core'
import {
  ExpandRow,
  NestedFullTable,
  formatDate,
} from '@island.is/service-portal/core'
import { ReactNode, useEffect } from 'react'
import * as styles from './VehicleBulkMileage.css'
import { VehicleBulkMileageSaveButton } from './VehicleBulkMileageSaveButton'
import { useLocale } from '@island.is/localization'
import { vehicleMessage as messages, vehicleMessage } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { VehicleType } from './types'
import { isReadDateToday } from '../../utils/readDate'
import { useVehicleMileageRegistrationHistoryLazyQuery } from './VehicleBulkMileage.generated'
import { displayWithUnit } from '../../utils/displayWithUnit'

interface Props {
  vehicle: VehicleType
  onSave: (vehicleId: string) => void
}

export const VehicleBulkMileageRow = ({ vehicle, onSave }: Props) => {
  const { formatMessage } = useLocale()

  const [executeRegistrationsQuery, { data, loading, error }] =
    useVehicleMileageRegistrationHistoryLazyQuery({
      variables: {
        input: {
          permno: vehicle.vehicleId,
        },
      },
    })

  const {
    control,
    formState: { errors },
  } = useFormContext()

  const onSaveButtonClick = () => {
    onSave(vehicle.vehicleId)
  }

  return (
    <ExpandRow
      key={`bulk-mileage-vehicle-row-${vehicle.vehicleId}`}
      onExpandCallback={executeRegistrationsQuery}
      data={[
        {
          value: vehicle.vehicleType,
        },
        {
          value: vehicle.vehicleId,
        },
        {
          value: formatDate(vehicle.lastRegistrationDate),
        },
        {
          value: (
            <Box className={styles.mwInput}>
              <InputController
                control={control}
                id={vehicle.vehicleId}
                name={vehicle.vehicleId}
                type="number"
                suffix=" km"
                thousandSeparator
                size="xs"
                maxLength={12}
                defaultValue={''}
                error={errors?.[vehicle.vehicleId]?.message as string}
                rules={{
                  validate: {
                    value: (value: number) => {
                      // Input number must be higher than the highest known mileage registration value
                      if (vehicle.registrationHistory) {
                        // If we're in editing mode, we want to find the highest confirmed registered number, ignoring all Island.is registrations from today.
                        const confirmedRegistrations =
                          vehicle.registrationHistory.filter((item) => {
                            if (item.date) {
                              const isIslandIsReadingToday =
                                item.origin === 'ISLAND-IS' &&
                                isReadDateToday(new Date(item.date))
                              return !isIslandIsReadingToday
                            }
                            return true
                          })

                        const detailArray = vehicle.isCurrentlyEditing
                          ? confirmedRegistrations
                          : [...vehicle.registrationHistory]

                        const latestRegistration = detailArray[0].mileage ?? 0
                        if (latestRegistration > value) {
                          return formatMessage(messages.mileageInputTooLow)
                        }
                      }
                    },
                  },
                  minLength: {
                    value: 1,
                    message: formatMessage(messages.mileageInputMinLength),
                  },
                  required: {
                    value: true,
                    message: formatMessage(messages.mileageInputMinLength),
                  },
                }}
              />
            </Box>
          ),
        },
        {
          value: (
            <VehicleBulkMileageSaveButton
              submissionState={vehicle.submissionStatus}
              onClick={onSaveButtonClick}
            />
          ),
        },
      ]}
    >
      {error ? (
        <AlertMessage
          type="error"
          message="Eitthvað fór úrskeiðis við að sækja gögn"
        />
      ) : (
        <NestedFullTable
          headerArray={[
            formatMessage(vehicleMessage.date),
            formatMessage(vehicleMessage.registration),
            formatMessage(vehicleMessage.annualUsage),
            formatMessage(vehicleMessage.odometer),
          ]}
          loading={loading}
          emptyMessage="Engar fyrri skráningar fundust"
          data={
            data?.vehiclesMileageRegistrationHistory?.mileageRegistrationHistory?.map(
              (r) => [
                formatDate(r.date),
                r.originCode,
                '-',
                displayWithUnit(r.mileage, 'km', true),
              ],
            ) ?? []
          }
        />
      )}
    </ExpandRow>
  )
}
