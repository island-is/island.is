import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useEffect } from 'react'
import { VehiclesCurrentVehicle } from '../../shared'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'
import { useFormContext } from 'react-hook-form'

export const VehiclesField: FC<FieldBaseProps> = (props) => {
  const { setValue } = useFormContext()
  const { application } = props
  const currentVehicleList = application.externalData.currentVehicleList
    .data as VehiclesCurrentVehicle[]
  useEffect(() => {
    setValue('ownerCoOwners', [])
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
