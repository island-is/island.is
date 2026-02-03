import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  item: FormSystemField
  lang?: 'is' | 'en'
}

export const DateDisplay = ({ item, lang = 'is' }: Props) => {
  const date = (item?.values?.[0]?.json as Record<string, unknown>)?.[
    'date'
  ] as Date
  const { formatDate } = useLocale()
  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Stack space={1}>
        <Text as="p" fontWeight="semiBold">
          {item.name?.[lang]}
        </Text>
        <Text fontWeight="light">
          {' '}
          {formatDate(date, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </Text>
      </Stack>
    </Box>
  )
}
