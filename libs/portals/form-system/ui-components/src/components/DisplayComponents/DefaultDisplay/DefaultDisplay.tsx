import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'

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
  DROPDOWN_LIST: 'label',
  RADIO_BUTTONS: 'label',
  APPLICANT: '',
  PAYMENT_QUANTITY: 'number',
} as const

interface Props {
  item: FormSystemField
  valueIndex: number
  requiredMissing?: boolean
}

export const DefaultDisplay = ({
  item,
  valueIndex,
  requiredMissing = false,
}: Props) => {
  const { lang, formatMessage } = useLocale()

  const valueKey = TEXTBOX_COMPONENT_MAP[
    item.fieldType as keyof typeof TEXTBOX_COMPONENT_MAP
  ] as string

  const value = item.values?.[valueIndex]

  const json = value?.json as Record<string, unknown> | null | undefined
  const extracted = valueKey ? json?.[valueKey] : json

  let displayValue = ''
  if (
    item.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
    item.fieldType === FieldTypesEnum.RADIO_BUTTONS
  ) {
    displayValue = value?.json?.label?.[lang] ?? ''
  } else {
    displayValue =
      extracted == null
        ? ''
        : typeof extracted === 'object'
        ? JSON.stringify(extracted)
        : String(extracted)
  }

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
        {requiredMissing && (
          <>
            {' '}
            <Text as="span" fontWeight="medium" color="red600">
              *
            </Text>
          </>
        )}
      </Text>

      <Box marginLeft={2}>
        {requiredMissing && (
          <>
            {' '}
            <Text as="span" fontWeight="light" color="red600">
              {formatMessage(m.missingValue)}
            </Text>
          </>
        )}
        {!requiredMissing && (
          <Text fontWeight="light" whiteSpace="breakSpaces" lineHeight="sm">
            {displayValue}
          </Text>
        )}
      </Box>
    </Box>
  )
}
