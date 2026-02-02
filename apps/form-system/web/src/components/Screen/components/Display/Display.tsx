import { FormSystemField } from '@island.is/api/schema'
import {
  ApplicantDisplay,
  CheckBoxDisplay,
  DateDisplay,
  DefaultDisplay,
  FieldTypesEnum,
  FileUploadDisplay,
  NationalIdDisplay,
} from '@island.is/form-system/ui'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  field: FormSystemField
}

const FIELD_COMPONENT_MAP = {
  [FieldTypesEnum.BANK_ACCOUNT]: DefaultDisplay,
  [FieldTypesEnum.ISK_NUMBERBOX]: DefaultDisplay,
  [FieldTypesEnum.EMAIL]: DefaultDisplay,
  [FieldTypesEnum.NATIONAL_ID]: NationalIdDisplay,
  [FieldTypesEnum.PHONE_NUMBER]: DefaultDisplay,
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
} as const

export const Display = ({ field }: Props) => {
  const { lang } = useLocale()
  const fieldItems = {
    item: field,
    lang,
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
