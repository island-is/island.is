import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  item: FormSystemField
  valueIndex: number
}

export const DateDisplay = ({ item, valueIndex }: Props) => {
  const { formatDate, lang } = useLocale()

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

  const raw = item.values?.[valueIndex]
  const value = formatDateValue(raw?.json?.date)

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
        <Text fontWeight="light">{value}</Text>
      </Box>
    </Box>
  )
}
