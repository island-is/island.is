import { Banknumber, Checkbox, CurrencyField, Email, FieldTypesEnum, FileUpload, List, MessageWithLink, NationalId, PhoneNumber, PropertyNumber, Radio, TextInput, TimeInput } from '@island.is/form-system/ui'
import { FormSystemField } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useApplicationContext } from '../../../../context/ApplicationProvider'


interface Props {
  field: FormSystemField
}
export const Field = ({ field }: Props) => {

  const { dispatch } = useApplicationContext()
  const fieldItems = {
    item: field,
    dispatch
  }

  return (
    <Box marginTop={4} >
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
        <CurrencyField {...fieldItems} /> // not finished
      )}
      {field.fieldType === FieldTypesEnum.EMAIL && (
        <Email {...fieldItems} />
      )}
      {field.fieldType === FieldTypesEnum.DOCUMENT && (
        <FileUpload item={field} />
      )}
      {field.fieldType === FieldTypesEnum.NATIONAL_ID && (
        <NationalId item={field} />
      )}
      {field.fieldType === FieldTypesEnum.PHONE_NUMBER && (
        <PhoneNumber item={field} />
      )}
      {field.fieldType === FieldTypesEnum.PROPERTY_NUMBER && (
        <PropertyNumber item={field} />
      )}
      {field.fieldType === FieldTypesEnum.RADIO_BUTTONS && (
        <Radio item={field} />
      )}
      {field.fieldType === FieldTypesEnum.TEXTBOX && (
        <TextInput item={field} />
      )}
      {field.fieldType === FieldTypesEnum.TIME_INPUT && (
        <TimeInput item={field} />
      )}
      {field.fieldType === FieldTypesEnum.DROPDOWN_LIST && (
        <List {...fieldItems} />
      )}
    </Box>
  )
}