import { FieldBaseProps, Option } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback } from 'react'
import {
  VehiclesCurrentVehicle,
  GetVehicleDetailInput,
} from '@island.is/api/schema'
import { information } from '../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyVehicleDetails } from '../hooks/useLazyVehicleDetails'

export const VehicleSelectField: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const currentVehicleList = application.externalData.currentVehicleList
    .data as VehiclesCurrentVehicle[]
  console.log(application)
  const getVehicleDetails = useLazyVehicleDetails()

  const onChange = (option: Option) => {
    console.log(option)
    getVehicleDetailsCallback({
      permno: option.value,
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => console.log(error))
  }

  const getVehicleDetailsCallback = useCallback(
    async ({ permno }: GetVehicleDetailInput) => {
      const { data } = await getVehicleDetails({
        input: {
          permno,
          regno: '',
          vin: '',
        },
      })
      return data
    },
    [getVehicleDetails],
  )
  return (
    <Box paddingTop={2}>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id="pickVehicle.vehicle"
        name="pickVehicle.vehicle"
        onSelect={(option) => onChange(option as Option)}
        options={currentVehicleList.map((vehicle) => {
          return { value: vehicle.permno || '', label: vehicle.permno || '' }
        })}
        placeholder="Veldu ökutæki"
        backgroundColor="blue"
      />
    </Box>
  )
}
