import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { VehicleType } from './types'
import {
  useVehicleMileageRegistrationHistoryLazyQuery,
  usePutSingleVehicleMileageMutation,
  usePostSingleVehicleMileageMutation,
  useGetUsersMileageLazyQuery,
} from './VehicleBulkMileage.generated'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  EmptyTable,
  ExpandRow,
  NestedFullTable,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { vehicleMessage } from '../../lib/messages'
import { VehicleBulkMileageSaveButton } from './VehicleBulkMileageSaveButton'
import { InputController } from '@island.is/shared/form-fields'
import * as styles from './VehicleBulkMileage.css'
import { displayWithUnit } from '../../utils/displayWithUnit'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { VehicleBulkMileageSubData } from './VehicleBulkMileageSubData'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'

type MutationStatus =
  | 'initial'
  | 'posting'
  | 'waiting'
  | 'success'
  | 'error'
  | 'validation-error'

interface Props {
  vehicle: VehicleType
  onMileageUpdateCallback?: () => void
}
export const VehicleBulkMileageRow = ({
  vehicle,
  onMileageUpdateCallback,
}: Props) => {
  const { formatMessage } = useLocale()
  const [postError, setPostError] = useState<string | null>(null)
  const [localInternalId, setLocalInternalId] = useState<number>()
  const [localMileage, setLocalMileage] = useState<number>()
  const [localDate, setLocalDate] = useState<Date>()
  const [postStatus, setPostStatus] = useState<MutationStatus>('initial')

  const [showSubdata, setShowSubdata] = useState<boolean>(false)
  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        Features.isServicePortalVehicleBulkMileageSubdataPageEnabled,
        false,
      )
      if (ffEnabled) {
        setShowSubdata(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    onCompleted: ({ vehicleMileagePutV2: data }) => {
      if (data?.__typename === 'VehicleMileagePutModel' && data.internalId) {
        const internalId = parseInt(data.internalId, 10)
        setLocalInternalId(internalId)
        setLocalMileage(data.mileageNumber ?? undefined)
      }
      handleMutationResponse(
        data?.__typename === 'VehiclesMileageUpdateError',
        data?.__typename === 'VehiclesMileageUpdateError'
          ? data?.message ?? formatMessage(m.errorTitle)
          : undefined,
      )
    },
  })

  const [postAction] = usePostSingleVehicleMileageMutation({
    onError: () => handleMutationResponse(true),
    onCompleted: ({ vehicleMileagePostV2: data }) => {
      if (data?.__typename === 'VehicleMileageDetail' && data.internalId) {
        const internalId = parseInt(data.internalId, 10)
        setLocalInternalId(internalId)
        setLocalMileage(data.mileageNumber ?? undefined)
        setLocalDate(data.readDate ? new Date(data.readDate) : undefined)
      }
      handleMutationResponse(
        data?.__typename === 'VehiclesMileageUpdateError',
        data?.__typename === 'VehiclesMileageUpdateError'
          ? data?.message ?? formatMessage(m.errorTitle)
          : undefined,
      )
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
    reset,
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
        if (onMileageUpdateCallback) {
          onMileageUpdateCallback()
        }
        reset()
      }
    }, 500)
  }, [onMileageUpdateCallback, postStatus, registrationsRefetch, reset])

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
    if (
      postStatus === 'error' ||
      postStatus === 'validation-error' ||
      postStatus === 'success'
    ) {
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
      if (localInternalId) {
        putAction({
          variables: {
            input: {
              internalId: localInternalId,
              permno: vehicle.vehicleId,
              mileageNumber: formValue,
            },
          },
        })
      } else if (
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
  }, [mileageData?.vehicleMileageDetails, vehicle.vehicleId, localInternalId])

  const nestedTable = useMemo(() => {
    if (!data?.vehiclesMileageRegistrationHistory) {
      return [[]]
    }
    const tableData: Array<Array<string>> = [[]]
    for (const mileageRegistration of data?.vehiclesMileageRegistrationHistory
      ?.mileageRegistrationHistory ?? []) {
      if (mileageRegistration) {
        tableData.push([
          formatDate(mileageRegistration.date),
          mileageRegistration.originCode,
          //'-',
          displayWithUnit(mileageRegistration.mileage, 'km', true),
        ])
      }
    }

    return tableData
  }, [data?.vehiclesMileageRegistrationHistory])

  const displayDate = localDate ?? vehicle.lastMileageRegistration?.date
  const displayMileage =
    localMileage ?? vehicle.lastMileageRegistration?.mileage
  return (
    <ExpandRow
      key={`bulk-mileage-vehicle-row-${vehicle.vehicleId}`}
      onExpandCallback={executeRegistrationsQuery}
      data={[
        {
          value: (
            <Box>
              <Text variant="medium">{vehicle.vehicleType}</Text>
              <Text variant="small">{vehicle.vehicleId}</Text>
            </Box>
          ),
        },
        {
          value: displayDate ? format(displayDate, 'dd.MM.yyyy') : '-',
        },
        {
          value: displayMileage
            ? displayWithUnit(displayMileage, 'km', true)
            : '-',
        },
        {
          value: (
            <Box className={styles.mwInput}>
              <InputController
                control={control}
                id={vehicle.vehicleId}
                name={vehicle.vehicleId}
                backgroundColor="blue"
                placeholder="km"
                type="number"
                suffix=" km"
                thousandSeparator
                decimalScale={0}
                size="xs"
                maxLength={12}
                defaultValue={''}
                onChange={onInputChange}
                error={postError ?? undefined}
                aria-invalid={!!postError}
                aria-describedby={
                  postError ? `${vehicle.vehicleId}-error` : undefined
                }
                rules={{
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
          aria-live="polite"
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
      ) : showSubdata ? (
        data?.vehiclesMileageRegistrationHistory ? (
          <VehicleBulkMileageSubData
            vehicleId={vehicle.vehicleId}
            data={data?.vehiclesMileageRegistrationHistory}
            co2={vehicle.co2}
            loading={loading}
          />
        ) : (
          <EmptyTable
            background={'blue100'}
            loading={loading}
            message={formatMessage(vehicleMessage.noVehiclesFound)}
          />
        )
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
          data={nestedTable}
        />
      )}
    </ExpandRow>
  )
}
