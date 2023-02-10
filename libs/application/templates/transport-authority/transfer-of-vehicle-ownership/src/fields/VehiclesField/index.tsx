import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useEffect } from 'react'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'
import { useFormContext } from 'react-hook-form'
import { VehiclesCurrentVehicle } from '../../shared'

export const VehiclesField: FC<FieldBaseProps> = (props) => {
  const { setValue } = useFormContext()
  const { application } = props
  const currentVehicleList = application.externalData.currentVehicleList
    .data as VehiclesCurrentVehicle[]
  useEffect(() => {
    setValue('sellerCoOwner', [])
  }, [setValue])
  return (
    <Box paddingTop={2}>
      {currentVehicleList.length > 5 ? (
        <VehicleSelectField
          currentVehicleList={currentVehicleList}
          {...props}
        />
      ) : (
        <VehicleRadioField currentVehicleList={currentVehicleList} {...props} />
      )}
    </Box>
  )
}
