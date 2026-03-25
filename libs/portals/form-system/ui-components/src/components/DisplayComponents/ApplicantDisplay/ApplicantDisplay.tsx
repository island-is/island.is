import { FormSystemField } from '@island.is/api/schema'
import { getValues } from '../../../lib/getValue'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

interface Props {
  item: FormSystemField
}

const applicantValues = [
  'nationalId',
  'name',
  'email',
  'phoneNumber',
  'address',
  'postalCode',
] as const

type ApplicantKey = typeof applicantValues[number]

const valueTranslations: Record<ApplicantKey, { is: string; en: string }> = {
  nationalId: {
    is: 'Kennitala',
    en: 'National ID',
  },
  name: {
    is: 'Nafn',
    en: 'Name',
  },
  email: {
    is: 'Netfang',
    en: 'Email',
  },
  phoneNumber: {
    is: 'Símanúmer',
    en: 'Phone number',
  },
  address: {
    is: 'Heimilisfang',
    en: 'Address',
  },
  postalCode: {
    is: 'Póstnúmer',
    en: 'Postal code',
  },
}

export const ApplicantDisplay = ({ item }: Props) => {
  const rawValues = (getValues(item, applicantValues as unknown as string[]) ||
    {}) as Record<ApplicantKey, unknown>
  const { lang } = useLocale()

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      {applicantValues.map((key) => {
        let value = rawValues[key]
        if (typeof value === 'undefined' || value === null) return null
        if (key === 'phoneNumber')
          value =
            parsePhoneNumberFromString(
              value as string,
            )?.formatInternational() ?? value
        return (
          <Stack key={key} space={0}>
            <Text as="p" fontWeight="semiBold">
              {valueTranslations[key][lang]}
            </Text>
            <Box marginLeft={2}>
              <Text fontWeight="light">{String(value)}</Text>
            </Box>
          </Stack>
        )
      })}
    </Box>
  )
}
