import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import { Box, CategoryCard, SkeletonLoader } from '@island.is/island-ui/core'
import {
  VehiclesCurrentVehicle,
  GetVehicleDetailInput,
  VehiclesCurrentVehicleWithFees,
} from '@island.is/api/schema'
import { information } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleDetails'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<
  VehicleSearchFieldProps & FieldBaseProps
> = ({ currentVehicleList, application }) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const currentVehicle = currentVehicleList[parseInt(vehicleValue, 10)]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState<VehiclesCurrentVehicleWithFees | null>(
    currentVehicle && currentVehicle.permno
      ? {
          permno: currentVehicle.permno,
          make: currentVehicle?.make || '',
          color: currentVehicle?.color || '',
          role: currentVehicle?.role,
          isStolen: currentVehicle?.isStolen,
          fees: {
            hasEncumbrances: false,
          },
        }
      : null,
  )
  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )

  const getVehicleDetails = useLazyVehicleDetails()

  const onChange = (option: Option) => {
    const currentVehicle = currentVehicleList[parseInt(option.value, 10)]
    setIsLoading(true)
    if (currentVehicle.permno) {
      getVehicleDetailsCallback({
        permno: currentVehicle.permno,
      })
        .then((response) => {
          setSelectedVehicle({
            permno: currentVehicle.permno,
            make: currentVehicle?.make || '',
            color: currentVehicle?.color || '',
            role: currentVehicle?.role,
            isStolen: currentVehicle?.isStolen,
            fees: response?.vehicleFeesByPermno?.fees,
          })
          setPlate(
            !!currentVehicle?.isStolen ||
              !!response?.vehicleFeesByPermno?.fees?.hasEncumbrances
              ? ''
              : currentVehicle.permno || '',
          )
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    }
  }

  const getVehicleDetailsCallback = useCallback(
    async ({ permno }: GetVehicleDetailInput) => {
      const { data } = await getVehicleDetails({
        permno,
      })
      return data
    },
    [getVehicleDetails],
  )

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id="pickVehicle.vehicle"
        name="pickVehicle.vehicle"
        onSelect={(option) => onChange(option as Option)}
        options={currentVehicleList.map((vehicle, index) => {
          return {
            value: index.toString(),
            label: `${vehicle.make} - ${vehicle.permno}` || '',
          }
        })}
        placeholder={formatMessage(information.labels.pickVehicle.placeholder)}
        backgroundColor="blue"
      />
      <Box paddingTop={3}>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box>
            {selectedVehicle && (
              <CategoryCard
                colorScheme={
                  !!selectedVehicle.isStolen ||
                  selectedVehicle.fees?.hasEncumbrances
                    ? 'red'
                    : 'blue'
                }
                heading={selectedVehicle.make || ''}
                text={`${selectedVehicle.color} - ${selectedVehicle.permno}`}
                tags={
                  selectedVehicle.isStolen
                    ? selectedVehicle.fees?.hasEncumbrances
                      ? [
                          {
                            label: formatMessage(
                              information.labels.pickVehicle.isStolenTag,
                            ),
                          },
                          {
                            label: formatMessage(
                              information.labels.pickVehicle.hasEncumbrancesTag,
                            ),
                          },
                        ]
                      : [
                          {
                            label: formatMessage(
                              information.labels.pickVehicle.isStolenTag,
                            ),
                          },
                        ]
                    : selectedVehicle.fees?.hasEncumbrances
                    ? [
                        {
                          label: formatMessage(
                            information.labels.pickVehicle.hasEncumbrancesTag,
                          ),
                        },
                      ]
                    : []
                }
              />
            )}
          </Box>
        )}
      </Box>
      <input
        type="hidden"
        value={plate}
        ref={register({ required: true })}
        name="pickVehicle.plate"
      />
    </Box>
  )
}
