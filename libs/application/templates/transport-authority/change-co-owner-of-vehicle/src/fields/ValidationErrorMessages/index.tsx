import { gql, useQuery } from '@apollo/client'
import { OwnerChangeValidationMessage } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { ChangeCoOwnerOfVehicleAnswers } from '../..'
import { VALIDATE_VEHICLE_OWNER_CHANGE } from '../../graphql/queries'
import { applicationCheck } from '../../lib/messages'

export const ValidationErrorMessages: FC<FieldBaseProps> = (props) => {
  const { application, setFieldLoadingState } = props

  const { formatMessage } = useLocale()

  const answers = application.answers as ChangeCoOwnerOfVehicleAnswers

  const { data, loading } = useQuery(
    gql`
      ${VALIDATE_VEHICLE_OWNER_CHANGE}
    `,
    {
      variables: {
        answers: {
          pickVehicle: {
            plate: answers?.pickVehicle?.plate,
          },
          vehicle: {
            date: new Date(new Date().toISOString().substring(0, 10)),
          },
          seller: {
            email: answers?.owner?.email,
            nationalId: answers?.owner?.nationalId,
          },
          buyer: {
            email: answers?.owner?.email,
            nationalId: answers?.owner?.nationalId,
          },
          buyerCoOwnerAndOperator: [
            ...(answers?.ownerCoOwners
              ? answers.ownerCoOwners.map((x) => ({
                  email: x.email,
                  nationalId: x.nationalId,
                  type: 'coowner',
                }))
              : []),
            ...(answers?.coOwners
              ? answers.coOwners.map((x) => ({
                  email: x.email,
                  nationalId: x.nationalId,
                  type: 'coowner',
                }))
              : []),
          ],
          buyerMainOperator: null,
          insurance: null,
        },
      },
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(
      loading || data?.vehicleOwnerChangeValidation?.hasError,
    )
  }, [loading, data?.vehicleOwnerChangeValidation?.hasError])

  return data?.vehicleOwnerChangeValidation?.hasError &&
    data.vehicleOwnerChangeValidation.errorMessages.length > 0 ? (
    <Box>
      <AlertMessage
        type="error"
        title={formatMessage(applicationCheck.validation.alertTitle)}
        message={
          <Box component="span" display="block">
            <ul>
              {data.vehicleOwnerChangeValidation.errorMessages.map(
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
                    <li>
                      <Text variant="small">
                        {message || defaultMessage || fallbackMessage}
                      </Text>
                    </li>
                  )
                },
              )}
            </ul>
          </Box>
        }
      />
    </Box>
  ) : null
}
