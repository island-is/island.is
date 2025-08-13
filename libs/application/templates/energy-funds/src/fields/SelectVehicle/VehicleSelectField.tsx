import { FieldBaseProps, Option } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import { ActionCard, Box, SkeletonLoader } from '@island.is/island-ui/core'

import { SelectController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { information } from '../../lib/messages/information'
import { VehiclesCurrentVehicle } from '../../shared/types'
import { useLazyVehicleDetails } from '../../hooks/useLazyVehicleQuery'
import format from 'date-fns/format'
import { formatIsk } from '../../utils'

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleSelectField: FC<
  React.PropsWithChildren<VehicleSearchFieldProps & FieldBaseProps>
> = ({ currentVehicleList, application, field }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const vehicleValue = getValueViaPath(
    application.answers,
    'selectVehicle.plate',
    '',
  ) as string

  const defaultGrantValue = getValueViaPath(
    application.answers,
    'selectVehicle.grantAmount',
  ) as number

  const [currentVehicle, setCurrentVehicle] = useState<
    VehiclesCurrentVehicle | undefined
  >(
    vehicleValue
      ? {
          ...currentVehicleList.find((z) => z.permno === vehicleValue),
          vehicleGrant: defaultGrantValue,
        }
      : undefined,
  )

  const resetValues = () => {
    setValue('selectVehicle.plate', '')
    setValue('selectVehicle.grantAmount', '')
    setValue('selectVehicle.newRegistrationDate', '')
    setValue('selectVehicle.type', '')
    setValue('selectVehicle.grantItemCode', '')
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
            response.energyFundVehicleGrant.hasReceivedSubsidy
          setCurrentVehicle({
            ...chosenVehicle,
            vehicleGrant: response.energyFundVehicleGrant.vehicleGrant || 0,
            hasReceivedSubsidy: hasReceivedSubsidy || false,
          })

          if (!hasReceivedSubsidy) {
            setValue(
              'selectVehicle.plate',
              hasReceivedSubsidy ? '' : chosenVehicle.permno || '',
            )
            setValue(
              'selectVehicle.grantAmount',
              response.energyFundVehicleGrant.vehicleGrant,
            )
            setValue(
              'selectVehicle.newRegistrationDate',
              chosenVehicle.newRegistrationDate
                ? format(
                    new Date(chosenVehicle.newRegistrationDate),
                    'dd.MM.yyyy',
                  )
                : '',
            )
            setValue('selectVehicle.type', chosenVehicle.make)
            setValue(
              'selectVehicle.grantItemCode',
              response.energyFundVehicleGrant.vehicleGrantItemCode,
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
                  currentVehicle.newRegistrationDate &&
                  format(
                    new Date(currentVehicle.newRegistrationDate),
                    'dd.MM.yyyy',
                  )
                }`}
                tag={{
                  label: !currentVehicle.hasReceivedSubsidy
                    ? formatMessage(
                        information.labels.pickVehicle.checkboxCheckableTag,
                        {
                          amount: currentVehicle.vehicleGrant
                            ? `${formatIsk(currentVehicle.vehicleGrant)}`
                            : formatMessage(
                                information.labels.pickVehicle.carNotEligable,
                              ),
                        },
                      )
                    : formatMessage(
                        information.labels.pickVehicle.checkboxNotCheckable,
                      ),
                  outlined: true,
                  variant:
                    !currentVehicle.hasReceivedSubsidy &&
                    currentVehicle.vehicleGrant
                      ? 'blue'
                      : 'red',
                }}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
