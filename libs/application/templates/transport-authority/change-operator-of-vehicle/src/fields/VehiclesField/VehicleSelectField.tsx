import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { Box, CategoryCard, SkeletonLoader } from '@island.is/island-ui/core'
import { VehiclesCurrentVehicle } from '@island.is/api/schema'
import { information } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<
  VehicleSearchFieldProps & FieldBaseProps
> = ({ currentVehicleList, application }) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const currentVehicle = currentVehicleList[parseInt(vehicleValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState<VehiclesCurrentVehicle | null>(
    currentVehicle && currentVehicle.permno
      ? {
          permno: currentVehicle.permno,
          make: currentVehicle?.make || '',
          color: currentVehicle?.color || '',
          role: currentVehicle?.role,
          isStolen: currentVehicle?.isStolen,
        }
      : null,
  )
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )
  const [color, setColor] = useState<string | undefined>(
    getValueViaPath(application.answers, 'pickVehicle.color', undefined) as
      | string
      | undefined,
  )

  const onChange = (option: Option) => {
    const currentVehicle = currentVehicleList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentVehicle.permno) {
      setSelectedVehicle({
        permno: currentVehicle.permno,
        make: currentVehicle?.make || '',
        color: currentVehicle?.color || '',
        role: currentVehicle?.role,
        isStolen: currentVehicle?.isStolen,
      })
      setPlate(currentVehicle.permno)
      setColor(currentVehicle.color || undefined)
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id="pickVehicle.vehicle"
        name="pickVehicle.vehicle"
        onSelect={(option) => onChange(option as Option)}
        options={currentVehicleList.map((vehicle, index) => {
          return {
            value: index.toString(),
            label: `${vehicle.make} - ${vehicle.permno}` || '',
          }
        })}
        placeholder={formatMessage(information.labels.pickVehicle.placeholder)}
        backgroundColor="blue"
      />
      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {selectedVehicle && (
              <CategoryCard
                heading={selectedVehicle.make || ''}
                text={`${selectedVehicle.color} - ${selectedVehicle.permno}`}
              />
            )}
          </Box>
        )}
      </Box>
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
    </Box>
  )
}
