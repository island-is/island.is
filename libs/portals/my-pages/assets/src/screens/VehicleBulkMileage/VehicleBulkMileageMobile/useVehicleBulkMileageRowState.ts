import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { formatDate, m } from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import {
  useGetUsersMileageLazyQuery,
  usePutSingleVehicleMileageMutation,
  usePostSingleVehicleMileageMutation,
  useVehicleMileageRegistrationHistoryLazyQuery,
} from '../VehicleBulkMileage.generated'
import { displayWithUnit } from '../../../utils/displayWithUnit'
import { VehicleType } from '../types'

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

export const useVehicleBulkMileageRowState = ({
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
    variables: { input: { permno: vehicle.vehicleId } },
  })

  const [putAction] = usePutSingleVehicleMileageMutation({
    onError: () => handleMutationResponse(true),
    onCompleted: ({ vehicleMileagePutV2: data }) => {
      if (data?.__typename === 'VehicleMileagePutModel' && data.internalId) {
        setLocalInternalId(parseInt(data.internalId, 10))
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
        setLocalInternalId(parseInt(data.internalId, 10))
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
      case 'posting':
        postToServer()
        return
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
    if (!value && skipEmpty) return
    const isValid = await trigger(formFieldId)
    if (isValid) return Number(value)
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
                mileageData.vehicleMileageDetails.data[0].internalId,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mileageData?.vehicleMileageDetails, vehicle.vehicleId, localInternalId])

  const unit = (vehicle.hasMilesOdometer ? 'mi' : 'km') as 'mi' | 'km'
  const displayDate = localDate ?? vehicle.lastMileageRegistration?.date
  const displayMileage = localMileage ?? vehicle.lastMileageRegistration?.mileage

  const nestedTable = useMemo(() => {
    if (!data?.vehiclesMileageRegistrationHistory) return [[]]
    const tableData: Array<Array<string>> = [[]]
    for (const reg of data.vehiclesMileageRegistrationHistory
      .mileageRegistrationHistory ?? []) {
      if (reg) {
        tableData.push([
          formatDate(reg.date),
          reg.originCode,
          displayWithUnit(reg.mileage, unit, true),
        ])
      }
    }
    return tableData
  }, [data?.vehiclesMileageRegistrationHistory, unit])

  return {
    postStatus,
    postError,
    showSubdata,
    unit,
    displayDate,
    displayMileage,
    nestedTable,
    data,
    loading,
    error,
    executeRegistrationsQuery,
    control,
    onInputChange,
    onSaveButtonClick,
  }
}
