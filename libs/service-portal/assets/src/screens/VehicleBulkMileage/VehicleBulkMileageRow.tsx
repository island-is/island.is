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
import { useDebounce } from 'react-use'

const ORIGIN_CODE = 'ISLAND.IS'

interface Props {
  vehicle: VehicleType
}
export const VehicleBulkMileageRow = ({ vehicle }: Props) => {
  const { formatMessage } = useLocale()
  const [postError, setPostError] = useState<string | null>(null)
  const [postStatus, setPostStatus] = useState<
    'initial' | 'posting' | 'post-success' | 'put-success' | 'error'
  >('initial')

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
    onError: (e) => {
      setPostError(formatMessage(m.errorTitle))
      setPostStatus('error')
    },
    onCompleted: ({ vehicleMileagePutV2: data }) => {
      if (data?.__typename === 'VehiclesMileageUpdateError') {
        setPostError(data.message)
        setPostStatus('error')
      } else {
        setPostStatus('put-success')
      }
    },
  })

  const [postAction] = usePostSingleVehicleMileageMutation({
    onError: (e) => {
      setPostError(formatMessage(m.errorTitle))
      setPostStatus('error')
    },
    onCompleted: ({ vehicleMileagePostV2: data }) => {
      if (data?.__typename === 'VehiclesMileageUpdateError') {
        setPostError(data.message)
        setPostStatus('error')
      } else {
        setPostStatus('post-success')
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

  const postMileage = () => {
    const formerPostStatus = postStatus
    setPostError(null)
    setPostStatus('posting')
    if (formerPostStatus !== 'initial') {
      mileageRefetch()
    } else {
      executeMileageQuery()
    }
  }

  useDebounce(
    () => {
      if (postStatus === 'put-success' || postStatus === 'post-success') {
        registrationsRefetch()
      }
    },
    500,
    [postStatus, registrationsRefetch],
  )

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
    postMileage()
  }

  useEffect(() => {
    const post = async () => {
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

    if (mileageData?.vehicleMileageDetails) {
      post()
    }
  }, [mileageData?.vehicleMileageDetails])

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
                  : postStatus === 'posting'
                  ? 'loading'
                  : postStatus === 'post-success' ||
                    postStatus === 'put-success'
                  ? 'success'
                  : 'idle'
              }
              onClick={onSaveButtonClick}
            />
          ),
        },
      ]}
    >
      {(postStatus === 'post-success' || postStatus === 'put-success') && (
        <AlertMessage
          type="success"
          message={formatMessage(
            postStatus === 'post-success'
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
