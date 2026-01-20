import { FormSystemField } from '@island.is/api/schema'
import {
  Banknumber,
  Checkbox,
  CurrencyField,
  DatePicker,
  Email,
  FieldTypesEnum,
  FileUpload,
  List,
  MessageWithLink,
  NationalId,
  PhoneNumber,
  PropertyNumber,
  Radio,
  TextInput,
  TimeInput,
} from '@island.is/form-system/ui'
import { Box } from '@island.is/island-ui/core'
import { useFormContext } from 'react-hook-form'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

interface Props {
  field: FormSystemField
}

const FIELD_COMPONENT_MAP = {
  [FieldTypesEnum.BANK_ACCOUNT]: Banknumber,
  [FieldTypesEnum.CHECKBOX]: Checkbox,
  [FieldTypesEnum.ISK_NUMBERBOX]: CurrencyField,
  [FieldTypesEnum.EMAIL]: Email,
  [FieldTypesEnum.FILE]: FileUpload,
  [FieldTypesEnum.NATIONAL_ID]: NationalId,
  [FieldTypesEnum.PHONE_NUMBER]: PhoneNumber,
  [FieldTypesEnum.PROPERTY_NUMBER]: PropertyNumber,
  [FieldTypesEnum.RADIO_BUTTONS]: Radio,
  [FieldTypesEnum.TEXTBOX]: TextInput,
  [FieldTypesEnum.TIME_INPUT]: TimeInput,
  [FieldTypesEnum.DROPDOWN_LIST]: List,
  [FieldTypesEnum.DATE_PICKER]: DatePicker,
  [FieldTypesEnum.MESSAGE]: MessageWithLink,
} as const

export const Field = ({ field }: Props) => {
  const { dispatch } = useApplicationContext()
  const { control } = useFormContext()

  const fieldItems = {
    item: field,
    control,
    dispatch,
  }

  const FieldComponent =
    field.fieldType != null
      ? (FIELD_COMPONENT_MAP[
          field.fieldType as keyof typeof FIELD_COMPONENT_MAP
        ] as React.ElementType)
      : undefined

  return (
    <Box marginTop={4}>
      {FieldComponent ? <FieldComponent {...fieldItems} /> : null}
    </Box>
  )
}
