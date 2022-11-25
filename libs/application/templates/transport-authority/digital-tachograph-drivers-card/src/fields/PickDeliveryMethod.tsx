import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { FC, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'
import { RadioController } from '@island.is/shared/form-fields'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { CHECK_TACHO_NET_EXISTS } from '../graphql/queries'
import {
  getValueViaPath,
  YES,
  NO,
  getErrorViaPath,
} from '@island.is/application/core'
import { applicant } from '../lib/messages'
import { info } from 'kennitala'

export const PickDeliveryMethod: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const { application, errors } = props
  const { control, setValue } = useFormContext()

  const [deliveryMethodIsSend, setDeliveryMethodIsSend] = useState<string>(
    getValueViaPath(
      application.answers,
      'cardDelivery.deliveryMethodIsSend',
      NO,
    ) as string,
  )

  const [cardExistsInTachoNet, setCardExistsInTachoNet] = useState<
    boolean | undefined
  >(
    getValueViaPath(
      application.answers,
      'cardDelivery.cardExistsInTachoNet',
      undefined,
    ) as boolean | undefined,
  )

  const onRadioControllerSelect = (value: string) => {
    setDeliveryMethodIsSend(value)
  }

  const cardType = getValueViaPath(
    application.answers,
    'cardTypeSelection.cardType',
    '',
  ) as string
  const cardTypeAllowYes = cardType !== 'reissue' && cardType !== 'reprint'

  const [checkTachoNet, { loading, error }] = useLazyQuery(
    gql`
      ${CHECK_TACHO_NET_EXISTS}
    `,
    {
      onCompleted: (data) => {
        setCardExistsInTachoNet(data?.exists || false)
        setValue('cardDelivery.cardExistsInTachoNet', data?.exists || false)
      },
    },
  )

  const refetchTachoNet = () => {
    const fullNameParts = (getValueViaPath(
      application.externalData,
      'nationalRegistry.data.fullName',
      '',
    ) as string).split(' ')
    const firstName = fullNameParts[0]
    const lastName =
      fullNameParts.length > 1
        ? fullNameParts[fullNameParts.length - 1]
        : undefined
    const { birthday } = info(application.applicant)
    const birthPlace = getValueViaPath(
      application.externalData,
      'nationalRegistryCustom.data.birthPlace',
      '',
    ) as string
    const drivingLicenceNumber = getValueViaPath(
      application.externalData,
      'drivingLicense.data.id',
      '',
    ) as string
    const drivingLicenceIssuingCountry = 'Ísland' // Note: For now we are only looking at Icelandic drivers license

    checkTachoNet({
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
    })
  }

  useEffect(() => {
    if (cardTypeAllowYes && cardExistsInTachoNet === undefined) {
      refetchTachoNet()
    }
  }, [cardTypeAllowYes])

  return (
    <Box paddingTop={2}>
      {!loading && !error ? (
        <>
          <RadioController
            id="cardDelivery.deliveryMethodIsSend"
            largeButtons
            split={
              cardTypeAllowYes && cardExistsInTachoNet === false ? '1/2' : '1/1'
            }
            backgroundColor="blue"
            onSelect={onRadioControllerSelect}
            error={
              errors &&
              getErrorViaPath(errors, 'cardDelivery.deliveryMethodIsSend')
            }
            options={
              cardTypeAllowYes && cardExistsInTachoNet === false
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
        <>
          <AlertMessage
            type="error"
            message={formatMessage(
              applicant.labels.cardDelivery.errorTachoNetMessage,
            )}
          />
          <Box paddingTop={3}>
            <Button onClick={() => refetchTachoNet?.()}>
              {formatMessage(
                applicant.labels.cardDelivery.retryTachoNetButtonCaption,
              )}
            </Button>
          </Box>
        </>
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
        value={!loading && !error ? 'forward' : ''}
        ref={register({ required: true })}
        name="cardDelivery.canGoForward"
      />
    </Box>
  )
}
