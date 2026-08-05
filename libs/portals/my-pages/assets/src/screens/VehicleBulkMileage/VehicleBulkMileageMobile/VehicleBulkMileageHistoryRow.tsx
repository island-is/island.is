import { useEffect, useMemo, useState } from 'react'
import { AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  NestedFullTable,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { Features, useFeatureFlagClient } from '@island.is/react/feature-flags'
import { useVehicleMileageRegistrationHistoryLazyQuery } from '../VehicleBulkMileage.generated'
import { VehicleBulkMileageSubData } from '../VehicleBulkMileageSubData'
import { vehicleMessage } from '../../../lib/messages'
import { displayWithUnit } from '../../../utils/displayWithUnit'
import { OdometerUnit, VehicleType } from '../types'

interface Props {
  vehicle: VehicleType
  unit: OdometerUnit
  refreshTrigger: number
}

export const VehicleBulkMileageHistoryRow = ({
  vehicle,
  unit,
  refreshTrigger,
}: Props) => {
  const { formatMessage } = useLocale()
  const [showSubdata, setShowSubdata] = useState(false)
  const featureFlagClient = useFeatureFlagClient()

  useEffect(() => {
    featureFlagClient
      .getValue(
        Features.isServicePortalVehicleBulkMileageSubdataPageEnabled,
        false,
      )
      .then((enabled) => {
        if (enabled) setShowSubdata(true)
      })
      .catch(() => undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [executeQuery, { data, loading, error, refetch }] =
    useVehicleMileageRegistrationHistoryLazyQuery({
      variables: { input: { permno: vehicle.vehicleId } },
    })

  useEffect(() => {
    executeQuery()
  }, [executeQuery])

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch?.()
    }
  }, [refreshTrigger, refetch])

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

  if (error) {
    return (
      <AlertMessage
        type="error"
        message={formatMessage(vehicleMessage.mileageHistoryFetchFailed)}
      />
    )
  }

  if (showSubdata) {
    return data?.vehiclesMileageRegistrationHistory ? (
      <VehicleBulkMileageSubData
        vehicleId={vehicle.vehicleId}
        data={data.vehiclesMileageRegistrationHistory}
        co2={vehicle.co2}
        loading={loading}
        unit={unit}
      />
    ) : (
      <EmptyTable
        background="blue100"
        loading={loading}
        message={formatMessage(vehicleMessage.mileageHistoryNotFound)}
      />
    )
  }

  return (
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
}
