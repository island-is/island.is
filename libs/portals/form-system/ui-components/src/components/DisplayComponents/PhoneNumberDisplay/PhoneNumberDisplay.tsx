import { FormSystemField } from '@island.is/api/schema'
import { Box, Text, Stack } from '@island.is/island-ui/core'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

interface Props {
  item: FormSystemField
  lang?: 'is' | 'en'
}

export const PhoneNumberDisplay = ({ item, lang = 'is' }: Props) => {
  const values = (item.values ?? []).filter((v): v is NonNullable<typeof v> =>
    Boolean(v),
  )
  const showIndex = values.length > 1

  const formatPhoneNumber = (raw?: string) => {
    if (!raw) return ''

    const parsed = parsePhoneNumberFromString(raw)
    if (!parsed) {
      return raw
    }

    return parsed.formatInternational()
  }

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Stack space={0}>
        <Text as="p" fontWeight="semiBold">
          {item.name?.[lang]}
        </Text>

        {values.map((valueDto, index) => {
          const json = valueDto.json as
            | Record<string, unknown>
            | null
            | undefined

          const rawPhoneNumber =
            typeof json?.phoneNumber === 'string' ? json.phoneNumber : ''

          return (
            <Box key={`${valueDto.id ?? item.id}-${index}`} marginLeft={2}>
              {showIndex && (
                <Text fontWeight="medium">
                  {`${index + 1}:`}
                  {'\u00A0\u00A0\u00A0'}
                  <Text as="span" fontWeight="light" whiteSpace="breakSpaces">
                    {formatPhoneNumber(rawPhoneNumber)}
                  </Text>
                </Text>
              )}
              {!showIndex && (
                <Text fontWeight="light" whiteSpace="breakSpaces">
                  {formatPhoneNumber(rawPhoneNumber)}
                </Text>
              )}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
