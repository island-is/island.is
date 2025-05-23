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
import { FormSystemField } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import { useLocale } from '@island.is/localization'

interface Props {
  field: FormSystemField
  hasError: boolean
}
export const Field = ({ field, hasError }: Props) => {
  const { lang } = useLocale()
  const { dispatch } = useApplicationContext()
  const fieldItems = {
    item: field,
    hasError,
    dispatch,
    lang,
  }

  return (
    <Box marginTop={4}>
      {field.fieldType === FieldTypesEnum.BANK_ACCOUNT && (
        <Banknumber {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.CHECKBOX && (
        <Checkbox {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.MESSAGE && (
        <MessageWithLink item={field} />
      )}
      {field.fieldType === FieldTypesEnum.ISK_NUMBERBOX && (
        <CurrencyField {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.EMAIL && <Email {...fieldItems} />}
      {field.fieldType === FieldTypesEnum.FILE && <FileUpload item={field} />}
      {field.fieldType === FieldTypesEnum.NATIONAL_ID && (
        <NationalId {...fieldItems} /> // TODO: need to implement fetching name from nationalId
      )}
      {field.fieldType === FieldTypesEnum.PHONE_NUMBER && (
        <PhoneNumber {...fieldItems} /> // TODO: need to find out how the country code can be extracted from PhoneInput
      )}
      {field.fieldType === FieldTypesEnum.PROPERTY_NUMBER && (
        <PropertyNumber {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.RADIO_BUTTONS && (
        <Radio {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.TEXTBOX && (
        <TextInput {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.TIME_INPUT && (
        <TimeInput item={field} />
      )}
      {field.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <List {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.DATE_PICKER && (
        <DatePicker {...fieldItems} />
      )}
    </Box>
  )
}
