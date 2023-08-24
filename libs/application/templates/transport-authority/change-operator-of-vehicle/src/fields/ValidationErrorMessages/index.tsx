import { gql, useQuery } from '@apollo/client'
import { OperatorChangeValidationMessage } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect } from 'react'
import { ChangeOperatorOfVehicleAnswers } from '../..'
import { VALIDATE_VEHICLE_OPERATOR_CHANGE } from '../../graphql/queries'
import { applicationCheck } from '../../lib/messages'

export const ValidationErrorMessages: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application, setFieldLoadingState } = props

  const { formatMessage } = useLocale()

  const answers = application.answers as ChangeOperatorOfVehicleAnswers

  const { data, loading } = useQuery(
    gql`
      ${VALIDATE_VEHICLE_OPERATOR_CHANGE}
    `,
    {
      variables: {
        answers: {
          pickVehicle: {
            plate: answers?.pickVehicle?.plate,
          },
          owner: {
            nationalId: answers?.owner?.nationalId,
          },
          operators: answers?.operators?.map((x) => ({
            nationalId: x.nationalId,
            wasRemoved: x.wasRemoved,
          })),
          oldOperators: answers?.oldOperators?.map((x) => ({
            nationalId: x.nationalId,
            wasRemoved: x.wasRemoved,
          })),
          mainOperator: answers?.mainOperator
            ? {
                nationalId: answers.mainOperator.nationalId,
              }
            : null,
        },
      },
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading])

  return data?.vehicleOperatorChangeValidation?.hasError &&
    data.vehicleOperatorChangeValidation.errorMessages.length > 0 ? (
    <Box>
      <AlertMessage
        type="error"
        title={formatMessage(applicationCheck.validation.alertTitle)}
        message={
          <Box component="span" display="block">
            <ul>
              {data.vehicleOperatorChangeValidation.errorMessages.map(
                (error: OperatorChangeValidationMessage) => {
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
