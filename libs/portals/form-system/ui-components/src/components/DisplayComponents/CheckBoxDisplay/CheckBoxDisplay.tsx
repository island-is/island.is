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

const normalizeCheckboxValue = (rawValue: unknown): 'true' | 'false' => {
  if (typeof rawValue === 'boolean') return rawValue ? 'true' : 'false'
  if (rawValue === 'true') return 'true'
  if (rawValue === 'false') return 'false'
  return 'false'
}

export const CheckBoxDisplay = ({ item, lang = 'is' }: Props) => {
  const nonNullValues = (item.values ?? []).filter(
    (v): v is NonNullable<typeof v> => Boolean(v),
  )

  // Preserve previous behavior: if there are no values, still display "false"
  const valuesToRender = nonNullValues.length > 0 ? nonNullValues : [undefined]
  const showIndex = valuesToRender.length > 1

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

        {valuesToRender.map((valueDto, index) => {
          const rawValue =
            valueDto?.json?.checkboxValue ??
            (valueDto?.json as Record<string, unknown> | null | undefined)
              ?.checkboxValue

          const value = normalizeCheckboxValue(rawValue)

          return (
            <Box key={`${valueDto?.id ?? item.id}-${index}`} marginLeft={2}>
              {showIndex && (
                <Text fontWeight="medium">
                  {`${index + 1}:`}
                  {'\u00A0\u00A0\u00A0'}
                  <Text as="span" fontWeight="light">
                    {ANSWER_MAP[lang][value] ?? ''}
                  </Text>
                </Text>
              )}
              {!showIndex && (
                <Text fontWeight="light">{ANSWER_MAP[lang][value] ?? ''}</Text>
              )}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
