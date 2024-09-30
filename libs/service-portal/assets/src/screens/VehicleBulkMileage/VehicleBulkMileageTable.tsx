import { Table as T, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { EmptyTable, ExpandHeader } from '@island.is/service-portal/core'
import { vehicleMessage } from '../../lib/messages'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { SubmissionState, VehicleType } from './types'
import { VehicleBulkMileageRow } from './VehicleBulkMileageRow'

interface Props {
  vehicles: Array<VehicleType>
  loading: boolean
  updateVehicleStatus: (status: SubmissionState, vehicleId: string) => void
}

const VehicleBulkMileageTable = ({
  vehicles,
  loading,
  updateVehicleStatus,
}: Props) => {
  const { formatMessage } = useLocale()

  const { getValues, trigger } = useFormContext()

  const getValueFromForm = async (
    formFieldId: string,
    skipEmpty = false,
  ): Promise<number | undefined> => {
    const value = getValues(formFieldId)
    if (!value && skipEmpty) {
      return
    }
    if (await trigger(formFieldId)) {
      return value
    }
    return -1
  }

  const onRowPost = async (vehicleId: string) => {
    const formValue = await getValueFromForm(vehicleId)
    if (formValue && formValue > 0) {
      //post stuff
      updateVehicleStatus('success', vehicleId)
    } else {
      updateVehicleStatus('failure', vehicleId)
    }
  }

  const rows = useMemo(() => {
    return vehicles.map((item) => (
      <VehicleBulkMileageRow
        key={`vehicle-row-${item.vehicleId}`}
        vehicle={item}
        onSave={onRowPost}
      />
    ))
  }, [formatMessage, vehicles])

  return (
    <Box>
      <form>
        {rows && !loading && (
          <T.Table>
            <ExpandHeader
              data={[
                { value: '', printHidden: true },
                { value: formatMessage(vehicleMessage.type) },
                { value: formatMessage(vehicleMessage.permno) },
                //{ value: formatMessage(vehicleMessage.lastRegistration) },
                { value: formatMessage(vehicleMessage.odometer) },
                { value: '', printHidden: true },
              ]}
            />
            <T.Body>{rows}</T.Body>
          </T.Table>
        )}
        {(!rows.length || loading) && (
          <EmptyTable
            loading={loading}
            message={formatMessage(vehicleMessage.noVehiclesFound)}
          />
        )}
      </form>
    </Box>
  )
}

export default VehicleBulkMileageTable
