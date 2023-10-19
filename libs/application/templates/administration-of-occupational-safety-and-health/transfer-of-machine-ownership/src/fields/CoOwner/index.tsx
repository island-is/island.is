import { gql, useQuery } from '@apollo/client'
import { VehiclesCurrentOwnerInfo } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import {
  GET_MACHINE_DETAILS,
  GET_VEHICLE_INFORMATION,
} from '../../graphql/queries'
import { information } from '../../lib/messages'
import { Machine, VehiclesCurrentVehicle } from '../../shared'
import { getSelectedVehicle } from '../../utils'

export const CoOwner: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application, field, setFieldLoadingState } = props

  const { formatMessage } = useLocale()
  const { id } = field

  const vehicle = getSelectedVehicle(
    application.externalData,
    application.answers,
  ) as VehiclesCurrentVehicle

  const machine = getSelectedVehicle(
    application.externalData,
    application.answers,
  ) as Machine

  console.log('application.answers', application.answers)

  // const { data, loading, error } = useQuery(
  //   gql`
  //     ${GET_VEHICLE_INFORMATION}
  //   `,
  //   {
  //     variables: {
  //       input: {
  //         permno: vehicle.permno,
  //         regno: '',
  //         vin: '',
  //       },
  //     },
  //   },
  // )

  const { data, loading, error } = useQuery(
    gql`
      ${GET_MACHINE_DETAILS}
    `,
    {
      variables: {
        input: {
          id: machine.id,
        },
      },
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error])

  return !loading && !error ? (
    data.registrationNumber ? (
      //data?.vehiclesDetail?.coOwners &&
      //data.vehiclesDetail.coOwners.length > 0 ? (
      <Box>
        {data.vehiclesDetail.coOwners.map(
          (coOwner: VehiclesCurrentOwnerInfo, index: number) => (
            <Box marginTop={3}>
              <Text variant="h5">
                {formatMessage(information.labels.coOwner.title)}
                {data.vehiclesDetail.coOwners.length > 1 ? ` ${index + 1}` : ''}
              </Text>
              <GridRow>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <InputController
                    id={`${id}[${index}].nationalId`}
                    name={`${id}[${index}].nationalId`}
                    defaultValue={coOwner.nationalId || ''}
                    label={formatMessage(information.labels.coOwner.nationalId)}
                    format="######-####"
                    readOnly
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <InputController
                    id={`${id}[${index}].name`}
                    name={`${id}[${index}].name`}
                    defaultValue={coOwner.owner || ''}
                    label={formatMessage(information.labels.coOwner.name)}
                    readOnly
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <InputController
                    id={`${id}[${index}].email`}
                    name={`${id}[${index}].email`}
                    label={formatMessage(information.labels.coOwner.email)}
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        `${id}[${index}].email`,
                        '',
                      ) as string
                    }
                    type="email"
                    backgroundColor="blue"
                    required
                  />
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                  <InputController
                    id={`${id}[${index}].phone`}
                    name={`${id}[${index}].phone`}
                    label={formatMessage(information.labels.coOwner.phone)}
                    defaultValue={
                      getValueViaPath(
                        application.answers,
                        `${id}[${index}].phone`,
                        '',
                      ) as string
                    }
                    type="tel"
                    format="###-####"
                    backgroundColor="blue"
                    required
                  />
                </GridColumn>
              </GridRow>
            </Box>
          ),
        )}
      </Box>
    ) : null
  ) : error ? (
    <Box marginTop={3}>
      <AlertMessage
        type="error"
        title={formatMessage(information.labels.coOwner.error)}
      />
    </Box>
  ) : null
}
