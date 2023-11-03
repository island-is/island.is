import { FieldBaseProps } from '@island.is/application/types'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { VehicleMiniDto } from '@island.is/clients/vehicles'

import { formatText } from '@island.is/application/core'
import { Label } from '@island.is/application/ui-components'
import { InputController } from '@island.is/shared/form-fields'
import { getApplicationExternalData } from '../../lib/carRecyclingUtils'
import { carRecyclingMessages } from '../../lib/messages'

const VehiclesOverview: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  let { vehiclesList } = getApplicationExternalData(application.externalData)

  let selectedVehicles: any[] = []

  function getRoleLabel(vechicle: VehicleMiniDto): string {
    if (vechicle.role === 'Eigandi') {
      return formatMessage(carRecyclingMessages.cars.owner)
    } else if (vechicle.role === 'Meðeigandi')
      return formatMessage(carRecyclingMessages.cars.coOwner)
    else {
      return formatMessage(carRecyclingMessages.cars.operator)
    }
  }

  function recycle(vehicle: VehicleMiniDto): void {
    selectedVehicles.push(vehicle)
    vehiclesList = vehiclesList.filter((item) => item.permno !== vehicle.permno)

    console.log('RECYCLE', vehicle)
    console.log('selectedVehicles', selectedVehicles)
  }

  function cancel(car: VehicleMiniDto): void {
    // cars.push(car)
    selectedVehicles = selectedVehicles.filter(
      (item) => item.permno !== car.permno,
    )

    console.log('CANCEL')
  }

  return (
    <Box>
      <Box paddingTop={2}>
        <InputController
          id="{nameFieldId}"
          backgroundColor="blue"
          label={formatText(
            carRecyclingMessages.cars.filter,
            application,
            formatMessage,
          )}
          onChange={(e) => {
            //setValue(nameFieldId as string, e.target.value)
          }}
        />
      </Box>

      <Box position="relative" marginBottom={3} marginTop={3}>
        <Label>{formatMessage(carRecyclingMessages.cars.selectedTitle)}</Label>
      </Box>
      {selectedVehicles.map((vehicle: VehicleMiniDto, index) => {
        return (
          <Box marginBottom={2} key={index}>
            <ActionCard
              key={vehicle.permno}
              tag={{
                label: formatMessage(carRecyclingMessages.cars.coOwner),
                variant: 'red',
                outlined: true,
              }}
              cta={{
                icon: undefined,
                buttonType: {
                  variant: 'primary',
                  colorScheme: 'destructive',
                },
                label: formatMessage(carRecyclingMessages.cars.cancel),
                onClick: () => cancel(vehicle),
              }}
              heading={vehicle.permno || ''}
              text={`${vehicle.make}, ${vehicle.color}`}
              unavailable={{
                active: vehicle.role === 'Eigandi',
                label: formatMessage(
                  carRecyclingMessages.cars.onlyOwnerCanRecyle,
                ),
              }}
            />
          </Box>
        )
      })}

      <hr />
      <Box position="relative" marginBottom={3} marginTop={2}>
        <Label>{formatMessage(carRecyclingMessages.cars.overview)}</Label>
      </Box>

      {vehiclesList.map((vehicle: VehicleMiniDto, index) => {
        return (
          <Box marginBottom={2} key={index + '_currentbox'}>
            <ActionCard
              key={vehicle.permno}
              tag={{
                label: getRoleLabel(vehicle),
                variant: vehicle.role === 'Eigandi' ? 'dark' : 'red',
                outlined: true,
              }}
              cta={{
                icon: undefined,
                buttonType: {
                  variant: 'primary',
                  colorScheme: 'default',
                },
                label: formatMessage(carRecyclingMessages.cars.recycle),
                onClick: () => {
                  console.log('FOOOOO')
                  recycle(vehicle)
                },
              }}
              heading={vehicle.permno || ''}
              text={`${vehicle.make}, ${vehicle.color}`}
              unavailable={{
                active: vehicle.role !== 'Eigandi',
                label: formatMessage(
                  carRecyclingMessages.cars.onlyOwnerCanRecyle,
                ),
              }}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default VehiclesOverview
