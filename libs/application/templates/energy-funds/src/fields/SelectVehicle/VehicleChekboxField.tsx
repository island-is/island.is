import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '../../shared/types'
import { FC, useEffect, useState } from 'react'
import { Box, Tag } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { information } from '../../lib/messages/information'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import format from 'date-fns/format'
import { formatIsk } from '../../utils'
interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleCheckboxField: FC<
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

  const onCheckboxControllerSelect = (s: string) => {
    setCurrentVehicle(currentVehicleList.find((x) => x.permno === s))
  }

  useEffect(() => {
    if (currentVehicle) {
      setValue('selectVehicle.plate', currentVehicle.permno || '')
      setValue('selectVehicle.vin', currentVehicle.vin || '')
      setValue('selectedVehicle.grantAmount', currentVehicle.vehicleGrant)
    }
  }, [currentVehicle])

  const vehicleCheckboxes = currentVehicleList.map(
    (vehicle: VehiclesCurrentVehicle) => {
      const isCheckable = !vehicle.hasReceivedSubsidy

      return {
        value: vehicle.permno ?? '',
        label: `${vehicle.make ?? ''} - ${vehicle.permno}`,
        excludeOthers: true,
        subLabel: `${vehicle.color} - ${formatMessage(
          information.labels.pickVehicle.registrationDate,
        )}: ${
          vehicle.firstRegistrationDate &&
          format(new Date(vehicle.firstRegistrationDate), 'dd.MM.yyyy')
        }`,
        rightContent: (
          <div style={{ display: 'flex' }}>
            <div style={{ paddingRight: 15 }}>
              {!isCheckable ? (
                <Tag disabled variant="red">
                  {formatMessage(
                    information.labels.pickVehicle.checkboxNotCheckable,
                  )}
                </Tag>
              ) : (
                <Tag outlined={true} disabled variant={'blue'}>
                  {formatMessage(
                    information.labels.pickVehicle.checkboxCheckableTag,
                    {
                      amount: vehicle.vehicleGrant
                        ? `${formatIsk(vehicle.vehicleGrant)}`
                        : '',
                    },
                  )}
                </Tag>
              )}
            </div>
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
            id: `${field.id}.plate`,
            title: '',
            large: true,
            backgroundColor: 'blue',
            width: 'full',
            type: FieldTypes.CHECKBOX,
            component: FieldComponents.CHECKBOX,
            children: undefined,
            options: vehicleCheckboxes,
            onSelect: (newAnswer) => {
              onCheckboxControllerSelect(newAnswer[0])
            },
          }}
        />
      </Box>
    </Box>
  )
}
