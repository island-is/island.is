import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import {
  useGetUsersMileageLazyQuery,
  usePutSingleVehicleMileageMutation,
  usePostSingleVehicleMileageMutation,
} from '../VehicleBulkMileage.generated'
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
  onSaveSuccess?: (vehicleId: string) => void
}

export const useVehicleBulkMileageRowState = ({
  vehicle,
  onMileageUpdateCallback,
  onSaveSuccess,
}: Props) => {
  const { formatMessage } = useLocale()
  const [postError, setPostError] = useState<string | null>(null)
  const [localInternalId, setLocalInternalId] = useState<number>()
  const [postStatus, setPostStatus] = useState<MutationStatus>('initial')

  const [putAction] = usePutSingleVehicleMileageMutation({
    onError: () => handleMutationResponse(true),
    onCompleted: ({ vehicleMileagePutV2: data }) => {
      if (data?.__typename === 'VehicleMileagePutModel' && data.internalId) {
        setLocalInternalId(parseInt(data.internalId, 10))
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
    const timer = setTimeout(() => {
      if (postStatus === 'success') {
        onMileageUpdateCallback?.()
        onSaveSuccess?.(vehicle.vehicleId)
        reset({ ...getValues(), [vehicle.vehicleId]: '' })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [
    getValues,
    onMileageUpdateCallback,
    onSaveSuccess,
    postStatus,
    reset,
    vehicle.vehicleId,
  ])

  useEffect(() => {
    switch (postStatus) {
      case 'posting':
        postToServer()
        return
      case 'waiting':
        if (mileageData?.vehicleMileageDetails) {
          setPostStatus('posting')
        } else if (mileageData !== undefined) {
          updateStatusAndMessage('error', formatMessage(m.errorTitle))
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
  ): Promise<number | undefined> => {
    const value = getValues(formFieldId)
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
    updateStatusAndMessage('waiting')
    try {
      const result =
        postStatus !== 'initial'
          ? await mileageRefetch()
          : await executeMileageQuery()
      if (result?.data?.vehicleMileageDetails) {
        setPostStatus('posting')
      } else {
        updateStatusAndMessage('error', formatMessage(m.errorTitle))
      }
    } catch {
      updateStatusAndMessage('error', formatMessage(m.errorTitle))
    }
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

  return {
    postStatus,
    postError,
    unit,
    control,
    onInputChange,
    onSaveButtonClick,
  }
}
