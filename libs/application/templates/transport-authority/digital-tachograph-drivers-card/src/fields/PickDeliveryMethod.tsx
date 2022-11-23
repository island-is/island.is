import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, SkeletonLoader } from '@island.is/island-ui/core'
import { FC, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { RadioController } from '@island.is/shared/form-fields'
import { gql, useQuery } from '@apollo/client'
import { CHECK_TACHO_NET_EXISTS } from '../graphql/queries'
import { getValueViaPath, YES, NO } from '@island.is/application/core'
import { applicant } from '../lib/messages'
import { info } from 'kennitala'

export const PickDeliveryMethod: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const { application, errors } = props

  const [deliveryMethodIsSend, setDeliveryMethodIsSend] = useState<string>(
    (getValueViaPath(
      application.answers,
      'deliveryMethodIsSend',
      NO,
    ) as string) || NO,
  )

  const fullNameParts = (
    (getValueViaPath(
      application.externalData,
      'nationalRegistry.data.fullName',
      '',
    ) as string) || ''
  ).split(' ')
  const firstName = fullNameParts[0]
  const lastName =
    fullNameParts.length > 1
      ? fullNameParts[fullNameParts.length - 1]
      : undefined

  const { birthday } = info(application.applicant)

  const birthPlace =
    (getValueViaPath(
      application.externalData,
      'nationalRegistryCustom.data.birthPlace',
      '',
    ) as string) || ''

  const drivingLicenceNumber =
    (getValueViaPath(
      application.externalData,
      'drivingLicense.data.id',
      '',
    ) as string) || ''

  const drivingLicenceIssuingCountry = 'TODOx'

  const { data, loading, error } = useQuery(
    gql`
      ${CHECK_TACHO_NET_EXISTS}
    `,
    {
      variables: {
        input: {
          firstName: firstName,
          lastName: lastName,
          birthDate: birthday,
          birthPlace: birthPlace,
          drivingLicenceNumber: drivingLicenceNumber,
          drivingLicenceIssuingCountry: drivingLicenceIssuingCountry,
        },
      },
    },
  )

  const onRadioControllerSelect = (value: string) => {
    setDeliveryMethodIsSend(value)
  }

  const cardType =
    (getValueViaPath(application.answers, 'cardType', '') as string) || ''
  const existsInTachoNet = data?.exists || false
  const allowYesOption =
    cardType !== 'reissue' && cardType !== 'reprint' && !existsInTachoNet

  return (
    <Box paddingTop={2}>
      {!loading && !error ? (
        <>
          <RadioController
            id="pickVehicle.vehicle"
            largeButtons
            split="1/2"
            backgroundColor="blue"
            onSelect={onRadioControllerSelect}
            options={
              allowYesOption
                ? [
                    {
                      value: YES,
                      label: formatMessage(
                        applicant.labels.cardDelivery.legalDomicileOptionTitle,
                      ),
                    },
                    {
                      value: NO,
                      label: formatMessage(
                        applicant.labels.cardDelivery
                          .transportAuthorityOptionTitle,
                      ),
                    },
                  ]
                : [
                    {
                      value: NO,
                      label: formatMessage(
                        applicant.labels.cardDelivery
                          .transportAuthorityOptionTitle,
                      ),
                    },
                  ]
            }
          />
          <p>
            <i>
              <b>
                {formatMessage(
                  applicant.labels.cardDelivery.chooseDeliveryNoteTitle,
                )}
              </b>
              {formatMessage(
                applicant.labels.cardDelivery.chooseDeliveryNoteText,
              )}
            </i>
          </p>
        </>
      ) : error ? (
        <AlertMessage
          type="error"
          message={formatMessage(
            applicant.labels.cardDelivery.errorTachoNetMessage,
          )}
        />
      ) : (
        <SkeletonLoader
          height={100}
          space={2}
          repeat={1}
          borderRadius="large"
        />
      )}
      <input
        type="hidden"
        value={deliveryMethodIsSend}
        ref={register({ required: true })}
        name="deliveryMethodIsSend"
      />
    </Box>
  )
}
