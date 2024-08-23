import { Box } from '@island.is/island-ui/core'
import { ExpandRow, formatDate } from '@island.is/service-portal/core'
import { ReactNode, useEffect, useMemo } from 'react'
import * as styles from './VehicleBulkMileage.css'
import { VehicleBulkMileageSaveButton } from './VehicleBulkMileageSaveButton'
import { useLocale } from '@island.is/localization'
import { vehicleMessage as messages } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { SubmissionState } from './types'
import { isReadDateToday } from '../../utils/readDate'
import { useVehicleBulkMileageContext } from './VehicleBulkMileageContext'

interface Props {
  vehicleId: string
  children?: ReactNode
}

interface FormData {
  mileageInput: number
}

export const VehicleBulkMileageRow = ({ vehicleId, children }: Props) => {
  const { formatMessage } = useLocale()

  const { setVehicles, vehicles } = useVehicleBulkMileageContext()

  const vehicle = useMemo(() => {
    const vehicleIndex = vehicles.findIndex((v) => v.vehicleId === vehicleId)
    return {
      vehicleData: vehicles[vehicleIndex],
      vehicleIndex,
    }
  }, [vehicleId, vehicles])

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    switch (vehicle?.vehicleData.submissionStatus) {
      case 'submit-all':
        postMileageInBulk()
        return
      case 'submit':
        postMileage()
        return
      case 'waiting-success':
        updateNextVehicle('waiting-success')
        return
      case 'waiting-failure':
        updateNextVehicle('waiting-failure')
        return
      default:
        return
    }
  }, [vehicle?.vehicleData?.submissionStatus])

  if (!vehicle) {
    return null
  }

  const updateNextVehicle = (currentSubmissionState: SubmissionState) => {
    if (vehicle.vehicleIndex + 1 < vehicles.length) {
      const nextVehicleId = vehicles[vehicle.vehicleIndex + 1].vehicleId
      const newVehicles = vehicles.map((v) => {
        if (v.vehicleId === nextVehicleId) {
          return {
            ...v,
            submissionStatus: 'submit-all' as const,
          }
        } else if (v.vehicleId === vehicle.vehicleData.vehicleId) {
          return {
            ...v,
            submissionStatus:
              currentSubmissionState === 'waiting-success'
                ? ('success' as const)
                : ('failure' as const),
          }
        } else return v
      })
      setVehicles(newVehicles)
    }
  }

  const postMileageInBulk = async () => {
    if (vehicles.length === 1) {
      await postMileage(
        undefined,
        () => updateVehicleSubmissionStatus('success'),
        () => updateVehicleSubmissionStatus('failure'),
      )
      return
    }

    const lastVehicle = vehicle.vehicleIndex >= vehicles.length - 1

    await postMileage(
      undefined,
      () =>
        updateVehicleSubmissionStatus(
          lastVehicle ? 'success' : 'waiting-success',
        ),
      () =>
        updateVehicleSubmissionStatus(
          lastVehicle ? 'failure' : 'waiting-failure',
        ),
    )
  }

  const updateVehicleSubmissionStatus = (
    status: SubmissionState,
    vehicleIndex: number = vehicle.vehicleIndex,
  ) => {
    const vehicleId = vehicles[vehicleIndex].vehicleId
    const newVehicles = vehicles.map((v) => {
      if (v.vehicleId === vehicleId) {
        return {
          ...v,
          submissionStatus: status,
        }
      } else return v
    })
    setVehicles(newVehicles)
  }

  const postMileage = async (
    mileage?: number,
    successCallback?: () => void,
    failureCallback?: () => void,
  ) => {
    const mileageToPost: number = mileage
      ? mileage
      : (await trigger('mileageInput'))
      ? getValues('mileageInput')
      : -1

    if (mileageToPost < 0) {
      console.log('validation failed')
      return
    }

    successCallback && successCallback()
    return
    /*
      await post etc
      if (success) {
      return 'success'
      } else {
      return 'failure'
      }
      */
  }

  return (
    <ExpandRow
      key={`bulk-mileage-vehicle-row-${vehicleId}`}
      data={[
        {
          value: vehicle.vehicleData.vehicleType,
        },
        {
          value: vehicle.vehicleData.vehicleId,
        },
        {
          value: formatDate(vehicle.vehicleData.lastRegistrationDate),
        },
        {
          value: (
            <form>
              <Box className={styles.mwInput}>
                <InputController
                  control={control}
                  id={`mileageInput`}
                  name={`mileageInput`}
                  type="number"
                  suffix=" km"
                  thousandSeparator
                  size="xs"
                  maxLength={12}
                  defaultValue={''}
                  error={errors?.mileageInput?.message}
                  rules={{
                    validate: {
                      value: (value: number) => {
                        // Input number must be higher than the highest known mileage registration value
                        if (vehicle.vehicleData.registrationHistory) {
                          // If we're in editing mode, we want to find the highest confirmed registered number, ignoring all Island.is registrations from today.
                          const confirmedRegistrations =
                            vehicle.vehicleData.registrationHistory.filter(
                              (item) => {
                                if (item.date) {
                                  const isIslandIsReadingToday =
                                    item.origin === 'ISLAND-IS' &&
                                    isReadDateToday(new Date(item.date))
                                  return !isIslandIsReadingToday
                                }
                                return true
                              },
                            )

                          const detailArray = vehicle.vehicleData
                            .isCurrentlyEditing
                            ? confirmedRegistrations
                            : [...vehicle.vehicleData.registrationHistory]

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
            </form>
          ),
        },
        {
          value: (
            <VehicleBulkMileageSaveButton
              submissionState={vehicle.vehicleData.submissionStatus}
              onClick={handleSubmit((data) =>
                postMileage(
                  data.mileageInput,
                  () => updateVehicleSubmissionStatus('success'),
                  () => updateVehicleSubmissionStatus('failure'),
                ),
              )}
            />
          ),
        },
      ]}
    >
      {children}
    </ExpandRow>
  )
}
