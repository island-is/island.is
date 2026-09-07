import { FormSystemField } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  valueIndex: number
  requiredMissing?: boolean
}

export const PhoneNumberDisplay = ({
  item,
  valueIndex,
  requiredMissing = false,
}: Props) => {
  const { lang, formatMessage } = useLocale()

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
        {requiredMissing && (
          <>
            {' '}
            <Text as="span" fontWeight="medium" color="red600">
              *
            </Text>
          </>
        )}
      </Text>

      <Box marginLeft={2}>
        {requiredMissing && (
          <>
            {' '}
            <Text as="span" fontWeight="light" color="red600">
              {formatMessage(m.missingValue)}
            </Text>
          </>
        )}
        {!requiredMissing && (
          <Text fontWeight="light" whiteSpace="breakSpaces">
            {value}
          </Text>
        )}
      </Box>
    </Box>
  )
}
