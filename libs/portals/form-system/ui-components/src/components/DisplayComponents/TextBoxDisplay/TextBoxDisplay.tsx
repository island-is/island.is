import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/ui'
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
} as const

interface Props {
    item: FormSystemField
    lang?: 'is' | 'en'
}

export const TextBoxDisplay = ({ item, lang = 'is' }: Props) => {
    const lac = TEXTBOX_COMPONENT_MAP[
          item.fieldType as keyof typeof TEXTBOX_COMPONENT_MAP
        ] as string
    const value = (item?.values?.[0]?.json as Record<string, unknown>)?.[lac] ?? ''


    console.log("label", item.name)
    console.log("item", item)
    console.log("TextBoxDisplay", { value })
    return (
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
        >
            <Text as="h4" fontWeight="semiBold">{item.name?.[lang]}</Text>
            <Text fontWeight='light'>{String(value ?? '')}</Text>
        </Box>
    )
}