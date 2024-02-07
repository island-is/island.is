import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { formatText } from '@island.is/application/core'
import { getSelectedVehicle } from '../../utils'
import { VehiclesCurrentVehicle } from '../../shared'

export const MileageField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { application, error } = props

  const currentVehicle = getSelectedVehicle(
    application.externalData,
    application.answers,
  ) as VehiclesCurrentVehicle

  const required = currentVehicle.requireMileage || false

  setValue('vehicleMileage.isRequired', required)

  return (
    <Box paddingTop={2}>
      <InputController
        id={props.field.id}
        label={formatText(props.field.title, application, formatMessage)}
        error={error}
        type="number"
        backgroundColor="blue"
        required={required}
      />
    </Box>
  )
}
