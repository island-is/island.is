import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { information } from '../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'

export const VehicleSelectField: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const onChange = (value: any) => {
    console.log(value)
  }
  return (
    <Box paddingTop={2}>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id="pickVehicle.vehicle"
        name="pickVehicle.vehicle"
        onSelect={onChange}
        options={[
          {
            label: 'OL712',
            value: 'OL712',
          },
          {
            label: 'OL713',
            value: 'OL713',
          },
        ]}
        placeholder="Veldu ökutæki"
        backgroundColor="blue"
      />
    </Box>
  )
}
