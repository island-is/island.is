import { FormSystemField } from '@island.is/api/schema'
import { ApplicantTypesEnum } from '@island.is/form-system/enums'
import { getValues } from '../../../lib/getValue'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

interface Props {
  item: FormSystemField
  labelsOnly?: boolean
}

const applicantTypesWithoutContactDetails = new Set([
  ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION,
  ApplicantTypesEnum.LEGAL_ENTITY,
  ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER,
  ApplicantTypesEnum.WARD_OF_LEGAL_GUARDIAN,
])

const baseApplicantValues = [
  'nationalId',
  'name',
  'email',
  'phoneNumber',
] as const

const applicantAddressValues = ['address', 'postalCode'] as const

const applicantValues = [
  ...baseApplicantValues,
  ...applicantAddressValues,
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

export const ApplicantDisplay = ({ item, labelsOnly = false }: Props) => {
  const hideContactDetails = applicantTypesWithoutContactDetails.has(
    item.fieldSettings?.applicantType ?? '',
  )
  const displayValues = item.fieldSettings?.isAddressRequired
    ? applicantValues
    : baseApplicantValues
  const rawValues = (getValues(item, displayValues as unknown as string[]) ||
    {}) as Record<ApplicantKey, unknown>
  const { lang } = useLocale()

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      {displayValues.map((key) => {
        if (hideContactDetails && (key === 'email' || key === 'phoneNumber'))
          return null
        if (
          key === 'phoneNumber' &&
          item.fieldSettings?.isPhoneRequired === false
        )
          return null
        let value = rawValues[key]
        if (!labelsOnly && (typeof value === 'undefined' || value === null))
          return null
        if (!labelsOnly && key === 'phoneNumber')
          value =
            parsePhoneNumberFromString(
              value as string,
            )?.formatInternational() ?? value
        return (
          <Stack key={key} space={0}>
            <Text as="p" fontWeight="semiBold">
              {valueTranslations[key][lang]}
            </Text>
            {!labelsOnly && (
              <Box marginLeft={2}>
                <Text fontWeight="light">{String(value)}</Text>
              </Box>
            )}
          </Stack>
        )
      })}
    </Box>
  )
}
