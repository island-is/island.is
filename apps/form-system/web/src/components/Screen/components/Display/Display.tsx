import { FormSystemField } from '@island.is/api/schema'
import {
  ApplicantDisplay,
  CheckBoxDisplay,
  DateDisplay,
  DefaultDisplay,
  FieldTypesEnum,
  FileUploadDisplay,
  NationalIdDisplay,
  PhoneNumberDisplay,
} from '@island.is/form-system/ui'
import { Box } from '@island.is/island-ui/core'

interface Props {
  field: FormSystemField
  valueIndex?: number
}

const FIELD_COMPONENT_MAP = {
  [FieldTypesEnum.BANK_ACCOUNT]: DefaultDisplay,
  [FieldTypesEnum.ISK_NUMBERBOX]: DefaultDisplay,
  [FieldTypesEnum.ISK_SUMBOX]: DefaultDisplay,
  [FieldTypesEnum.EMAIL]: DefaultDisplay,
  [FieldTypesEnum.NATIONAL_ID]: NationalIdDisplay,
  [FieldTypesEnum.PHONE_NUMBER]: PhoneNumberDisplay,
  [FieldTypesEnum.TEXTBOX]: DefaultDisplay,
  [FieldTypesEnum.NUMBERBOX]: DefaultDisplay,
  [FieldTypesEnum.TIME_INPUT]: DefaultDisplay,
  [FieldTypesEnum.DATE_PICKER]: DateDisplay,
  [FieldTypesEnum.DROPDOWN_LIST]: DefaultDisplay,
  [FieldTypesEnum.CHECKBOX]: CheckBoxDisplay,
  [FieldTypesEnum.FILE]: FileUploadDisplay,
  [FieldTypesEnum.PROPERTY_NUMBER]: DefaultDisplay,
  [FieldTypesEnum.RADIO_BUTTONS]: DefaultDisplay,
  [FieldTypesEnum.MESSAGE]: DefaultDisplay,
  [FieldTypesEnum.APPLICANT]: ApplicantDisplay,
  [FieldTypesEnum.PAYMENT_QUANTITY]: DefaultDisplay,
} as const

export const Display = ({ field, valueIndex = 0 }: Props) => {
  const fieldItems = {
    item: field,
    valueIndex,
  }

  const FieldComponent =
    field.fieldType != null
      ? (FIELD_COMPONENT_MAP[
          field.fieldType as keyof typeof FIELD_COMPONENT_MAP
        ] as React.ElementType)
      : DefaultDisplay

  return (
    <Box paddingLeft={2} marginTop={1}>
      {<FieldComponent {...fieldItems} />}
    </Box>
  )
}
