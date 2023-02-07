import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  InputError,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { FC, useState } from 'react'
import { VehiclesCurrentVehicle } from '../../shared'
import { RadioController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { gql, useQuery } from '@apollo/client'
import { GET_CURRENT_VEHICLES_WITH_PLATE_ORDER_CHECKS } from '../../graphql/queries'
import { VehiclesCurrentVehicleWithPlateOrderChecks } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { error, information } from '../../lib/messages'

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
  const { register } = useFormContext()

  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )

  const onRadioControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    setPlate(currentVehicle.permno || '')
  }

  const { data, loading } = useQuery(
    gql`
      ${GET_CURRENT_VEHICLES_WITH_PLATE_ORDER_CHECKS}
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

  const vehicleOptions = (
    vehicles: VehiclesCurrentVehicleWithPlateOrderChecks[],
  ) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      const disabled = !!vehicle.duplicateOrderExists
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
                        {vehicle.duplicateOrderExists && (
                          <Bullet>
                            {formatMessage(
                              information.labels.pickVehicle
                                .duplicateOrderExistsTag,
                            )}
                          </Bullet>
                        )}
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
            data.currentVehiclesWithPlateOrderChecks as VehiclesCurrentVehicleWithPlateOrderChecks[],
          )}
        />
      )}
      <input
        type="hidden"
        value={plate}
        ref={register({ required: true })}
        name="pickVehicle.plate"
      />
      {plate.length === 0 && errors && errors.pickVehicle && (
        <InputError errorMessage={formatMessage(error.requiredValidVehicle)} />
      )}
    </div>
  )
}
