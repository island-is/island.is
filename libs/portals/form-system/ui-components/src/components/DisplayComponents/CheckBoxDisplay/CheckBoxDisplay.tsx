import { FormSystemField } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  item: FormSystemField
  valueIndex: number
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

const normalizeCheckboxValue = (rawValue: unknown): 'true' | 'false' => {
  if (typeof rawValue === 'boolean') return rawValue ? 'true' : 'false'
  if (rawValue === 'true') return 'true'
  if (rawValue === 'false') return 'false'
  return 'false'
}

export const CheckBoxDisplay = ({ item, valueIndex }: Props) => {
  const { lang } = useLocale()

  const raw = item.values?.[valueIndex]
  const value = normalizeCheckboxValue(raw?.json?.checkboxValue)

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
        <Text fontWeight="light">{ANSWER_MAP[lang][value] ?? ''}</Text>
      </Box>
    </Box>
  )
}
