import { gql, useQuery } from '@apollo/client'
import {
  VehiclesCurrentOwnerInfo,
  VehiclesCurrentVehicle,
} from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  Text,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { GET_VEHICLE_INFORMATION } from '../graphql/queries'
import { information } from '../lib/messages'
import { useFormContext } from 'react-hook-form'

export const MainOwner: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  const currentVehicleList = application.externalData?.currentVehicleList
    ?.data as VehiclesCurrentVehicle[]
  const vehicleValue = getValueViaPath(
    application.answers,
    'pickVehicle.vehicle',
    '',
  ) as string
  const vehicle = currentVehicleList[parseInt(vehicleValue, 10)]

  const { data, loading } = useQuery(
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

  const owner = data?.vehiclesDetail?.currentOwnerInfo

  return (
    <>
      {loading ? (
        <Box marginTop={3}>
          <SkeletonLoader
            height={84}
            space={2}
            repeat={3}
            borderRadius="large"
          />
        </Box>
      ) : owner ? (
        <Box marginTop={3}>
          <Text variant="h5">
            {formatMessage(information.labels.owner.title)}
          </Text>

          <Box marginTop={2}>
            <GridRow>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id="nationalId"
                  name="nationalId"
                  defaultValue={owner.nationalId || ''}
                  label={formatMessage(information.labels.owner.nationalId)}
                  readOnly
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id="name"
                  name="name"
                  defaultValue={owner.owner || ''}
                  label={formatMessage(information.labels.owner.name)}
                  readOnly
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id="address"
                  name="address"
                  defaultValue={owner.address || ''}
                  label={formatMessage(information.labels.owner.address)}
                  readOnly
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id="postalcode"
                  name="postalcode"
                  defaultValue={owner.postalcode || ''}
                  label={formatMessage(information.labels.owner.postalcode)}
                  readOnly
                />
              </GridColumn>
            </GridRow>
            <Box marginTop={1}>
              <AlertMessage
                type="info"
                message={formatMessage(information.labels.owner.alertAddress, {
                  address: owner.address || '',
                })}
              />
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  )
}
