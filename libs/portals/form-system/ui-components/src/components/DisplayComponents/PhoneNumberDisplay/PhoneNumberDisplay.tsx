import { FormSystemField } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

interface Props {
  item: FormSystemField
  valueIndex: number
}

export const PhoneNumberDisplay = ({ item, valueIndex }: Props) => {
  const { lang } = useLocale()

  const formatPhoneNumber = (raw?: string) => {
    if (!raw) return ''

    const parsed = parsePhoneNumberFromString(raw)
    if (!parsed) {
      return raw
    }

    return parsed.formatInternational()
  }

  const raw = item.values?.[valueIndex]?.json?.phoneNumber
  const value = formatPhoneNumber(typeof raw === 'string' ? raw : '')

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Text as="p" fontWeight="semiBold">
        {item.name?.[lang]}
      </Text>

      <Box marginLeft={2}>
        <Text fontWeight="light" whiteSpace="breakSpaces">
          {value}
        </Text>
      </Box>
    </Box>
  )
}
