import { FieldBaseProps } from '@island.is/application/types'
import {
  ActionCard,
  AlertMessage,
  Box,
  Pagination,
} from '@island.is/island-ui/core'
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

const VehiclesOverview: FC<FieldBaseProps> = ({ application, error }) => {
  const { formatMessage } = useLocale()

  const [currentVehiclesList, setCurrentVehiclesList] = useState<
    VehicleMiniDto[]
  >([])
  const [selectedVehiclesList, setSelectedVehiclesList] = useState<
    VehicleMiniDto[]
  >([])
  const [allVehiclesList, setAllVehiclesList] = useState<VehicleMiniDto[]>([])

  const [canceledVehiclesList, setCanceledVehiclesList] = useState<
    VehicleMiniDto[]
  >([])

  const { setValue } = useFormContext()

  const [page, setPage] = useState(1)

  const ITEMS_ON_PAGE = 8
  const totalPages =
    allVehiclesList.length > ITEMS_ON_PAGE
      ? Math.ceil(allVehiclesList.length / ITEMS_ON_PAGE)
      : 0

  useEffect(() => {
    const { selectedVehicles, allVehicles } = getApplicationAnswers(
      application.answers,
    )
    const { vehiclesList } = getApplicationExternalData(
      application.externalData,
    )

    if (selectedVehicles.length > 0) {
      setSelectedVehiclesList(selectedVehicles)
    }

    setAllVehiclesList(vehiclesList)

    if (selectedVehicles.length > 0) {
      setCurrentVehiclesList(allVehicles)
    } else {
      setCurrentVehiclesList(vehiclesList)
    }
  }, [])

  useEffect(() => {
    setValue('vehicles.selectedVehicles', selectedVehiclesList)
    setValue('vehicles.allVehicles', currentVehiclesList)
    setValue('vehicles.canceledVehicles', canceledVehiclesList)
  }, [selectedVehiclesList, setValue])

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
    setSelectedVehiclesList([...selectedVehiclesList, { ...vehicle }])

    // Remove selected vehicle from current list
    const filterdVehiclesList = filterVehiclesList(vehicle, currentVehiclesList)
    setCurrentVehiclesList(filterdVehiclesList)

    // Remove selected vehicle from cancel list if user changes his mind about canceling recycling
    const filteredCanceledVehiclesList = filterVehiclesList(
      vehicle,
      canceledVehiclesList,
    )

    setCanceledVehiclesList(filteredCanceledVehiclesList)
  }

  function onCancel(vehicle: VehicleMiniDto): void {
    const filteredSelectedVehiclesList = filterVehiclesList(
      vehicle,
      selectedVehiclesList,
    )

    setSelectedVehiclesList(filteredSelectedVehiclesList)

    // Add selected vehicle back to the non selected list
    setCurrentVehiclesList((vehicles: VehicleMiniDto[]) => [
      vehicle,
      ...vehicles,
    ])

    // Keep bookkeeping about canceled recycling
    setCanceledVehiclesList((vehicles: VehicleMiniDto[]) => [
      vehicle,
      ...vehicles,
    ])
  }

  return (
    <Box id="vehicles">
      <Box paddingTop={2}>
        <InputController
          id="vehiclesList.input"
          defaultValue=""
          backgroundColor="blue"
          label={formatText(
            carRecyclingMessages.cars.filter,
            application,
            formatMessage,
          )}
          onChange={(e) => {
            if (page !== 1) {
              setPage(1)
            }
            const filteredList = allVehiclesList.filter((vehicle) =>
              vehicle.permno
                ?.toLowerCase()
                .includes(e.target.value.toLowerCase()),
            )

            // Not show selected vehicles in filered list
            const result = filterSelectedVehiclesFromList(
              selectedVehiclesList,
              filteredList,
            )

            setCurrentVehiclesList(result)
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
          <Box marginBottom={2} key={index} id="vehicles.selectedVehicles">
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

      {currentVehiclesList
        .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
        .map((vehicle: VehicleMiniDto, index) => {
          return (
            <Box
              marginBottom={2}
              key={index + '_currentbox'}
              id="vehicles.allVehicles"
            >
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
      {totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={totalPages}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPage(page)}
              >
                {children}
              </Box>
            )}
          />
        </Box>
      ) : null}

      {error && selectedVehiclesList.length === 0 && (
        <Box marginTop={3}>
          <AlertMessage type="error" title="" message={error} />
        </Box>
      )}
    </Box>
  )
}

export default VehiclesOverview
