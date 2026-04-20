import React, { FC, useEffect } from 'react'
import { Divider, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getValueViaPath, YES } from '@island.is/application/core'
import { allowFakeCondition, getCurrencyString } from '../../lib/utils'
import { PaymentCatalogItem } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'
import { info } from 'kennitala'
import { DriversLicense } from '@island.is/clients/driving-license'
import { Delivery } from '../../lib/constants'

export const PaymentCharge: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  // Ökuskírteini / Driving License
  let chargeCode = 'AY116'
  // Change price based on temporary license
  const licenseData = getValueViaPath<DriversLicense>(
    application.externalData,
    'currentLicense.data',
  )

  const fakeAllowed = allowFakeCondition(YES)(application.answers)
  const hasFakeTemporary =
    fakeAllowed &&
    getValueViaPath<string>(application.answers, 'fakeData.currentLicense') ===
      'B-temp'

  // Of note: Lazy evaluation guards against undefined errors.
  // Shouldn't break unless changes are made to how the fake data works.
  if (
    hasFakeTemporary ||
    (!fakeAllowed &&
      licenseData?.categories.some((category) => category.validToCode === 8))
  ) {
    // Bráðabirgðaskirteini / Temporary Driving License
    chargeCode = 'AY114'
  }

  // Change price based on age, takes precedence over temporary license
  // and therefore comes after it for overriding purposes
  let age = info(application.applicant).age
  if (allowFakeCondition(YES)(application.answers)) {
    age = parseInt(
      getValueViaPath<string>(application.answers, 'fakeData.age') ?? '25',
      10,
    )
  }
  if (age >= 65) {
    // Skírteini fyrir 65 ára og eldri / License for 65 years and over
    chargeCode = 'AY137'
  }

  const chargeItems = getValueViaPath<PaymentCatalogItem[]>(
    application.externalData,
    'payment.data',
  )

  const chargeItem = chargeItems?.find(
    (item) => item.chargeItemCode === chargeCode,
  )

  const withDeliveryFee =
    getValueViaPath(application.answers, 'delivery.deliveryMethod') ===
    Delivery.SEND_HOME
  const deliveryFee = chargeItems?.find(
    (item) => item.chargeItemCode === 'AY145',
  )

  useEffect(() => {
    setValue('chargeItemCode', chargeCode)
  }, [chargeCode, setValue])

  return (
    <Box>
      <Box display="flex" justifyContent="spaceBetween">
        <Text marginTop="smallGutter">{chargeItem?.chargeItemName}</Text>
        <Text>{getCurrencyString(chargeItem?.priceAmount || 0)}</Text>
      </Box>
      {withDeliveryFee && (
        <Box display="flex" justifyContent="spaceBetween">
          <Text marginTop="smallGutter">{formatMessage(m.delivery)}</Text>
          <Text>{getCurrencyString(deliveryFee?.priceAmount || 0)}</Text>
        </Box>
      )}
      <Box marginTop={2}>
        <Divider />
      </Box>
      <Box marginTop={5} display="flex" justifyContent="spaceBetween">
        <Text variant="h4">{formatMessage(m.paymentSum)}</Text>
        <Text variant="h4" color="blue400">
          {getCurrencyString(
            (chargeItem?.priceAmount || 0) +
              (withDeliveryFee && deliveryFee?.priceAmount
                ? deliveryFee.priceAmount
                : 0),
          )}
        </Text>
      </Box>
    </Box>
  )
}
