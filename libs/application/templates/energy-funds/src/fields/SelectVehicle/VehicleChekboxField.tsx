import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '../../shared/types'
import { FC } from 'react'
import { Box, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { information } from '../../lib/messages/information'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { useFormContext } from 'react-hook-form'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleCheckboxField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application, field }) => {
  const { formatMessage } = useLocale()
  const { answers } = application

  const { setValue } = useFormContext()

  const onCheckboxControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    setValue('selectVehicle.plate', currentVehicle.permno || '')
  }

  const vehicleCheckboxes = currentVehicleList.map(
    (vehicle: VehiclesCurrentVehicle) => {
      const isCheckable = true //TOOD: CHECK IF VEHICLE HAS ALREADY RECEIVED A GRANT

      return {
        value: vehicle.permno ?? '',
        label: vehicle.make ?? '',
        excludeOthers: true,
        subLabel: `${vehicle.color} - ${vehicle.permno}`,
        rightContent: (
          <div style={{ display: 'flex' }}>
            {!isCheckable && (
              <div style={{ paddingRight: 15 }}>
                <Tag disabled variant="red">
                  {formatMessage(
                    information.labels.pickVehicle.checkboxNotCheckable,
                  )}
                </Tag>
              </div>
            )}
            <Tag
              outlined={!isCheckable ? false : true}
              disabled
              variant={!isCheckable ? 'red' : 'blue'}
            >
              {formatMessage(
                information.labels.pickVehicle.checkboxCheckableTag,
                {
                  amount: '900 þús', //TODO
                },
              )}
            </Tag>
          </div>
        ),
        disabled: !isCheckable,
        checked: true,
      }
    },
  )

  return (
    <Box>
      <Box>
        <CheckboxFormField
          application={application}
          field={{
            id: field.id,
            title: 'Vehicles',
            large: true,
            backgroundColor: 'blue',
            width: 'full',
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            children: undefined,
            options: vehicleCheckboxes,
            onSelect: (newAnswer) => {
              onCheckboxControllerSelect(newAnswer[0])
              return { ...answers, selectVehicle: newAnswer[0] }
            },
          }}
        />
      </Box>
    </Box>
  )
}
