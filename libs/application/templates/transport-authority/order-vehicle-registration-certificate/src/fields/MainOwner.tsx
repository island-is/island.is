import { gql, useQuery } from '@apollo/client'
import { VehiclesCurrentVehicle } from '../shared'
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
import { getSelectedVehicle } from '../utils'

export const MainOwner: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setFieldLoadingState } = props

  const { formatMessage } = useLocale()

  const vehicle = getSelectedVehicle(
    application.externalData,
    application.answers,
  ) as VehiclesCurrentVehicle

  const { data, loading, error } = useQuery(
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

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error])

  return loading ? (
    <Box marginTop={3}>
      <SkeletonLoader height={84} space={2} repeat={3} borderRadius="large" />
    </Box>
  ) : owner ? (
    <Box marginTop={3}>
      <Text variant="h5">{formatMessage(information.labels.owner.title)}</Text>

      <Box marginTop={2}>
        <GridRow>
          <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
            <InputController
              id="name"
              name="name"
              defaultValue={owner.owner || ''}
              label={formatMessage(information.labels.owner.name)}
              readOnly
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/2']}>
            <InputController
              id="nationalId"
              name="nationalId"
              defaultValue={owner.nationalId || ''}
              label={formatMessage(information.labels.owner.nationalId)}
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
  ) : error ? (
    <Box marginTop={3}>
      <AlertMessage
        type="error"
        title={formatMessage(information.labels.owner.error)}
      />
    </Box>
  ) : null
}
