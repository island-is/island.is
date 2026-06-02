import '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'
import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'
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
  const isExpanded = row.getIsExpanded()
  const inputBackground = isExpanded ? 'white' : 'blue'

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
    const saveLabel = `${formatMessage(m.save)} – ${row.original.vehicleId}`
    return (
      <Stack space={1}>
        <Text id={`${mobileId}-label`} variant="default" fontWeight="semiBold">
          {formatMessage(vehicleMessage.odometerBulkColumn)}
        </Text>
        <Box
          display="flex"
          alignItems="flexStart"
          justifyContent="spaceBetween"
          columnGap={2}
        >
          <Box
            flexGrow={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSaveButtonClick()
              }
            }}
          >
            <InputController
              control={control}
              id={mobileId}
              name={row.original.vehicleId}
              aria-labelledby={`${mobileId}-label`}
              backgroundColor={inputBackground}
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
          </Box>
          <Box flexGrow={0}>
            <Button
              fluid
              size="small"
              type="button"
              loading={isLoading}
              variant="primary"
              disabled={isError}
              icon={isError ? 'closeCircle' : 'pencil'}
              onClick={onSaveButtonClick}
              aria-label={saveLabel}
            >
              {isError ? formatMessage(m.errorTitle) : formatMessage(m.save)}
            </Button>
          </Box>
        </Box>
      </Stack>
    )
  }

  const desktopId = row.original.vehicleId
  const saveLabel = `${formatMessage(m.save)} – ${desktopId}`
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="spaceBetween"
      columnGap={2}
    >
      <Box
        className={styles.mwInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onSaveButtonClick()
          }
        }}
      >
        <Text
          id={`${desktopId}-label`}
          className={helperStyles.srOnly}
          variant="default"
        >
          {formatMessage(vehicleMessage.odometerBulkColumn)}
        </Text>
        <InputController
          control={control}
          id={desktopId}
          name={desktopId}
          aria-labelledby={`${desktopId}-label`}
          backgroundColor={inputBackground}
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
          aria-describedby={postError ? `${desktopId}-error` : undefined}
          rules={inputRules}
        />
      </Box>
      <VehicleBulkMileageSaveButton
        submissionStatus={isError ? 'error' : isLoading ? 'loading' : 'idle'}
        onClick={onSaveButtonClick}
        disabled={isError}
        ariaLabel={saveLabel}
      />
    </Box>
  )
}
