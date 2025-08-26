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
  const { application, errors, setFieldLoadingState, field } = props
  const { setValue } = useFormContext()

  const [cardExistsInTachoNet, setCardExistsInTachoNet] = useState<
    boolean | undefined
  >(
    getValueViaPath<boolean>(
      application.answers,
      `${field.id}.cardExistsInTachoNet`,
      undefined,
    ),
  )

  const cardType = getValueViaPath<string>(
    application.answers,
    'cardTypeSelection.cardType',
  )
  const hasValidCardTypeForDeliveryMethodSend =
    cardType !== 'reissue' && cardType !== 'reprint'

  const [checkTachoNet, { loading, error }] = useLazyQuery(
    gql`
      ${CHECK_TACHO_NET_EXISTS}
    `,
    {
      onCompleted: (result) => {
        const data = result.digitalTachographTachoNetExists
        setCardExistsInTachoNet(data?.exists || false)
        setValue(`${field.id}.cardExistsInTachoNet`, data?.exists || false)
      },
    },
  )

  const refetchTachoNet = () => {
    const useFakeDataTachoNet =
      getValueViaPath(application.answers, 'fakeData.useFakeDataTachoNet') ===
      YES
    if (useFakeDataTachoNet) {
      const hasActiveCardInTachoNet =
        getValueViaPath(
          application.answers,
          'fakeData.hasActiveCardInTachoNet',
        ) === YES

      setCardExistsInTachoNet(hasActiveCardInTachoNet)
      setValue(`${field.id}.cardExistsInTachoNet`, hasActiveCardInTachoNet)
      return
    }

    const fullNameParts = (
      getValueViaPath<string>(
        application.externalData,
        'nationalRegistry.data.fullName',
      ) || ''
    ).split(' ')
    const firstName = fullNameParts[0]
    const lastName =
      fullNameParts.length > 1
        ? fullNameParts[fullNameParts.length - 1]
        : undefined
    const { birthday } = info(application.applicant)
    const birthPlace =
      getValueViaPath<string>(
        application.externalData,
        'nationalRegistryBirthplace.data.location',
      ) || ''
    const drivingLicenceNumber =
      getValueViaPath<number>(
        application.externalData,
        'currentLicense.data.id',
      )?.toString() || ''
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
          drivingLicenceNumber: drivingLicenceNumber,
          drivingLicenceIssuingCountry: drivingLicenceIssuingCountry,
        },
      },
    })
  }

  useEffect(() => {
    if (
      hasValidCardTypeForDeliveryMethodSend &&
      cardExistsInTachoNet === undefined
    ) {
      refetchTachoNet()
    }
  }, [hasValidCardTypeForDeliveryMethodSend])

  // Check if user is allowed to select the delivery method "Send to my legal domicile"
  const allowDeliveryMethodSend =
    hasValidCardTypeForDeliveryMethodSend && cardExistsInTachoNet === false

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error, setFieldLoadingState])

  return (
    <Box paddingTop={2}>
      {!loading && !error && (
        <>
          <RadioController
            id={`${field.id}.deliveryMethodIsSend`}
            largeButtons
            split={allowDeliveryMethodSend ? '1/2' : '1/1'}
            backgroundColor="blue"
            error={
              errors &&
              getErrorViaPath(errors, `${field.id}.deliveryMethodIsSend`)
            }
            options={
              allowDeliveryMethodSend
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

          <AlertMessage
            type="info"
            title={formatMessage(
              applicant.labels.cardDelivery.chooseDeliveryNoteTitle,
            )}
            message={formatMessage(
              applicant.labels.cardDelivery.chooseDeliveryNoteText,
            )}
          />
        </>
      )}

      {!!error && (
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
      )}

      {loading && (
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
