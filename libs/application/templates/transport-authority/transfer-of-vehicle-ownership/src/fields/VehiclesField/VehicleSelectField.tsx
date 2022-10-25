import { Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback } from 'react'
import {
  VehiclesCurrentVehicle,
  GetVehicleDetailInput,
} from '@island.is/api/schema'
import { information } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<VehicleSearchFieldProps> = ({
  currentVehicleList,
}) => {
  const { formatMessage } = useLocale()
  console.log(currentVehicleList)
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
    <SelectController
      label={formatMessage(information.labels.pickVehicle.vehicle)}
      id="pickVehicle.plate"
      name="pickVehicle.plate"
      onSelect={(option) => onChange(option as Option)}
      options={currentVehicleList.map((vehicle) => {
        return {
          value: vehicle.permno || '',
          label: `${vehicle.make} - ${vehicle.permno}` || '',
        }
      })}
      placeholder="Veldu ökutæki"
      backgroundColor="blue"
    />
  )
}
