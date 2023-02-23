import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  SkeletonLoader,
  Text,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { VehiclesCurrentVehicleWithOwnerchangeChecks } from '@island.is/api/schema'
import { VehiclesCurrentVehicle } from '../../shared'
import { information, applicationCheck, error } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'
import { gql, useQuery } from '@apollo/client'
import { GET_CURRENT_VEHICLES_WITH_OWNERCHANGE_CHECKS } from '../../graphql/queries'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleRadioField: FC<
  VehicleSearchFieldProps & FieldBaseProps
> = ({ currentVehicleList, application, errors }) => {
  const { formatMessage } = useLocale()
  const { register, setValue } = useFormContext()

  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )
  const [color, setColor] = useState<string | undefined>(
    getValueViaPath(application.answers, 'pickVehicle.color', undefined) as
      | string
      | undefined,
  )

  const { data, loading } = useQuery(
    gql`
      ${GET_CURRENT_VEHICLES_WITH_OWNERCHANGE_CHECKS}
    `,
    {
      variables: {
        input: {
          showOwned: true,
          showCoOwned: false,
          showOperated: false,
        },
      },
    },
  )

  const onRadioControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    setPlate(currentVehicle.permno || '')
    setColor(currentVehicle.color || undefined)
    setValue('vehicle.plate', currentVehicle.permno)
    setValue('vehicle.type', currentVehicle.make)
    setValue('vehicle.date', new Date().toISOString().substring(0, 10))
  }

  const vehicleOptions = (
    vehicles: VehiclesCurrentVehicleWithOwnerchangeChecks[],
  ) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      const disabled =
        !vehicle.isDebtLess || !!vehicle.validationErrorMessages?.length
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="column">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.make}
              </Text>
              <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.color} - {vehicle.permno}
              </Text>
            </Box>
            {disabled && (
              <Box marginTop={2}>
                <AlertMessage
                  type="error"
                  title={formatMessage(
                    information.labels.pickVehicle.hasErrorTitle,
                  )}
                  message={
                    <Box>
                      <BulletList>
                        {!vehicle.isDebtLess && (
                          <Bullet>
                            {formatMessage(
                              information.labels.pickVehicle.isNotDebtLessTag,
                            )}
                          </Bullet>
                        )}
                        {!!vehicle.validationErrorMessages?.length &&
                          vehicle.validationErrorMessages?.map((error) => {
                            const message = formatMessage(
                              getValueViaPath(
                                applicationCheck.validation,
                                error.errorNo || '',
                              ),
                            )
                            const defaultMessage = error.defaultMessage
                            const fallbackMessage =
                              formatMessage(
                                applicationCheck.validation
                                  .fallbackErrorMessage,
                              ) +
                              ' - ' +
                              error.errorNo

                            return (
                              <Bullet>
                                {message || defaultMessage || fallbackMessage}
                              </Bullet>
                            )
                          })}
                      </BulletList>
                    </Box>
                  }
                />
              </Box>
            )}
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return (
    <div>
      {loading ? (
        <SkeletonLoader
          height={100}
          space={2}
          repeat={currentVehicleList.length}
          borderRadius="large"
        />
      ) : (
        <RadioController
          id="pickVehicle.vehicle"
          largeButtons
          backgroundColor="blue"
          onSelect={onRadioControllerSelect}
          options={vehicleOptions(
            data.currentVehiclesWithOwnerchangeChecks as VehiclesCurrentVehicleWithOwnerchangeChecks[],
          )}
        />
      )}
      <input
        type="hidden"
        value={plate}
        ref={register({ required: true })}
        name="pickVehicle.plate"
      />
      <input
        type="hidden"
        value={color}
        ref={register({ required: true })}
        name="pickVehicle.color"
      />
      {plate.length === 0 && errors && errors.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </div>
  )
}
