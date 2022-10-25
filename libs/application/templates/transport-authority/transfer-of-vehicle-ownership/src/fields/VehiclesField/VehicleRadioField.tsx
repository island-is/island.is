import { FieldBaseProps } from '@island.is/application/types'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback } from 'react'
import {
  VehiclesCurrentVehicle,
  GetVehicleDetailInput,
} from '@island.is/api/schema'
import { information } from '../../lib/messages'
import {
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleRadioField: FC<VehicleSearchFieldProps> = ({
  currentVehicleList,
}) => {
  const { formatMessage } = useLocale()
  console.log(currentVehicleList)
  /* const getVehicleDetails = useLazyVehicleDetails()

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
  ) */

  const vehicleOptions = (vehicles: VehiclesCurrentVehicle[]) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      console.log(vehicle)
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="row">
            <Box>
              <Text variant="default">{vehicle.make}</Text>
              <Text variant="small">
                {vehicle.color} - {vehicle.permno}
              </Text>
            </Box>
            <Box display="flex" flexDirection="row" wrap="wrap">
              <Tag variant="red">Bifreið stolin</Tag>
              <Tag variant="red">Ógreidd bifreiðagjöld</Tag>
            </Box>
          </Box>
        ),
      })
    }
    return options
  }

  return (
    <RadioController
      id="pickVehicle.plate"
      largeButtons
      backgroundColor="blue"
      options={vehicleOptions(currentVehicleList)}
    />
  )
}
