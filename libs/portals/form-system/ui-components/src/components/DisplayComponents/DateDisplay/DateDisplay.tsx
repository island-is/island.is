import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  item: FormSystemField
  lang?: 'is' | 'en'
}

export const DateDisplay = ({ item, lang = 'is' }: Props) => {
  const { formatDate } = useLocale()

  const values = (item.values ?? []).filter((v): v is NonNullable<typeof v> =>
    Boolean(v),
  )
  const showIndex = values.length > 1

  const formatDateValue = (raw: unknown) => {
    if (raw == null) return ''

    const asDate =
      raw instanceof Date
        ? raw
        : new Date(typeof raw === 'string' ? raw : String(raw))

    if (Number.isNaN(asDate.getTime())) return ''

    return formatDate(asDate, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
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
          const rawDate = json?.date

          return (
            <Box key={`${valueDto.id ?? item.id}-${index}`} marginLeft={2}>
              {showIndex && (
                <Text fontWeight="medium">
                  {`${index + 1}:`}
                  {'\u00A0\u00A0\u00A0'}
                  <Text as="span" fontWeight="light">
                    {formatDateValue(rawDate)}
                  </Text>
                </Text>
              )}
              {!showIndex && (
                <Text fontWeight="light">{formatDateValue(rawDate)}</Text>
              )}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
