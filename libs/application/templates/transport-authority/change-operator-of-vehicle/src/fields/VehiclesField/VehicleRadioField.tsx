import { Box, Text } from '@island.is/island-ui/core'
import { FC, useState } from 'react'
import { VehiclesCurrentVehicle } from '@island.is/api/schema'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'

interface Option {
  value: string
  label: React.ReactNode
}

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleRadioField: FC<
  VehicleSearchFieldProps & FieldBaseProps
> = ({ currentVehicleList, application }) => {
  console.log(application, 'hello, jo jo')
  const { register } = useFormContext()

  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )
  const [color, setColor] = useState<string | undefined>(
    getValueViaPath(application.answers, 'pickVehicle.color', undefined) as
      | string
      | undefined,
  )

  const onRadioControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    setPlate(currentVehicle.permno || '')
    setColor(currentVehicle.color || undefined)
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
      <input
        type="hidden"
        value={plate}
        ref={register({ required: true })}
        name="pickVehicle.plate"
      />
      <input
        type="hidden"
        value={color}
        ref={register({ required: true })}
        name="pickVehicle.color"
      />
    </div>
  )
}
