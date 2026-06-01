import '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'
import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, useIsMobile } from '@island.is/portals/my-pages/core'
import { InputController } from '@island.is/shared/form-fields'
import type { CellContext } from '@tanstack/react-table'
import { vehicleMessage } from '../../../lib/messages'
import * as styles from '../VehicleBulkMileage.css'
import { VehicleBulkMileageSaveButton } from '../VehicleBulkMileageSaveButton'
import { VehicleType } from '../types'
import { useVehicleBulkMileageRowState } from './useVehicleBulkMileageRowState'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    onMileageUpdateCallback?: () => void
    onSaveSuccess?: (vehicleId: string) => void
  }
}

export const VehicleBulkMileageActionCell = ({
  row,
  table,
}: CellContext<VehicleType, unknown>) => {
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const { onMileageUpdateCallback, onSaveSuccess } = table.options.meta ?? {}

  const {
    postStatus,
    postError,
    unit,
    control,
    onInputChange,
    onSaveButtonClick,
  } = useVehicleBulkMileageRowState({
    vehicle: row.original,
    onMileageUpdateCallback,
    onSaveSuccess,
  })

  const isLoading = postStatus === 'posting' || postStatus === 'waiting'
  const isError = postStatus === 'error'
  const isSuccess = postStatus === 'success'

  if (isSuccess) {
    return (
      <Box aria-live="polite" aria-atomic="true">
        <AlertMessage
          type="success"
          message={formatMessage(vehicleMessage.mileagePostSuccess)}
        />
      </Box>
    )
  }

  const inputRules = {
    required: {
      value: true,
      message: formatMessage(vehicleMessage.mileageInputMinLength),
    },
    min: {
      value: 1,
      message: formatMessage(vehicleMessage.mileageInputPositive),
    },
  }

  if (isMobile) {
    const mobileId = `mobile-${row.original.vehicleId}`
    return (
      <Stack space={1}>
        <Text variant="default" fontWeight="semiBold">
          {formatMessage(vehicleMessage.odometerBulkColumn)}
        </Text>
        <InputController
          control={control}
          id={mobileId}
          name={row.original.vehicleId}
          backgroundColor="blue"
          placeholder={unit}
          type="number"
          suffix={' ' + unit}
          thousandSeparator
          decimalScale={0}
          size="sm"
          maxLength={12}
          defaultValue={''}
          onChange={onInputChange}
          error={postError ?? undefined}
          aria-invalid={!!postError}
          aria-describedby={postError ? `${mobileId}-error` : undefined}
          rules={inputRules}
        />
        <Button
          fluid
          size="small"
          type="button"
          loading={isLoading}
          variant="primary"
          disabled={isError}
          icon={isError ? 'closeCircle' : 'pencil'}
          onClick={onSaveButtonClick}
        >
          {isError ? formatMessage(m.errorTitle) : formatMessage(m.save)}
        </Button>
      </Stack>
    )
  }

  return (
    <Box display="flex" alignItems="center" columnGap={2}>
      <Box className={styles.mwInput}>
        <InputController
          control={control}
          id={row.original.vehicleId}
          name={row.original.vehicleId}
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
            postError ? `${row.original.vehicleId}-error` : undefined
          }
          rules={inputRules}
        />
      </Box>
      <VehicleBulkMileageSaveButton
        submissionStatus={isError ? 'error' : isLoading ? 'loading' : 'idle'}
        onClick={onSaveButtonClick}
        disabled={isError}
      />
    </Box>
  )
}
