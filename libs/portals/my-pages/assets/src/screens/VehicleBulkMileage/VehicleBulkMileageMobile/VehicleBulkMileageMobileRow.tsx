import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  ExpandRow,
  NestedFullTable,
} from '@island.is/portals/my-pages/core'
import { InputController } from '@island.is/shared/form-fields'
import format from 'date-fns/format'
import { VehicleBulkMileageSaveButton } from '../VehicleBulkMileageSaveButton'
import * as styles from '../VehicleBulkMileage.css'
import { VehicleBulkMileageSubData } from '../VehicleBulkMileageSubData'
import { vehicleMessage } from '../../../lib/messages'
import { displayWithUnit } from '../../../utils/displayWithUnit'
import { VehicleType } from '../types'
import { useVehicleBulkMileageRowState } from './useVehicleBulkMileageRowState'

interface Props {
  vehicle: VehicleType
  onMileageUpdateCallback?: () => void
}

export const VehicleBulkMileageMobileRow = ({
  vehicle,
  onMileageUpdateCallback,
}: Props) => {
  const { formatMessage } = useLocale()
  const {
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
  } = useVehicleBulkMileageRowState({ vehicle, onMileageUpdateCallback })

  return (
    <ExpandRow
      key={`bulk-mileage-vehicle-row-${vehicle.vehicleId}`}
      onExpandCallback={executeRegistrationsQuery}
      data={[
        {
          value: (
            <Box style={{ maxWidth: '200px' }}>
              <Text translate="no" variant="medium">
                {vehicle.vehicleType}
              </Text>
              <Text translate="no" variant="small">
                {vehicle.vehicleId}
              </Text>
            </Box>
          ),
        },
        {
          value: displayDate ? format(displayDate, 'dd.MM.yyyy') : '-',
        },
        {
          value:
            displayMileage !== null && displayMileage !== undefined
              ? displayWithUnit(displayMileage, unit, true)
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
                placeholder={unit}
                type="number"
                suffix={' ' + unit}
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
                    message: formatMessage(vehicleMessage.mileageInputMinLength),
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
          message={formatMessage(vehicleMessage.mileagePostSuccess)}
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
            data={data.vehiclesMileageRegistrationHistory}
            co2={vehicle.co2}
            loading={loading}
            unit={unit}
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
