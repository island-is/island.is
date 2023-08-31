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
import { gql, useLazyQuery } from '@apollo/client'
import { CHECK_TACHO_NET_EXISTS } from '../graphql/queries'
import {
  getValueViaPath,
  YES,
  NO,
  getErrorViaPath,
} from '@island.is/application/core'
import { applicant } from '../lib/messages'
import { info } from 'kennitala'

export const PickDeliveryMethod: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { formatMessage } = useLocale()
  const { application, errors, setFieldLoadingState } = props
  const { setValue } = useFormContext()

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
      onCompleted: (result) => {
        const data = result.digitalTachographTachoNetExists
        setCardExistsInTachoNet(data?.exists || false)
        setValue('cardDelivery.cardExistsInTachoNet', data?.exists || false)
      },
    },
  )

  const refetchTachoNet = () => {
    const fullNameParts = (
      getValueViaPath(
        application.externalData,
        'nationalRegistry.data.fullName',
        '',
      ) as string
    ).split(' ')
    const firstName = fullNameParts[0]
    const lastName =
      fullNameParts.length > 1
        ? fullNameParts[fullNameParts.length - 1]
        : undefined
    const { birthday } = info(application.applicant)
    const birthPlace = getValueViaPath(
      application.externalData,
      'nationalRegistryBirthplace.data.location',
      '',
    ) as string
    const drivingLicenceNumber = getValueViaPath(
      application.externalData,
      'currentLicense.data.id',
    ) as number
    // Note: We are not exactly fetching the driving license issuing country, but since we
    //       can only continue if user has the necessary license categories through the Icelandic
    //       license registry, we can assume that the user has the issuing country "Ísland"
    // Note2: For now we are only looking at Icelandic drivers license
    const drivingLicenceIssuingCountry = 'Ísland'

    checkTachoNet({
      variables: {
        input: {
          firstName: firstName,
          lastName: lastName,
          birthDate: birthday,
          birthPlace: birthPlace,
          drivingLicenceNumber: drivingLicenceNumber?.toString() || '',
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

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error])

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
              </b>{' '}
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
    </Box>
  )
}
