import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import {
  ActionCard,
  AlertMessage,
  Box,
  SkeletonLoader,
} from '@island.is/island-ui/core'

import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { information } from '../../lib/messages/information'
import { VehiclesCurrentVehicle } from '../../shared/types'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleQuery'
import format from 'date-fns/format'

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

  const resetValues = () => {
    setValue('selectVehicle.vin', '')
    setValue('selectVehicle.plate', '')
    setValue('selectVehicle.grantAmount', '')
  }

  const onChange = (option: Option) => {
    const chosenVehicle = currentVehicleList.find(
      (x) => x.permno === option.value,
    )
    setIsLoading(true)
    if (chosenVehicle && chosenVehicle.vin) {
      getVehicleDetailsCallback({
        vin: chosenVehicle.vin,
      })
        .then((response) => {
          const hasReceivedSubsidy =
            response.vehicleDetailsByVin.hasReceivedSubsidy
          setCurrentVehicle({
            ...chosenVehicle,
            vehicleGrant: response.vehicleDetailsByVin.vehicleGrant || 0,
            hasReceivedSubsidy: hasReceivedSubsidy || true,
            vehicleGrantItemCode:
              response.vehicleDetailsByVin.vehicleGrantItemCode || '',
          })

          setCurrentVehicleDisabled(hasReceivedSubsidy ?? true)

          if (!hasReceivedSubsidy) {
            setValue('selectVehicle.vin', chosenVehicle.vin || '')
            setValue(
              'selectVehicle.plate',
              hasReceivedSubsidy ? '' : chosenVehicle.permno || '',
            )
            setValue(
              'selectVehicle.grantAmount',
              response.vehicleDetailsByVin.vehicleGrant,
            )
          } else {
            resetValues()
          }
          setIsLoading(false)
        })
        .catch((error) => {
          console.error(error)
          resetValues()
        })
    }
  }

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
          <SkeletonLoader background="purple200" />
        ) : (
          <Box>
            {currentVehicle && (
              <ActionCard
                heading={`${currentVehicle.make ?? ''} - ${
                  currentVehicle.permno
                }`}
                text={`${currentVehicle.color} - ${formatMessage(
                  information.labels.pickVehicle.registrationDate,
                )}: ${
                  currentVehicle.firstRegistrationDate &&
                  format(
                    new Date(currentVehicle.firstRegistrationDate),
                    'dd.MM.yyyy',
                  )
                }`}
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
