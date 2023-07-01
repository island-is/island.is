import { Box, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { VehiclesCurrentVehicle } from '../../shared'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { FieldBaseProps } from '@island.is/application/types'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleRadioField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList }) => {
  const { setValue } = useFormContext()

  const onRadioControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    setValue('pickVehicle.plate', currentVehicle.permno || '')
  }

  const vehicleOptions = (vehicles: VehiclesCurrentVehicle[]) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Box>
              <Text variant="default" color="dark400">
                {vehicle.make}
              </Text>
              <Text variant="small" color="dark400">
                {vehicle.color} - {vehicle.permno}
              </Text>
            </Box>
          </Box>
        ),
      })
    }
    return options
  }

  return (
    <div>
      <RadioController
        id="pickVehicle.vehicle"
        largeButtons
        backgroundColor="blue"
        onSelect={onRadioControllerSelect}
        options={vehicleOptions(currentVehicleList)}
      />
    </div>
  )
}
