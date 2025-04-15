import { gql, useLazyQuery } from '@apollo/client'
import { VehiclesCurrentOwnerInfo } from '@island.is/api/schema'
import { getValueViaPath, getErrorViaPath } from '@island.is/application/core'
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
import { FC, useEffect, useState } from 'react'
import { GET_VEHICLE_INFORMATION } from '../../graphql/queries'
import { information } from '../../lib/messages'
import { UserInformation } from '../../shared'
import { useFormContext } from 'react-hook-form'

export const CoOwner: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
  setFieldLoadingState,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { setValue } = useFormContext()
  const [coOwners, setCoOwners] = useState<UserInformation[]>(
    getValueViaPath(
      application.answers,
      'ownerCoOwner',
      [],
    ) as UserInformation[],
  )
  const permno = getValueViaPath(
    application.answers,
    'pickVehicle.plate',
    '',
  ) as string

  const [getVehicleInformation, { loading, error }] = useLazyQuery(
    gql`
      ${GET_VEHICLE_INFORMATION}
    `,
    {
      onCompleted: (result) => {
        const data = result.vehiclesDetail
        if (data !== coOwners) {
          setCoOwners(data?.coOwners || [])
        }
        if (data?.coOwners?.length === 0) {
          setValue('ownerCoOwner', [])
        }
      },
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error])

  useEffect(() => {
    getVehicleInformation({
      variables: {
        input: {
          permno: permno,
          regno: '',
          vin: '',
        },
      },
    })
  }, [coOwners])

  return !loading && !error ? (
    coOwners.length > 0 ? (
      <Box>
        {coOwners.map((coOwner: VehiclesCurrentOwnerInfo, index: number) => (
          <Box marginTop={3}>
            <Text variant="h5">
              {formatMessage(information.labels.coOwner.title)}
              {coOwners.length > 1 ? ` ${index + 1}` : ''}
            </Text>
            <GridRow>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                <InputController
                  id={`${id}[${index}].nationalId`}
                  name={`${id}[${index}].nationalId`}
                  defaultValue={coOwner.nationalId || ''}
                  label={formatMessage(information.labels.coOwner.nationalId)}
                  error={
                    errors &&
                    getErrorViaPath(errors, `${id}[${index}].nationalId`)
                  }
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
                  error={
                    errors && getErrorViaPath(errors, `${id}[${index}].name`)
                  }
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
                  error={
                    errors && getErrorViaPath(errors, `${id}[${index}].email`)
                  }
                  required
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
                <PhoneInputController
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
                  backgroundColor="blue"
                  error={
                    errors && getErrorViaPath(errors, `${id}[${index}].phone`)
                  }
                  required
                  allowedCountryCodes={['IS']}
                  disableDropdown={true}
                />
              </GridColumn>
            </GridRow>
          </Box>
        ))}
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
