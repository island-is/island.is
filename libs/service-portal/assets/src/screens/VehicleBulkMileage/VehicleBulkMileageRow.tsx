import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { VehicleType } from './types'
import {
  useVehicleMileageRegistrationHistoryLazyQuery,
  usePutSingleVehicleMileageMutation,
  usePostSingleVehicleMileageMutation,
  useGetUsersMileageLazyQuery,
} from './VehicleBulkMileage.generated'

import { useEffect, useState, useCallback } from 'react'
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
import { useDebounce } from 'react-use'
import { isReadDateToday } from '../../utils/readDate'

const ORIGIN_CODE = 'ISLAND.IS'

type MutationStatus =
  | 'initial'
  | 'posting'
  | 'waiting'
  | 'success'
  | 'error'
  | 'validation-error'

interface Props {
  vehicle: VehicleType
}
export const VehicleBulkMileageRow = ({ vehicle }: Props) => {
  const { formatMessage } = useLocale()
  const [postError, setPostError] = useState<string | null>(null)
  const [postStatus, setPostStatus] = useState<MutationStatus>('initial')

  const [
    executeRegistrationsQuery,
    { data, loading, error, refetch: registrationsRefetch },
  ] = useVehicleMileageRegistrationHistoryLazyQuery({
    variables: {
      input: {
        permno: vehicle.vehicleId,
      },
    },
  })

  const [putAction] = usePutSingleVehicleMileageMutation({
    onError: () => handleMutationResponse(true),
    onCompleted: ({ vehicleMileagePutV2: data }) =>
      handleMutationResponse(
        data?.__typename === 'VehiclesMileageUpdateError',
        data?.__typename === 'VehiclesMileageUpdateError'
          ? data?.message ?? formatMessage(m.errorTitle)
          : undefined,
      ),
  })

  const [postAction] = usePostSingleVehicleMileageMutation({
    onError: () => handleMutationResponse(true),
    onCompleted: ({ vehicleMileagePostV2: data }) => {
      if (data?.__typename === 'VehiclesMileageUpdateError') {
        setPostError(data.message)
        setPostStatus('error')
      } else {
        setPostStatus('success')
      }
    },
  })

  const [executeMileageQuery, { data: mileageData, refetch: mileageRefetch }] =
    useGetUsersMileageLazyQuery({
      variables: { input: { permno: vehicle.vehicleId } },
    })

  const {
    control,
    getValues,
    formState: { errors },
    trigger,
  } = useFormContext()

  const handleMutationResponse = (isError: boolean, message?: string) =>
    updateStatusAndMessage(isError ? 'error' : 'success', message)

  const updateStatusAndMessage = (
    status: MutationStatus,
    errorMessage?: string,
  ) => {
    if (
      postError &&
      !errorMessage &&
      status !== 'error' &&
      status !== 'validation-error'
    ) {
      setPostError(null)
    }
    setPostStatus(status)

    if (errorMessage) {
      setPostError(errorMessage)
    }
  }

  const handleValidationErrors = useCallback(() => {
    const vehicleErrors = errors?.[vehicle.vehicleId]
    if (vehicleErrors) {
      updateStatusAndMessage('error', vehicleErrors.message as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, vehicle.vehicleId])

  useEffect(() => {
    setTimeout(() => {
      if (postStatus === 'success') {
        registrationsRefetch()
      }
    }, 500)
  }, [postStatus, registrationsRefetch])

  useEffect(() => {
    switch (postStatus) {
      case 'posting': {
        postToServer()
        return
      }
      case 'waiting':
        if (mileageData?.vehicleMileageDetails) {
          setPostStatus('posting')
        }
        return
      case 'validation-error':
        handleValidationErrors()
        return
      default:
        return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postStatus, mileageData?.vehicleMileageDetails])

  const getValueFromForm = async (
    formFieldId: string,
    skipEmpty = false,
  ): Promise<number | undefined> => {
    const value = getValues(formFieldId)
    if (!value && skipEmpty) {
      return
    }
    const isValid = await trigger(formFieldId)
    if (isValid) {
      return Number(value)
    }

    //invalid validation, set errors
    setPostStatus('validation-error')
  }

  const onInputChange = () => {
    if (postStatus === 'error' || postStatus === 'validation-error') {
      updateStatusAndMessage('initial')
    }
  }

  const onSaveButtonClick = async () => {
    if (postStatus !== 'initial') {
      mileageRefetch()
    } else {
      executeMileageQuery()
    }

    updateStatusAndMessage('waiting')
  }

  const postToServer = useCallback(async () => {
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
  }, [mileageData?.vehicleMileageDetails, vehicle.vehicleId])

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
                thousandSeparator
                size="xs"
                maxLength={12}
                defaultValue={''}
                onChange={onInputChange}
                error={postError ?? undefined}
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
                  min: {
                    value: 1,
                    message: formatMessage(vehicleMessage.mileageInputPositive),
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
                postStatus === 'error'
                  ? 'error'
                  : postStatus === 'posting' || postStatus === 'waiting'
                  ? 'loading'
                  : postStatus === 'success'
                  ? 'success'
                  : 'idle'
              }
              onClick={onSaveButtonClick}
              disabled={postStatus === 'error'}
            />
          ),
        },
      ]}
    >
      {postStatus === 'success' && (
        <AlertMessage
          type="success"
          message={formatMessage(
            postStatus === 'success'
              ? vehicleMessage.mileagePostSuccess
              : vehicleMessage.mileagePutSuccess,
          )}
        />
      )}
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
            //formatMessage(vehicleMessage.annualUsage),
            formatMessage(vehicleMessage.odometer),
          ]}
          loading={loading}
          emptyMessage={formatMessage(vehicleMessage.mileageHistoryNotFound)}
          data={
            data?.vehiclesMileageRegistrationHistory?.mileageRegistrationHistory?.map(
              (r) => [
                formatDate(r.date),
                r.originCode,
                //'-',
                displayWithUnit(r.mileage, 'km', true),
              ],
            ) ?? []
          }
        />
      )}
    </ExpandRow>
  )
}
