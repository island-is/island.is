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
import { OrderVehicleLicensePlateAnswers } from '../..'
import { VALIDATE_VEHICLE_PLATE_ORDER } from '../../graphql/queries'
import { applicationCheck } from '../../lib/messages'

interface Props {
  setValidationErrorFound?: Dispatch<SetStateAction<boolean>>
}

export const ValidationErrorMessages: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({ setValidationErrorFound, ...props }) => {
  const { application, setFieldLoadingState } = props

  const { formatMessage } = useLocale()

  const answers = application.answers as OrderVehicleLicensePlateAnswers

  const { data, loading } = useQuery(
    gql`
      ${VALIDATE_VEHICLE_PLATE_ORDER}
    `,
    {
      variables: {
        answers: {
          pickVehicle: {
            plate: answers?.pickVehicle?.plate,
          },
          plateSize: {
            frontPlateSize: answers?.plateSize?.frontPlateSize,
            rearPlateSize: answers?.plateSize?.rearPlateSize,
          },
          plateDelivery: {
            deliveryMethodIsDeliveryStation:
              answers?.plateDelivery?.deliveryMethodIsDeliveryStation,
            deliveryStationTypeCode:
              answers?.plateDelivery?.deliveryStationTypeCode,
            includeRushFee: answers?.plateDelivery?.includeRushFee,
          },
        },
      },
      onCompleted: (data) => {
        if (data?.vehiclePlateOrderValidation?.hasError) {
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
      {data?.vehiclePlateOrderValidation?.errorMessages?.length > 0 && (
        <Box>
          <AlertMessage
            type="error"
            title={formatMessage(applicationCheck.validation.alertTitle)}
            message={
              <Box component="span" display="block">
                <BulletList>
                  {data.vehiclePlateOrderValidation.errorMessages.map(
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
      {!!data?.vehiclePlateOrderValidation?.infoMessages?.length && (
        <Box>
          <AlertMessage
            type="info"
            title={formatMessage(applicationCheck.validation.alertInfoTitle)}
            message={
              <Box component="span" display="block">
                <BulletList color="blue400">
                  {data.vehiclePlateOrderValidation.infoMessages.map(
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
