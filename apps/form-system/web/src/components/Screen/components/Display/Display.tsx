import {
  TextBoxDisplay,
  FieldTypesEnum,
} from '@island.is/form-system/ui'
import { FormSystemField } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

interface Props {
  field: FormSystemField
}

const FIELD_COMPONENT_MAP = {
    [FieldTypesEnum.BANK_ACCOUNT]: TextBoxDisplay,
    [FieldTypesEnum.ISK_NUMBERBOX]: TextBoxDisplay,
    [FieldTypesEnum.EMAIL]: TextBoxDisplay,
    [FieldTypesEnum.NATIONAL_ID]: TextBoxDisplay,
    [FieldTypesEnum.PHONE_NUMBER]: TextBoxDisplay,
    [FieldTypesEnum.TEXTBOX]: TextBoxDisplay,
    [FieldTypesEnum.TIME_INPUT]: TextBoxDisplay,
    [FieldTypesEnum.DATE_PICKER]: TextBoxDisplay,
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
      : undefined

  return (
    <Box paddingTop={5}>
      {FieldComponent ? <FieldComponent {...fieldItems} /> : null}
    </Box>
  )
}
