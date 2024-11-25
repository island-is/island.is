import { gql, useQuery } from '@apollo/client'
import { TransportAuthorityValidationMessage } from '@island.is/api/schema'
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
import { ChangeOperatorOfVehicleAnswers } from '../..'
import { VALIDATE_VEHICLE_OPERATOR_CHANGE } from '../../graphql/queries'
import { applicationCheck } from '../../lib/messages'

interface Props {
  showErrorOnly?: boolean
  setValidationErrorFound?: Dispatch<SetStateAction<boolean>>
}

export const ValidationErrorMessages: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({ showErrorOnly, setValidationErrorFound, ...props }) => {
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
          vehicleMileage: {
            value: answers?.vehicleMileage?.value,
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
      onCompleted: (data) => {
        if (data?.vehicleOperatorChangeValidation?.hasError) {
          setValidationErrorFound?.(true)
        }
      },
      fetchPolicy: 'no-cache',
    },
  )

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading, setFieldLoadingState])

  return (
    <>
      {data?.vehicleOperatorChangeValidation?.errorMessages?.length > 0 && (
        <Box marginBottom={2}>
          <AlertMessage
            type="error"
            title={formatMessage(applicationCheck.validation.alertTitle)}
            message={
              <Box component="span" display="block">
                <BulletList>
                  {data.vehicleOperatorChangeValidation.errorMessages.map(
                    (error: TransportAuthorityValidationMessage) => {
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
      )}
      {!showErrorOnly &&
        !!data?.vehicleOperatorChangeValidation?.infoMessages?.length && (
          <Box>
            <AlertMessage
              type="info"
              title={formatMessage(applicationCheck.validation.alertInfoTitle)}
              message={
                <Box component="span" display="block">
                  <BulletList color="blue400">
                    {data.vehicleOperatorChangeValidation.infoMessages.map(
                      (error: TransportAuthorityValidationMessage) => {
                        return (
                          <Bullet key={error.errorNo}>
                            {error.defaultMessage}
                          </Bullet>
                        )
                      },
                    )}
                  </BulletList>
                </Box>
              }
            />
          </Box>
        )}
    </>
  )
}
