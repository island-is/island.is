import { gql, useQuery } from '@apollo/client'
import { OwnerChangeValidationMessage } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import { ChangeCoOwnerOfVehicleAnswers } from '../..'
import { VALIDATE_VEHICLE_CO_OWNER_CHANGE } from '../../graphql/queries'
import { applicationCheck } from '../../lib/messages'

interface Props {
  setValidationErrorFound?: Dispatch<SetStateAction<boolean>>
}

export const ValidationErrorMessages: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({ setValidationErrorFound, ...props }) => {
  const { application, setFieldLoadingState } = props

  const { formatMessage } = useLocale()

  const answers = application.answers as ChangeCoOwnerOfVehicleAnswers

  const { data, loading } = useQuery(
    gql`
      ${VALIDATE_VEHICLE_CO_OWNER_CHANGE}
    `,
    {
      variables: {
        answers: {
          pickVehicle: {
            plate: answers?.pickVehicle?.plate,
          },
          vehicleMileage: {
            value: answers?.vehicleMileage?.value,
          },
          owner: {
            email: answers?.owner?.email,
            nationalId: answers?.owner?.nationalId,
          },
          ownerCoOwners: answers?.ownerCoOwners?.map((x) => ({
            nationalId: x.nationalId,
            email: x.email,
            wasRemoved: x.wasRemoved,
          })),
          coOwners: answers?.coOwners?.map((x) => ({
            nationalId: x.nationalId,
            email: x.email,
            wasRemoved: x.wasRemoved,
          })),
        },
      },
      onCompleted: (data) => {
        if (data?.vehicleCoOwnerChangeValidation?.hasError) {
          setValidationErrorFound?.(true)
        }
      },
      fetchPolicy: 'no-cache',
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading, setFieldLoadingState])

  return data?.vehicleCoOwnerChangeValidation?.hasError &&
    data.vehicleCoOwnerChangeValidation.errorMessages.length > 0 ? (
    <Box>
      <AlertMessage
        type="error"
        title={formatMessage(applicationCheck.validation.alertTitle)}
        message={
          <Box component="span" display="block">
            <BulletList>
              {data.vehicleCoOwnerChangeValidation.errorMessages.map(
                (error: OwnerChangeValidationMessage) => {
                  const message = formatMessage(
                    getValueViaPath(
                      applicationCheck.validation,
                      error?.errorNo || '',
                    ),
                  )
                  const defaultMessage = error.defaultMessage
                  const fallbackMessage =
                    formatMessage(
                      applicationCheck.validation.fallbackErrorMessage,
                    ) +
                    ' - ' +
                    error?.errorNo

                  return (
                    <Bullet key={error.errorNo}>
                      {message || defaultMessage || fallbackMessage}
                    </Bullet>
                  )
                },
              )}
            </BulletList>
          </Box>
        }
      />
    </Box>
  ) : null
}
