import { FieldBaseProps } from '@island.is/application/types'
import {
  ActionCard,
  AlertMessage,
  Box,
  Button,
  Divider,
  FocusableBox,
  Pagination,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useRef, useState } from 'react'

import { formatText, getErrorViaPath } from '@island.is/application/core'
import { Label } from '@island.is/application/ui-components'
import { InputController } from '@island.is/shared/form-fields'
import {
  filterVehiclesList,
  getApplicationAnswers,
} from '../../lib/carRecyclingUtils'
import { carRecyclingMessages, errorMessages } from '../../lib/messages'

import { useFormContext } from 'react-hook-form'

import { useDebounce } from 'react-use'
import { useVehicles } from '../../hooks'
import { FuelCodes } from '../../shared'
import { VehicleDto } from '../../shared/types'

const VehiclesOverview: FC<FieldBaseProps> = ({
  application,
  errors,
  error,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [page, setPage] = useState(1)
  const [permno, setPermno] = useState('')
  const skipEffect = useRef(false)
  const [currentVehiclesList, setCurrentVehiclesList] = useState<VehicleDto[]>(
    [],
  )
  const [selectedVehiclesList, setSelectedVehiclesList] = useState<
    VehicleDto[]
  >([])

  const [canceledVehiclesList, setCanceledVehiclesList] = useState<
    VehicleDto[]
  >([])

  const {
    getVehicles,
    data: qlVehiclesData,
    loading: loadingCurrent,
  } = useVehicles()

  const qlVehicleList = qlVehiclesData?.vehiclesListV2
    .vehicleList as VehicleDto[]
  const qlPaging = qlVehiclesData?.vehiclesListV2.paging

  useDebounce(
    () => {
      if (permno !== '') {
        getVehicles(1, permno)
      } else {
        // if on 1 page when starting to search, the page is cached so we need to call backend directly
        // else on other pages we can just set page to 1
        if (page === 1) {
          getVehicles(1, '')
        } else {
          setPage(1)
        }
      }
      skipEffect.current = false
    },
    500,
    [permno],
  )

  useEffect(() => {
    // Skip getting paged data if using search
    if (!skipEffect.current) {
      getVehicles(page, permno)
    }
  }, [page])

  useEffect(() => {
    if (qlVehicleList) {
      // Mark selected vechicles in currentVehicles List as markedForRecycling
      const updatedAllVehicles = qlVehicleList.map((vehicle) => {
        const isSelected = selectedVehiclesList.find((selectedVehicle) => {
          return selectedVehicle.permno === vehicle.permno
        })
        if (isSelected) {
          return {
            ...vehicle,
            markedForRecycling: true,
          }
        }
        return vehicle
      })

      setCurrentVehiclesList(updatedAllVehicles)
    }
  }, [qlVehiclesData, selectedVehiclesList])

  useEffect(() => {
    const { selectedVehicles, canceledVehicles, permnoSearch } =
      getApplicationAnswers(application.answers)

    setSelectedVehiclesList(selectedVehicles)
    setCanceledVehiclesList(canceledVehicles)
    setPermno(permnoSearch)
  }, [])

  useEffect(() => {
    setValue('vehicles.selectedVehicles', selectedVehiclesList)
    setValue('vehicles.canceledVehicles', canceledVehiclesList)
  }, [selectedVehiclesList, setValue])

  const getRoleLabel = (vehicle: VehicleDto): string => {
    if (vehicle.role === 'Eigandi') {
      return formatMessage(carRecyclingMessages.cars.owner)
    } else if (vehicle.role === 'Meðeigandi')
      return formatMessage(carRecyclingMessages.cars.coOwner)
    else {
      return formatMessage(carRecyclingMessages.cars.operator)
    }
  }

  const getUnavailableText = (vehicle: VehicleDto): string => {
    if (vehicle.markedForRecycling) {
      return formatMessage(carRecyclingMessages.cars.vehicleSelected)
    }

    return formatMessage(carRecyclingMessages.cars.onlyOwnerCanRecyle)
  }

  const onRecycle = (vehicle: VehicleDto): void => {
    // Force changes on selectedForRecycling and mileage to all selected vehicle objects to prevent ghost effects
    setSelectedVehiclesList((prevArray) =>
      prevArray.concat({
        ...vehicle,
        selectedForRecycling: vehicle.selectedForRecycling || false,
        mileage: vehicle.mileage || '',
      }),
    )

    // Remove selected vehicle from cancel list if user changes his mind about canceling recycling
    const filteredCanceledVehiclesList = filterVehiclesList(
      vehicle,
      canceledVehiclesList,
    )

    setCanceledVehiclesList(filteredCanceledVehiclesList)

    // Fix to add km into the input field
    if (!vehicle.mileage) {
      setValue(vehicle.permno + 'input', '')
    }
  }

  const onCancel = (vehicle: VehicleDto): void => {
    // Check if the vehicle has been selcted and submitted
    if (vehicle.selectedForRecycling) {
      // Keep bookeeping about canceled recycling
      setCanceledVehiclesList((prevArray) => prevArray.concat(vehicle))
    }

    // Remove the vehicle from the selected list
    const filteredSelectedVehiclesList = filterVehiclesList(
      vehicle,
      selectedVehiclesList,
    )

    setSelectedVehiclesList(filteredSelectedVehiclesList)
  }

  return (
    <Box id="vehicles">
      <Box paddingTop={2}>
        <InputController
          id="permnoSearch"
          defaultValue=""
          backgroundColor="blue"
          label={formatText(
            carRecyclingMessages.cars.search,
            application,
            formatMessage,
          )}
          onChange={(e) => {
            skipEffect.current = true
            setPage(1)
            setPermno(e.target.value)
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
      {selectedVehiclesList.map((vehicle: VehicleDto, index) => {
        const color = vehicle.color || vehicle.colorName

        return (
          <Box
            marginBottom={2}
            key={vehicle.permno + '-selected'}
            id="vehicles.selectedVehicles"
          >
            <FocusableBox
              key={vehicle.permno}
              borderRadius="large"
              borderColor="blue200"
              borderWidth="standard"
              flexDirection="column"
              color="blue"
              paddingX={4}
              paddingY={3}
            >
              <Box
                alignItems="flexStart"
                display="flex"
                flexDirection={['row']}
                justifyContent="spaceBetween"
                marginBottom={2}
                flexWrap={'wrap'}
              >
                <Text variant="h3" color={'blue400'}>
                  {vehicle.permno}
                </Text>

                <InputController
                  required={
                    vehicle.requiresMileageRegistration ||
                    Object.values(FuelCodes).includes(
                      vehicle.fuelCode as FuelCodes,
                    ) // Fuelcodes is not used any more. Kept to support old data
                  }
                  id={vehicle.permno + 'input'}
                  label={formatText(
                    carRecyclingMessages.cars.mileage,
                    application,
                    formatMessage,
                  )}
                  backgroundColor="blue"
                  placeholder="0"
                  size="sm"
                  type="number"
                  defaultValue={vehicle.mileage}
                  thousandSeparator
                  suffix=" "
                  error={
                    errors &&
                    getErrorViaPath(
                      errors,
                      `vehicles.selectedVehicles[${index}].mileage`,
                    )
                  }
                  onChange={(e) => {
                    const list = selectedVehiclesList.map((prevVehicle) =>
                      vehicle.permno === prevVehicle.permno
                        ? { ...vehicle, mileage: e.target.value }
                        : prevVehicle,
                    )

                    setSelectedVehiclesList(list)
                  }}
                />
              </Box>
              <Box
                display="flex"
                flexDirection={['column', 'column', 'column', 'row']}
                justifyContent="spaceBetween"
              >
                <Box style={{ flex: '0 0 50%' }}>
                  <Text>{`${vehicle.make}, ${color}`}</Text>
                </Box>
                <Box>
                  <Button
                    onClick={() => onCancel(vehicle)}
                    colorScheme="destructive"
                    variant="primary"
                    size="medium"
                  >
                    {formatMessage(carRecyclingMessages.cars.cancel)}
                  </Button>
                </Box>
              </Box>
            </FocusableBox>
          </Box>
        )
      })}

      {selectedVehiclesList.length !== 0 && <Divider />}
      <Box position="relative" marginBottom={3} paddingTop={2}>
        <Label>{formatMessage(carRecyclingMessages.cars.overview)}</Label>
      </Box>

      {loadingCurrent ? (
        <SkeletonLoader
          repeat={5}
          space={2}
          height={130}
          borderRadius="large"
        />
      ) : currentVehiclesList.length > 0 ? (
        currentVehiclesList.map((vehicle: VehicleDto) => {
          const color = vehicle.color || vehicle.colorName

          return (
            <Box
              marginBottom={2}
              key={vehicle.permno + '_currentbox'}
              id={vehicle.permno + '_currentbox'}
            >
              <ActionCard
                key={vehicle.permno}
                backgroundColor={vehicle.markedForRecycling ? 'blue' : 'white'}
                tag={{
                  label: getRoleLabel(vehicle),
                  variant: vehicle.role === 'Eigandi' ? 'dark' : 'red',
                  outlined: false,
                }}
                cta={{
                  icon: undefined,
                  size: 'small',
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
                text={`${vehicle.make}, ${color}`}
                unavailable={{
                  active:
                    vehicle.role !== 'Eigandi' || vehicle.markedForRecycling,
                  label: getUnavailableText(vehicle),
                }}
              />
            </Box>
          )
        })
      ) : qlPaging?.totalPages === 0 ? (
        <Box marginTop={3}>
          <AlertMessage
            type="warning"
            title=""
            message={formatMessage(carRecyclingMessages.cars.noVehicles)}
          />
        </Box>
      ) : null}

      {!loadingCurrent && qlPaging?.totalPages > 0 ? (
        <Box paddingTop={8}>
          <Pagination
            page={page}
            totalPages={qlPaging.totalPages}
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
          <AlertMessage
            type="error"
            title=""
            message={formatMessage(errorMessages.mustSelectAVehicle)}
          />
        </Box>
      )}
    </Box>
  )
}

export default VehiclesOverview
