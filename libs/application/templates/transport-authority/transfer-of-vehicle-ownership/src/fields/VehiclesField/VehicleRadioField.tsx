import { Box, SkeletonLoader, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import {
  VehiclesCurrentVehicle,
  VehiclesCurrentVehicleWithFees,
} from '@island.is/api/schema'
import { information } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'
import { gql, useQuery } from '@apollo/client'
import { GET_CURRENT_VEHICLES_WITH_FEES } from '../../graphql/queries'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleRadioField: FC<VehicleSearchFieldProps> = ({
  currentVehicleList,
}) => {
  const { formatMessage } = useLocale()

  const { data, loading } = useQuery(
    gql`
      ${GET_CURRENT_VEHICLES_WITH_FEES}
    `,
    {
      variables: {
        input: {
          showOwned: true,
          showCoowned: false,
          showOperated: false,
        },
      },
    },
  )

  const vehicleOptions = (vehicles: VehiclesCurrentVehicleWithFees[]) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      const disabled = !!vehicle.isStolen || !!vehicle.fees?.hasEncumbrances
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.make}
              </Text>
              <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.color} - {vehicle.permno}
              </Text>
            </Box>
            <Box display="flex" flexDirection="row" wrap="wrap">
              {vehicle.isStolen && (
                <Tag variant="red">
                  {formatMessage(information.labels.pickVehicle.isStolenTag)}
                </Tag>
              )}
              {vehicle.fees?.hasEncumbrances && (
                <Box paddingLeft={2}>
                  <Tag variant="red">
                    {formatMessage(
                      information.labels.pickVehicle.hasEncumbrancesTag,
                    )}
                  </Tag>
                </Box>
              )}
            </Box>
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return loading ? (
    <SkeletonLoader
      height={100}
      space={2}
      repeat={currentVehicleList.length}
      borderRadius="large"
    />
  ) : (
    <RadioController
      id="pickVehicle.plate"
      largeButtons
      backgroundColor="blue"
      options={vehicleOptions(
        data.currentVehiclesWithFees as VehiclesCurrentVehicleWithFees[],
      )}
    />
  )
}
