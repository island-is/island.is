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

interface Props {
  vehicles: Array<VehicleType>
  updateVehicles: (newVehicles: Array<VehicleType>) => void
  updateVehicleStatus: (status: SubmissionState, vehicleId: string) => void
}

const VehicleBulkMileageTable = ({
  vehicles,
  updateVehicles,
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

  /*
  const onRowBulkPost = async (vehicleId: string) => {
    const formValue = await getValueFromForm(vehicleId, true)
    if (!formValue) {
      //no value, nothing to do
      updateVehicleStatus('waiting-idle', vehicleId)
    } else if (formValue && formValue > 0) {
      //post
      updateVehicleStatus('waiting-success', vehicleId)
    } else {
      //post
      updateVehicleStatus('waiting-failure', vehicleId)
    }
    }


  const onRowBulkPostComplete = async (vehicleId: string) => {
    const formKeys = Object.keys(getValues())
    const vehicleFormKeyIndex = formKeys.indexOf(vehicleId)

    if (vehicleFormKeyIndex < 0) {
      console.error('vehicle not found. Should not happen')
      return
    }
    if (vehicleFormKeyIndex === formKeys.length - 1) {
      const newVehicles = vehicles.map((v) => {
        if (v.submissionStatus !== 'idle') {
          return {
            ...v,
            submissionStatus: 'idle' as const,
          }
        }
        return v
      })
      updateVehicles(newVehicles)
    }


    const nextVehicleFormKeyIndex = vehicleFormKeyIndex + 1
    updateVehicleStatus('submit-all', formKeys[nextVehicleFormKeyIndex])
  }

  const onBulkPostClick = async () => {
    const firstVehicleId = Object.keys(getValues())[0]
    updateVehicleStatus('submit-all', firstVehicleId)
  }
*/
  const onRowSave = async (vehicleId: string) => {
    onRowPost(vehicleId)
  }

  const rows = useMemo(() => {
    return vehicles.map((item) => (
      <VehicleBulkMileageRow
        key={`vehicle-row-${item.vehicleId}`}
        vehicle={item}
        onSave={onRowSave}
        onPost={onRowPost}
        //onBulkPost={onRowBulkPost}
        //onBulkPostComplete={onRowBulkPostComplete}
      >
        <NestedFullTable
          headerArray={[
            formatMessage(vehicleMessage.date),
            formatMessage(vehicleMessage.registration),
            formatMessage(vehicleMessage.annualUsage),
            formatMessage(vehicleMessage.odometer),
          ]}
          data={
            item.registrationHistory?.map((r) => [
              formatDate(r.date),
              r.origin,
              '-',
              r.mileage.toString(),
            ]) ?? []
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
