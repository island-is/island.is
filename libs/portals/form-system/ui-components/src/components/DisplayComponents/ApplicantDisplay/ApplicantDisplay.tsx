import { FormSystemField } from '@island.is/api/schema'
import { getValues } from '../../../lib/getValue'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

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
  // getValues returns an object with the requested keys (or undefined values)
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
        const value = rawValues[key]
        if (typeof value === 'undefined' || value === null) return null
        return (
          <Box key={key} marginBottom={2}>
            <Text variant="h4">{valueTranslations[key][lang]}</Text>
            <Text>{String(value)}</Text>
          </Box>
        )
      })}
    </Box>
  )
}
