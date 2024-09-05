import { Box } from '@island.is/island-ui/core'
import { ExpandRow, formatDate } from '@island.is/service-portal/core'
import { ReactNode, useEffect } from 'react'
import * as styles from './VehicleBulkMileage.css'
import { VehicleBulkMileageSaveButton } from './VehicleBulkMileageSaveButton'
import { useLocale } from '@island.is/localization'
import { vehicleMessage as messages } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { VehicleType } from './types'
import { isReadDateToday } from '../../utils/readDate'

interface Props {
  vehicle: VehicleType
  onPost: (vehicleId: string) => void
  //onBulkPost: (vehicleId: string) => void
  onSave: (vehicleId: string) => void
  //onBulkPostComplete: (vehicleId: string) => void
  children?: ReactNode
}

export const VehicleBulkMileageRow = ({
  vehicle,
  children,
  onSave,
  onPost,
}: //onBulkPost,
//onBulkPostComplete,
Props) => {
  const { formatMessage } = useLocale()

  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  /*
  useEffect(() => {
    if (vehicle.mileageUploadedFromFile) {
      setValue(vehicle.vehicleId, vehicle.mileageUploadedFromFile)
    }
  }, [vehicle.mileageUploadedFromFile])
  */

  const onSaveButtonClick = () => {
    onSave(vehicle.vehicleId)
  }

  /*
  useEffect(() => {
    switch (vehicle?.submissionStatus) {
      case 'submit-all':
        onBulkPost(vehicle.vehicleId)
        return
      case 'submit':
        onPost(vehicle.vehicleId)
        return
      case 'waiting-success':
      case 'waiting-idle':
      case 'waiting-failure':
        onBulkPostComplete(vehicle.vehicleId)
        return
      default:
        return
    }
  }, [vehicle?.submissionStatus, vehicle.vehicleId])
  */

  return (
    <ExpandRow
      key={`bulk-mileage-vehicle-row-${vehicle.vehicleId}`}
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
      {children}
    </ExpandRow>
  )
}
