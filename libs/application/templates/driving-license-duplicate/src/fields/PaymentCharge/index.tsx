import { Column, Columns, Divider, Text } from '@island.is/island-ui/core'
import { FC, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { allowFakeCondition, getCurrencyString } from '../../lib/utils'
import { PaymentCatalogItem } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'
import { YES } from '../../lib/constants'
import { info } from 'kennitala'
import { DriversLicense } from '@island.is/clients/driving-license'

export const PaymentCharge: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()

  // AY110: Ökuskírteini / Driving License
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
    // AY114: Bráðabirgðaskirteini / Temporary Driving License
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
    // AY113: Skírteini fyrir 65 ára og eldri / License for 65 years and over
    chargeCode = 'AY137'
  }

  const chargeItems = getValueViaPath(
    application.externalData,
    'payment.data',
  ) as PaymentCatalogItem[]

  const chargeItem = chargeItems.find(
    (item) => item.chargeItemCode === chargeCode,
  )
  useEffect(() => {
    setValue('chargeItemCode', chargeCode)
  }, [chargeCode, setValue])

  return (
    <Box paddingTop="smallGutter">
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginBottom="gutter">
            <Text variant="h4">{formatMessage(m.paymentAmount)}</Text>
            <Text marginTop="smallGutter">{chargeItem?.chargeItemName}</Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd" marginBottom="gutter">
            <Text>{getCurrencyString(chargeItem?.priceAmount || 0)}</Text>
          </Box>
        </Column>
      </Columns>
      <Divider />
      <Columns alignY="bottom" space="gutter">
        <Column>
          <Box marginTop="gutter">
            <Text variant="h5">{formatMessage(m.paymentSum)}</Text>
          </Box>
        </Column>
        <Column>
          <Box display="flex" justifyContent="flexEnd">
            <Text variant="h4" color="blue400">
              {getCurrencyString(chargeItem?.priceAmount || 0)}
            </Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}
