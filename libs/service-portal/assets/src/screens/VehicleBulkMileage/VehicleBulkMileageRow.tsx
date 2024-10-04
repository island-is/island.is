import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { VehicleType } from './types'
import {
  useVehicleMileageRegistrationHistoryLazyQuery,
  usePutSingleVehicleMileageMutation,
  usePostSingleVehicleMileageMutation,
  useGetUsersMileageLazyQuery,
} from './VehicleBulkMileage.generated'

import { useEffect, useState } from 'react'
import {
  ExpandRow,
  NestedFullTable,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { AlertMessage, Box } from '@island.is/island-ui/core'
import { vehicleMessage } from '../../lib/messages'
import { VehicleBulkMileageSaveButton } from './VehicleBulkMileageSaveButton'
import { InputController } from '@island.is/shared/form-fields'
import * as styles from './VehicleBulkMileage.css'
import { displayWithUnit } from '../../utils/displayWithUnit'
import { isReadDateToday } from '../../utils/readDate'

const ORIGIN_CODE = 'ISLAND.IS'

interface Props {
  vehicle: VehicleType
}

export const VehicleBulkMileageRow = ({ vehicle }: Props) => {
  const { formatMessage } = useLocale()
  const [postError, setPostError] = useState<string | null>(null)
  const [postSuccess, setPostSuccess] = useState(false)

  const [executeRegistrationsQuery, { data, loading, error }] =
    useVehicleMileageRegistrationHistoryLazyQuery({
      variables: {
        input: {
          permno: vehicle.vehicleId,
        },
      },
    })

  const [putAction, { loading: putActionLoading }] =
    usePutSingleVehicleMileageMutation({
      onError: () => {
        setPostError(formatMessage(m.errorTitle))
        setPostSuccess(false)
      },
      onCompleted: () => {
        setPostError(null)
        setPostSuccess(true)
      },
    })

  const [postAction, { loading: postActionLoading }] =
    usePostSingleVehicleMileageMutation({
      onError: () => {
        setPostError(formatMessage(m.errorTitle))
        setPostSuccess(false)
      },
      onCompleted: () => {
        setPostError(null)
        setPostSuccess(true)
      },
    })

  const [executeMileageQuery, { data: mileageData, loading: mileageLoading }] =
    useGetUsersMileageLazyQuery({
      variables: { input: { permno: vehicle.vehicleId } },
    })

  const {
    control,
    getValues,
    formState: { errors },
    trigger,
  } = useFormContext()

  const getValueFromForm = async (
    formFieldId: string,
    skipEmpty = false,
  ): Promise<number | undefined> => {
    const value = getValues(formFieldId)
    if (!value && skipEmpty) {
      return
    }
    if (await trigger(formFieldId)) {
      return Number(value)
    }
    return
  }

  const onSaveButtonClick = async () => {
    setPostError(null)
    setPostSuccess(false)
    executeMileageQuery()
  }

  useEffect(() => {
    const postMileage = async () => {
      const formValue = await getValueFromForm(vehicle.vehicleId)
      if (formValue) {
        if (
          mileageData?.vehicleMileageDetails?.editing &&
          mileageData.vehicleMileageDetails?.data?.[0]?.internalId
        ) {
          putAction({
            variables: {
              input: {
                internalId: parseInt(
                  mileageData.vehicleMileageDetails?.data?.[0]?.internalId,
                  10,
                ),
                permno: vehicle.vehicleId,
                mileageNumber: formValue,
              },
            },
          })
        } else {
          postAction({
            variables: {
              input: {
                permno: vehicle.vehicleId,
                originCode: 'ISLAND.IS',
                mileageNumber: formValue,
              },
            },
          })
        }
      }
    }

    if (mileageData) {
      postMileage()
    }
  }, [mileageData])

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
        // Until we get the data from the service
        /*{
          value: formatDate(vehicle.lastMileageRegistration),
        },*/
        {
          value: (
            <Box className={styles.mwInput}>
              <InputController
                control={control}
                id={vehicle.vehicleId}
                name={vehicle.vehicleId}
                type="number"
                suffix=" km"
                min={0}
                thousandSeparator
                size="xs"
                maxLength={12}
                defaultValue={''}
                error={
                  postError ?? (errors?.[vehicle.vehicleId]?.message as string)
                }
                rules={{
                  validate: {
                    userHasPostAccess: () => {
                      if (
                        mileageData?.vehicleMileageDetails
                          ?.canUserRegisterVehicleMileage
                      ) {
                        return true
                      }
                      return formatMessage(
                        vehicleMessage.mileageYouAreNotAllowed,
                      )
                    },
                    readDate: () => {
                      if (
                        !mileageData?.vehicleMileageDetails?.editing &&
                        !mileageData?.vehicleMileageDetails?.canRegisterMileage
                      ) {
                        return formatMessage(
                          vehicleMessage.mileageAlreadyRegistered,
                        )
                      }
                      return true
                    },
                    value: (value: number) => {
                      // Input number must be higher than the highest known mileage registration value
                      if (mileageData?.vehicleMileageDetails?.data) {
                        // If we're in editing mode, we want to find the highest confirmed registered number, ignoring all Island.is registrations from today.
                        const confirmedRegistrations =
                          mileageData.vehicleMileageDetails.data.filter(
                            (item) => {
                              if (item.readDate) {
                                const isIslandIsReadingToday =
                                  item.originCode === ORIGIN_CODE &&
                                  isReadDateToday(new Date(item.readDate))
                                return !isIslandIsReadingToday
                              }
                              return true
                            },
                          )

                        const detailArray = mileageData.vehicleMileageDetails
                          .editing
                          ? confirmedRegistrations
                          : mileageData.vehicleMileageDetails.data

                        const latestRegistration =
                          detailArray[0].mileageNumber ?? 0
                        if (latestRegistration > value) {
                          return formatMessage(
                            vehicleMessage.mileageInputTooLow,
                          )
                        }
                      }
                    },
                  },
                  required: {
                    value: true,
                    message: formatMessage(
                      vehicleMessage.mileageInputMinLength,
                    ),
                  },
                  minLength: {
                    value: 1,
                    message: formatMessage(
                      vehicleMessage.mileageInputMinLength,
                    ),
                  },
                }}
              />
            </Box>
          ),
        },
        {
          value: (
            <VehicleBulkMileageSaveButton
              submissionStatus={
                postError
                  ? 'error'
                  : postActionLoading || putActionLoading || mileageLoading
                  ? 'loading'
                  : postSuccess
                  ? 'success'
                  : 'idle'
              }
              onClick={onSaveButtonClick}
            />
          ),
        },
      ]}
    >
      {error ? (
        <AlertMessage
          type="error"
          message={formatMessage(vehicleMessage.mileageHistoryFetchFailed)}
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
          emptyMessage={formatMessage(vehicleMessage.mileageHistoryNotFound)}
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
