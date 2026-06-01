import { useState } from 'react'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  NestedFullTable,
  m,
} from '@island.is/portals/my-pages/core'
import { InputController } from '@island.is/shared/form-fields'
import AnimateHeight from 'react-animate-height'
import format from 'date-fns/format'
import { VehicleBulkMileageSubData } from '../VehicleBulkMileageSubData'
import { vehicleMessage } from '../../../lib/messages'
import { displayWithUnit } from '../../../utils/displayWithUnit'
import { VehicleType } from '../types'
import { useVehicleBulkMileageRowState } from './useVehicleBulkMileageRowState'

interface Props {
  vehicle: VehicleType
  onMileageUpdateCallback?: () => void
}

export const VehicleBulkMileageMobileCardRow = ({
  vehicle,
  onMileageUpdateCallback,
}: Props) => {
  const { formatMessage } = useLocale()
  const [expanded, setExpanded] = useState(false)

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

  const onToggleExpand = () => {
    if (!expanded) {
      executeRegistrationsQuery()
    }
    setExpanded((prev) => !prev)
  }

  const isLoading = postStatus === 'posting' || postStatus === 'waiting'
  const isSuccess = postStatus === 'success'
  const isError = postStatus === 'error'

  const mobileInputId = `mobile-${vehicle.vehicleId}`

  const children = error ? (
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
  )

  return (
    <Box
      paddingTop={3}
      marginBottom={expanded ? 2 : 0}
      background={expanded ? 'blue100' : undefined}
      style={{ borderBottom: expanded ? undefined : '1px solid #d2d2d2' }}
    >
      {/* Header: title + expand toggle */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="flexStart"
        marginBottom={1}
      >
        <Box>
          <Text variant="h4" as="h2" color="blue400" translate="no">
            {vehicle.vehicleType}
          </Text>
          <Text variant="small" color="dark300" translate="no">
            {vehicle.vehicleId}
          </Text>
        </Box>
        <Box marginLeft={1}>
          <Button
            title={
              expanded ? formatMessage(m.collapse) : formatMessage(m.expand)
            }
            circle
            icon={expanded ? 'remove' : 'add'}
            onClick={onToggleExpand}
            colorScheme="light"
          />
        </Box>
      </Box>

      {/* Key-value data rows */}
      <Box marginBottom={2}>
        <Stack space={1}>
          <Box display="flex" flexDirection="row">
            <Box width="half" display="flex" alignItems="center">
              <Text fontWeight="semiBold" variant="default">
                {formatMessage(vehicleMessage.lastRegistered)}
              </Text>
            </Box>
            <Box width="half">
              <Text variant="default">
                {displayDate ? format(displayDate, 'dd.MM.yyyy') : '-'}
              </Text>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row">
            <Box width="half" display="flex" alignItems="center">
              <Text fontWeight="semiBold" variant="default">
                {formatMessage(vehicleMessage.lastStatus)}
              </Text>
            </Box>
            <Box width="half">
              <Text variant="default">
                {displayMileage !== null && displayMileage !== undefined
                  ? displayWithUnit(displayMileage, unit, true)
                  : '-'}
              </Text>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Action area: input + save (or success message) */}
      <Box width="full" marginY={1}>
        {isSuccess ? (
          <AlertMessage
            type="success"
            aria-live="polite"
            message={formatMessage(vehicleMessage.mileagePostSuccess)}
          />
        ) : (
          <Stack space={1}>
            <Text variant="small" fontWeight="semiBold">
              {formatMessage(vehicleMessage.odometerBulkColumn)}
            </Text>
            <InputController
              control={control}
              id={mobileInputId}
              name={vehicle.vehicleId}
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
              aria-describedby={
                postError ? `${mobileInputId}-error` : undefined
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
            <Button
              fluid
              size="small"
              type="button"
              loading={isLoading}
              variant="primary"
              disabled={isError || isSuccess}
              icon={isError ? 'closeCircle' : 'pencil'}
              onClick={onSaveButtonClick}
            >
              {isError
                ? formatMessage(m.errorTitle)
                : formatMessage(m.save)}
            </Button>
          </Stack>
        )}
      </Box>

      {/* Expandable history */}
      <AnimateHeight height={expanded ? 'auto' : 0} duration={800}>
        <Box paddingTop={2} paddingBottom={3}>
          <Divider />
        </Box>
        <Box paddingBottom={3}>{children}</Box>
      </AnimateHeight>
    </Box>
  )
}
