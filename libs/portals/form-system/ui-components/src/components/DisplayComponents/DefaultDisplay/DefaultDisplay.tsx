import { FormSystemField } from '@island.is/api/schema'
import { Box, Text, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

const TEXTBOX_COMPONENT_MAP = {
  BANK_ACCOUNT: 'bankAccount',
  ISK_NUMBERBOX: 'iskNumber',
  ISK_SUMBOX: 'iskNumber',
  EMAIL: 'email',
  PROPERTY_NUMBER: 'propertyNumber',
  TEXTBOX: 'text',
  NUMBERBOX: 'number',
  TIME_INPUT: 'time',
  DATE_PICKER: 'date',
  DROPDOWN_LIST: 'listValue',
  RADIO_BUTTONS: 'listValue',
  APPLICANT: '',
} as const

interface Props {
  item: FormSystemField
  valueIndex: number
}

export const DefaultDisplay = ({ item, valueIndex }: Props) => {
  const { lang } = useLocale()

  const valueKey = TEXTBOX_COMPONENT_MAP[
    item.fieldType as keyof typeof TEXTBOX_COMPONENT_MAP
  ] as string

  const value = item.values?.[valueIndex]

  const json = value?.json as Record<string, unknown> | null | undefined
  const extracted = valueKey ? json?.[valueKey] : json

  const displayValue =
    extracted == null
      ? ''
      : typeof extracted === 'object'
      ? JSON.stringify(extracted)
      : String(extracted)

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
    >
      <Text as="p" fontWeight="semiBold" lineHeight="sm">
        {item.name?.[lang]}
      </Text>

      <Box marginLeft={2}>
        <Text fontWeight="light" whiteSpace="breakSpaces" lineHeight="sm">
          {displayValue}
        </Text>
      </Box>
    </Box>
  )
}
