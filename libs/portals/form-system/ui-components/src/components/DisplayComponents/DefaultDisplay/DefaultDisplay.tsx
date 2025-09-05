import { FormSystemField } from '@island.is/api/schema'
import { Box, Text } from '@island.is/island-ui/core'

const TEXTBOX_COMPONENT_MAP = {
  BANK_ACCOUNT: 'bankAccount',
  ISK_NUMBERBOX: 'iskNumber',
  EMAIL: 'email',
  NATIONAL_ID: 'nationalId',
  PHONE_NUMBER: 'phoneNumber',
  PROPERTY_NUMBER: 'propertyNumber',
  TEXTBOX: 'text',
  TIME_INPUT: 'time',
  DATE_PICKER: 'date',
  DROPDOWN_LIST: 'listValue',
  RADIO_BUTTONS: 'listValue',
  APPLICANT: '',
} as const

interface Props {
  item: FormSystemField
  lang?: 'is' | 'en'
}

export const DefaultDisplay = ({ item, lang = 'is' }: Props) => {
  const valueKey = TEXTBOX_COMPONENT_MAP[
    item.fieldType as keyof typeof TEXTBOX_COMPONENT_MAP
  ] as string
  const value =
    (item?.values?.[0]?.json as Record<string, unknown>)?.[valueKey] ?? ''
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
      <Text fontWeight="light">{String(value ?? '')}</Text>
    </Box>
  )
}
