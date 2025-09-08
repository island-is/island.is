import { FormSystemField } from '@island.is/api/schema'
import { Box, Stack, Text } from '@island.is/island-ui/core'

interface Props {
  item: FormSystemField
  lang?: 'is' | 'en'
}

const ANSWER_MAP = {
  is: {
    true: 'Valið',
    false: 'Ekki valið',
  },
  en: {
    true: 'Checked',
    false: 'Unchecked',
  },
} as const

export const CheckBoxDisplay = ({ item, lang = 'is' }: Props) => {
  const rawValue = (item?.values?.[0]?.json as Record<string, unknown>)?.[
    'checkboxValue'
  ]
  const value =
    typeof rawValue === 'boolean'
      ? String(rawValue)
      : rawValue === 'true'
      ? 'true'
      : rawValue === 'false'
      ? 'false'
      : 'false'

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
          {ANSWER_MAP[lang][value as 'true' | 'false'] ?? ''}
        </Text>
      </Stack>
    </Box>
  )
}
