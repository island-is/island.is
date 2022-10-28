import { gql, useQuery } from '@apollo/client'
import {
  VehiclesCurrentOwnerInfo,
  VehiclesCurrentVehicle,
} from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC } from 'react'
import { GET_VEHICLE_INFORMATION } from '../graphql/queries'
import { information } from '../lib/messages'
export const CoOwner: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()

  const currentVehicleList = application.externalData?.currentVehicleList
    ?.data as VehiclesCurrentVehicle[]
  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const vehicle = currentVehicleList[parseInt(vehicleValue, 10)]

  const { data } = useQuery(
    gql`
      ${GET_VEHICLE_INFORMATION}
    `,
    {
      variables: {
        input: {
          permno: vehicle.permno,
          regno: '',
          vin: '',
        },
      },
    },
  )

  return data?.vehiclesDetail?.coOwners &&
    data.vehiclesDetail.coOwners.length > 0 ? (
    <Box>
      {data.vehiclesDetail.coOwners.map(
        (coOwner: VehiclesCurrentOwnerInfo, index: number) => (
          <Box marginTop={3}>
            <Text variant="h5">
              {formatMessage(information.labels.coOwner.title)}
              {data.vehiclesDetail.coOwners.length > 1 ? ` ${index + 1}` : ''}
            </Text>
            <Box marginTop={2}>
              <InputController
                id={`${field}[${index}].name`}
                name={`${field}[${index}].name`}
                defaultValue={coOwner.owner || ''}
                label={formatMessage(information.labels.coOwner.name)}
                readOnly
                required
              />
            </Box>
            <Box marginTop={2}>
              <InputController
                id={`${field}[${index}].nationalId`}
                name={`${field}[${index}].nationalId`}
                defaultValue={coOwner.nationalId || ''}
                label={formatMessage(information.labels.coOwner.nationalId)}
                readOnly
                required
              />
            </Box>
            <Box marginTop={2}>
              <InputController
                id={`${field}[${index}].email`}
                name={`${field}[${index}].email`}
                label={formatMessage(information.labels.coOwner.email)}
                type="email"
                backgroundColor="blue"
                required
              />
            </Box>
          </Box>
        ),
      )}
    </Box>
  ) : null
}
