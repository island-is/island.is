import { FormSystemField } from '@island.is/api/schema'
import { Box, Text, Stack } from '@island.is/island-ui/core'

const TEXTBOX_COMPONENT_MAP = {
  BANK_ACCOUNT: 'bankAccount',
  ISK_NUMBERBOX: 'iskNumber',
  ISK_SUMBOX: 'iskNumber',
  EMAIL: 'email',
  NATIONAL_ID: 'nationalId',
  PHONE_NUMBER: 'phoneNumber',
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
  lang?: 'is' | 'en'
}

export const DefaultDisplay = ({ item, lang = 'is' }: Props) => {
  const valueKey = TEXTBOX_COMPONENT_MAP[
    item.fieldType as keyof typeof TEXTBOX_COMPONENT_MAP
  ] as string

  const values = (item.values ?? []).filter((v): v is NonNullable<typeof v> =>
    Boolean(v),
  )
  const showIndex = values.length > 1

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
          const extracted = valueKey ? json?.[valueKey] : json

          const displayValue =
            extracted == null
              ? ''
              : typeof extracted === 'object'
              ? JSON.stringify(extracted)
              : String(extracted)

          return (
            <Box key={`${valueDto.id ?? item.id}-${index}`} marginLeft={2}>
              {showIndex && (
                <Text fontWeight="medium">
                  {`${index + 1}:`}
                  {'\u00A0\u00A0\u00A0'}
                  <Text as="span" fontWeight="light">
                    {displayValue}
                  </Text>
                </Text>
              )}
              {!showIndex && <Text fontWeight="light">{displayValue}</Text>}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
