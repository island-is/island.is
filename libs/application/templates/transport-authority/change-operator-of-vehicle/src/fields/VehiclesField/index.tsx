import { FieldBaseProps } from '@island.is/application/types'
import { Box, InputError } from '@island.is/island-ui/core'
import { FC, useEffect } from 'react'
import { VehiclesCurrentVehicle } from '@island.is/api/schema'
import { VehicleSelectField } from './VehicleSelectField'
import { VehicleRadioField } from './VehicleRadioField'
import { useLocale } from '@island.is/localization'
import { error } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'

export const VehiclesField: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { application, errors } = props
  console.log(application)
  const currentVehicleList = application.externalData.currentVehicleList
    .data as VehiclesCurrentVehicle[]
  useEffect(() => {
    setValue('sellerCoOwner', [])
  }, [setValue])
  return (
    <Box paddingTop={2}>
      {currentVehicleList.length > 10 ? (
        <VehicleSelectField
          currentVehicleList={currentVehicleList}
          {...props}
        />
      ) : (
        <VehicleRadioField currentVehicleList={currentVehicleList} {...props} />
      )}
      {errors && errors.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </Box>
  )
}
