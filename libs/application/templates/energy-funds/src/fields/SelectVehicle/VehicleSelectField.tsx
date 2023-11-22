import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { Box, CategoryCard, SkeletonLoader } from '@island.is/island-ui/core'

import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { information } from '../../lib/messages/information'
import { VehiclesCurrentVehicle } from '../../shared/types'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application, field }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'selectVehicle.plate',
    '',
  ) as string

  const [currentVehicle, setCurrentVehicle] = useState<
    VehiclesCurrentVehicle | undefined
  >(
    vehicleValue
      ? currentVehicleList.find((z) => z.permno === vehicleValue)
      : undefined,
  )

  const onChange = (option: Option) => {
    setCurrentVehicle(currentVehicleList.find((x) => x.permno === option.value))
  }

  useEffect(() => {
    if (currentVehicle) {
      setValue('selectVehicle.color', currentVehicle?.color || '')
      setValue('selectVehicle.type', currentVehicle?.make || '')
    }
  }, [currentVehicle])

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id={`${field.id}.plate`}
        defaultValue={currentVehicle?.permno}
        onSelect={(option) => onChange(option as Option)}
        options={currentVehicleList.map((vehicle) => {
          return {
            value: vehicle.permno,
            label: `${vehicle.make} - ${vehicle.permno}` || '',
          }
        })}
        placeholder={formatMessage(information.labels.pickVehicle.placeholder)}
        backgroundColor="blue"
      />
    </Box>
  )
}
