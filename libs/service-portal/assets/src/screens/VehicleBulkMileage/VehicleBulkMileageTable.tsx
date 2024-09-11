import { Table as T, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  EmptyTable,
  ExpandHeader,
  NestedFullTable,
  formatDate,
} from '@island.is/service-portal/core'
import { vehicleMessage } from '../../lib/messages'
import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { SubmissionState, VehicleType } from './types'
import { VehicleBulkMileageRow } from './VehicleBulkMileageRow'
import { useVehicleMileageRegistrationHistoryLazyQuery } from './VehicleBulkMileage.generated'
import { displayWithUnit } from '../../utils/displayWithUnit'

interface Props {
  vehicles: Array<VehicleType>
  updateVehicleStatus: (status: SubmissionState, vehicleId: string) => void
}

const VehicleBulkMileageTable = ({ vehicles, updateVehicleStatus }: Props) => {
  const { formatMessage } = useLocale()

  const [executeRegistrationsQuery, { data, loading, error }] =
    useVehicleMileageRegistrationHistoryLazyQuery()

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
      console.log('validation success')
      return value
    }
    // -1 if validation failure
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
        onExpandRow={() =>
          executeRegistrationsQuery({
            variables: {
              input: {
                permno: item.vehicleId,
              },
            },
          })
        }
      >
        <NestedFullTable
          headerArray={[
            formatMessage(vehicleMessage.date),
            formatMessage(vehicleMessage.registration),
            formatMessage(vehicleMessage.annualUsage),
            formatMessage(vehicleMessage.odometer),
          ]}
          loading={loading}
          emptyMessage="Engar fyrri skráningar fundust"
          data={
            data?.vehiclesMileageRegistrationHistory?.mileageRegistrationHistory?.map(
              (r) => [
                formatDate(r.date),
                r.originCode,
                '-',
                displayWithUnit(r.mileage, 'km', true),
              ],
            ) ?? []
          }
        />
      </VehicleBulkMileageRow>
    ))
  }, [formatMessage, vehicles])

  return (
    <>
      <Box>
        <form>
          {rows && (
            <T.Table>
              <ExpandHeader
                data={[
                  { value: '', printHidden: true },
                  { value: formatMessage(vehicleMessage.type) },
                  { value: formatMessage(vehicleMessage.permno) },
                  { value: formatMessage(vehicleMessage.lastRegistration) },
                  { value: formatMessage(vehicleMessage.odometer) },
                  { value: '', printHidden: true },
                ]}
              />
              <T.Body>{rows}</T.Body>
            </T.Table>
          )}
          {!rows.length && <EmptyTable message="Engin ökutæki fundust" />}
        </form>
      </Box>
      {/*<Box marginTop={2} display="flex">
        <Box marginLeft="auto">
          <Button onClick={() => onBulkPostClick()}>
            {formatMessage(vehicleMessage.saveAllVisible)}
          </Button>
        </Box>
      </Box> */}
    </>
  )
}

export default VehicleBulkMileageTable
