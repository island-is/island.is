import { FieldBaseProps } from '@island.is/application/types'
import { ActionCard, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'

import { formatText } from '@island.is/application/core'
import { Label } from '@island.is/application/ui-components'
import { InputController } from '@island.is/shared/form-fields'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../lib/carRecyclingUtils'
import { carRecyclingMessages } from '../../lib/messages'

import { VehicleMiniDto } from '@island.is/clients/vehicles'
import { useFormContext } from 'react-hook-form'

const VehiclesOverview: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage, locale } = useLocale()

  const [currentVehiclesList, setVehiclesList] = useState<VehicleMiniDto[]>([])
  const [selectedVehiclesList, setSelectedVehiclesList] = useState<
    VehicleMiniDto[]
  >([])
  const [allVehiclesList, setAllVehiclesList] = useState<VehicleMiniDto[]>([])

  const { setValue } = useFormContext()

  useEffect(() => {
    const { vehiclesList } = getApplicationExternalData(
      application.externalData,
    )

    initSelectedList(vehiclesList)

    setAllVehiclesList(vehiclesList)
  }, [application.externalData])

  function filterSelectedVehiclesFromList(
    selectedList: VehicleMiniDto[],
    allVehicles: VehicleMiniDto[],
  ): VehicleMiniDto[] {
    // Not show selected vehicles in filered list
    return allVehicles.filter(
      (vehicle1) =>
        !selectedList.some((vehicle2) => vehicle1.permno === vehicle2.permno),
    )
  }

  function filterVehiclesList(
    vehicle: VehicleMiniDto,
    list: VehicleMiniDto[],
  ): VehicleMiniDto[] {
    return list.filter((item) => item.permno !== vehicle.permno)
  }

  function initSelectedList(allVehicles: VehicleMiniDto[]) {
    const { vehiclesList } = getApplicationAnswers(application.answers)

    const filtedList = filterSelectedVehiclesFromList(vehiclesList, allVehicles)

    console.log('initSelectedList', vehiclesList)

    setVehiclesList(filtedList)
    setSelectedVehiclesList(vehiclesList)
  }

  function getRoleLabel(vechicle: VehicleMiniDto): string {
    if (vechicle.role === 'Eigandi') {
      return formatMessage(carRecyclingMessages.cars.owner)
    } else if (vechicle.role === 'Meðeigandi')
      return formatMessage(carRecyclingMessages.cars.coOwner)
    else {
      return formatMessage(carRecyclingMessages.cars.operator)
    }
  }

  function onRecycle(vehicle: VehicleMiniDto): void {
    selectedVehiclesList.push(vehicle)
    setSelectedVehiclesList(selectedVehiclesList)

    const filterdVehiclesList = filterVehiclesList(vehicle, currentVehiclesList)

    setVehiclesList(filterdVehiclesList)

    console.log('onRecycle', selectedVehiclesList)

    // Save data to db
    setValue('vehiclesList', selectedVehiclesList)
  }

  function onCancel(vehicle: VehicleMiniDto): void {
    currentVehiclesList.unshift(vehicle)
    setSelectedVehiclesList(currentVehiclesList)

    const filteredSelectedVehiclesList = filterVehiclesList(
      vehicle,
      selectedVehiclesList,
    )

    setSelectedVehiclesList(filteredSelectedVehiclesList)

    // Save data to db
    setValue('vehiclesList', filteredSelectedVehiclesList)
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
            /*
            // Not show selected vehicles in filered list
            const result = filteredList.filter(
              (vehicle1) =>
                !selectedVehiclesList.some(
                  (vehicle2) => vehicle1.permno === vehicle2.permno,
                ),
            )*/

            // Not show selected vehicles in filered list
            const result = filterSelectedVehiclesFromList(
              selectedVehiclesList,
              filteredList,
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
                onClick: () => onCancel(vehicle),
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
                  onRecycle(vehicle)
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
