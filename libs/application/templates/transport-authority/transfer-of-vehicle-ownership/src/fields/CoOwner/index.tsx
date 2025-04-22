import { gql, useQuery } from '@apollo/client'
import { VehiclesCurrentOwnerInfo } from '@island.is/api/schema'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { GET_VEHICLE_INFORMATION } from '../../graphql/queries'
import { information } from '../../lib/messages'
import { getSelectedVehicle } from '../../utils'

export const CoOwner: FC<React.PropsWithChildren<FieldBaseProps>> = (props) => {
  const { application, field, setFieldLoadingState, errors } = props

  const { formatMessage } = useLocale()
  const { id } = field

  const vehicle = getSelectedVehicle(
    application.externalData,
    application.answers,
  )

  const { data, loading, error } = useQuery(
    gql`
      ${GET_VEHICLE_INFORMATION}
    `,
    {
      variables: {
        input: {
          permno: vehicle?.permno,
          regno: '',
          vin: '',
        },
      },
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error, setFieldLoadingState])

  return !loading && !error ? (
    data?.vehiclesDetail?.coOwners &&
    data.vehiclesDetail.coOwners.length > 0 ? (
      <Box>
        {data.vehiclesDetail.coOwners.map(
          (coOwner: VehiclesCurrentOwnerInfo, index: number) => {
            const nationalIdField = `${id}[${index}].nationalId`
            const nameField = `${id}[${index}].name`
            const emailField = `${id}[${index}].email`
            const phoneField = `${id}[${index}].phone`

            return (
              <Box marginTop={3}>
                <Text variant="h5">
                  {formatMessage(information.labels.coOwner.title)}
                  {data.vehiclesDetail.coOwners.length > 1
                    ? ` ${index + 1}`
                    : ''}
                </Text>
                <GridRow>
                  <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                    <InputController
                      id={nationalIdField}
                      name={nationalIdField}
                      defaultValue={coOwner.nationalId || ''}
                      label={formatMessage(
                        information.labels.coOwner.nationalId,
                      )}
                      format="######-####"
                      readOnly
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                    <InputController
                      id={nameField}
                      name={nameField}
                      defaultValue={coOwner.owner || ''}
                      label={formatMessage(information.labels.coOwner.name)}
                      readOnly
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                    <InputController
                      id={emailField}
                      name={emailField}
                      label={formatMessage(information.labels.coOwner.email)}
                      defaultValue={
                        getValueViaPath(
                          application.answers,
                          emailField,
                          '',
                        ) as string
                      }
                      type="email"
                      backgroundColor="blue"
                      required
                      error={errors && getErrorViaPath(errors, emailField)}
                    />
                  </GridColumn>
                  <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                    <PhoneInputController
                      id={phoneField}
                      name={phoneField}
                      label={formatMessage(information.labels.coOwner.phone)}
                      defaultValue={
                        getValueViaPath(
                          application.answers,
                          phoneField,
                          '',
                        ) as string
                      }
                      backgroundColor="blue"
                      required
                      error={errors && getErrorViaPath(errors, phoneField)}
                      allowedCountryCodes={['IS']}
                      disableDropdown={true}
                    />
                  </GridColumn>
                </GridRow>
              </Box>
            )
          },
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
