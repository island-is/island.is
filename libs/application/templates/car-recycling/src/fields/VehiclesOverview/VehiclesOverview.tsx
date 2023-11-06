import { FieldBaseProps } from '@island.is/application/types'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'

import { formatText } from '@island.is/application/core'
import { Label } from '@island.is/application/ui-components'
import { InputController } from '@island.is/shared/form-fields'
import { getApplicationExternalData } from '../../lib/carRecyclingUtils'
import { carRecyclingMessages } from '../../lib/messages'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'

import { VehicleMiniDto } from '@island.is/clients/vehicles'

const VehiclesOverview: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage, locale } = useLocale()

  const [currentVehiclesList, setVehiclesList] = useState<VehicleMiniDto[]>([])
  const [selectedVehiclesList, setSelectedVehiclesList] = useState<
    VehicleMiniDto[]
  >([])
  const [allVehiclesList, setAllVehiclesList] = useState<VehicleMiniDto[]>([])

  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const onUpdateApplication = async (vehicles: VehicleMiniDto[]) => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: { vehicles: { data: vehicles } },
        },
        locale,
      },
    })
  }

  useEffect(() => {
    const { vehiclesList } = getApplicationExternalData(
      application.externalData,
    )
    setAllVehiclesList(vehiclesList)
    setVehiclesList(vehiclesList)
  }, [application.externalData])

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
    selectedVehiclesList.push(vehicle)
    setSelectedVehiclesList(selectedVehiclesList)

    const filterdVehiclesList = currentVehiclesList.filter(
      (item) => item.permno !== vehicle.permno,
    )

    setVehiclesList(filterdVehiclesList)

    onUpdateApplication(selectedVehiclesList)
  }

  function cancel(vehicle: VehicleMiniDto): void {
    currentVehiclesList.unshift(vehicle)
    setSelectedVehiclesList(currentVehiclesList)

    const filteredSelectedVehiclesList = selectedVehiclesList.filter(
      (item) => item.permno !== vehicle.permno,
    )
    setSelectedVehiclesList(filteredSelectedVehiclesList)
    onUpdateApplication(filteredSelectedVehiclesList)
  }

  return (
    <Box>
      <Box paddingTop={2}>
        <InputController
          id="{nameFieldId}"
          defaultValue=""
          backgroundColor="blue"
          label={formatText(
            carRecyclingMessages.cars.filter,
            application,
            formatMessage,
          )}
          onChange={(e) => {
            const filteredList = allVehiclesList.filter((vehicle) =>
              vehicle.permno
                ?.toLowerCase()
                .includes(e.target.value.toLowerCase()),
            )

            // Not show selected vehicles in filered list
            const result = filteredList.filter(
              (vehicle1) =>
                !selectedVehiclesList.some(
                  (vehicle2) => vehicle1.permno === vehicle2.permno,
                ),
            )

            setVehiclesList(result)
          }}
        />
      </Box>

      <Box
        hidden={selectedVehiclesList.length === 0}
        position="relative"
        marginBottom={3}
        marginTop={3}
      >
        <Label>{formatMessage(carRecyclingMessages.cars.selectedTitle)}</Label>
      </Box>
      {selectedVehiclesList.map((vehicle: VehicleMiniDto, index) => {
        return (
          <Box marginBottom={2} key={index}>
            <ActionCard
              key={vehicle.permno}
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
            />
          </Box>
        )
      })}

      <hr hidden={selectedVehiclesList.length === 0} />
      <Box position="relative" marginBottom={3} marginTop={2}>
        <Label>{formatMessage(carRecyclingMessages.cars.overview)}</Label>
      </Box>

      {currentVehiclesList.map((vehicle: VehicleMiniDto, index) => {
        return (
          <Box marginBottom={2} key={index + '_currentbox'}>
            <ActionCard
              key={vehicle.permno}
              tag={{
                label: getRoleLabel(vehicle),
                variant: vehicle.role === 'Eigandi' ? 'dark' : 'red',
                outlined: false,
              }}
              cta={{
                icon: undefined,
                buttonType: {
                  variant: 'primary',
                  colorScheme: 'default',
                },
                label: formatMessage(carRecyclingMessages.cars.recycle),
                onClick: () => {
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
