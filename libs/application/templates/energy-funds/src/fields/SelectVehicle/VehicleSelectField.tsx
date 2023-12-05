import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  CategoryCard,
  SkeletonLoader,
} from '@island.is/island-ui/core'

import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { information } from '../../lib/messages/information'
import { VehiclesCurrentVehicle } from '../../shared/types'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleQuery'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application, field }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentVehicleDisabled, setCurrentVehicleDisabled] = useState(false)
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

  const onChange = (option: Option) => {
    const currentVehicle = currentVehicleList.find(
      (x) => x.permno === option.value,
    )
    setIsLoading(true)
    if (currentVehicle && currentVehicle.vin) {
      getVehicleDetailsCallback({
        vin: currentVehicle.vin,
      })
        .then((response) => {
          setCurrentVehicle({
            permno: currentVehicle.permno,
            make: currentVehicle?.make || '',
            color: currentVehicle?.color || '',
            role: currentVehicle?.role,
            vin: currentVehicle?.vin,
            vehicleGrant: response.vehicleDetailsByVin.vehicleGrant || 0,
            hasReceivedSubsidy:
              response.vehicleDetailsByVin.hasReceivedSubsidy || true,
            vehicleGrantItemCode:
              response.vehicleDetailsByVin.vehicleGrantItemCode || '',
          })

          setCurrentVehicleDisabled(currentVehicle.hasReceivedSubsidy ?? true)
          setIsLoading(false)
        })
        .catch((error) => console.error(error))
    }
  }

  useEffect(() => {
    if (currentVehicle) {
      setValue('selectVehicle.vin', currentVehicle.vin || '')
      setValue(
        'selectVehicle.plate',
        currentVehicleDisabled ? '' : currentVehicle.permno || '',
      )
    }
  }, [currentVehicle])

  const getVehicleDetails = useLazyVehicleDetails()
  const getVehicleDetailsCallback = useCallback(
    async ({ vin }: { vin: string }) => {
      const { data } = await getVehicleDetails({
        vin,
      })
      return data
    },
    [getVehicleDetails],
  )

  return (
    <Box>
      <SelectController
        label={formatMessage(information.labels.pickVehicle.vehicle)}
        id={`${field.id}.vehicle`}
        defaultValue={currentVehicle?.permno}
        onSelect={(option) => onChange(option as Option)}
        options={currentVehicleList.map((vehicle) => {
          return {
            value: vehicle.permno,
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
            {currentVehicle && (
              <CategoryCard
                colorScheme={currentVehicleDisabled ? 'red' : 'blue'}
                heading={currentVehicle.make || ''}
                text={`${currentVehicle.color} - ${currentVehicle.permno}`}
              />
            )}
            {currentVehicle && currentVehicleDisabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickVehicle.checkboxNotCheckable,
                  )}
                  message=""
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
