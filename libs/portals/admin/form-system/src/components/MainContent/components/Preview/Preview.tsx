import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  Action,
  Asset,
  Banknumber,
  Checkbox,
  CurrencyField,
  CurrencySumField,
  DatePicker,
  Email,
  Family,
  FileUpload,
  List,
  MessageWithLink,
  NationalId,
  NumberInput,
  PaymentQuantity,
  PhoneNumber,
  PropertyNumber,
  Radio,
  TextInput,
  TimeInput,
} from '@island.is/form-system/ui'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, ElementType } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PreviewApplicant } from '../PreviewStepOrGroup/components/PreviewSections'

interface Props {
  data: FormSystemField
  screenOrSection?: boolean
  valueIndex?: number
  dispatch?: Dispatch<Action>
}

const fieldComponents = {
  [FieldTypesEnum.APPLICANT]: PreviewApplicant,
  [FieldTypesEnum.MESSAGE]: MessageWithLink,
  [FieldTypesEnum.BANK_ACCOUNT]: Banknumber,
  [FieldTypesEnum.EMAIL]: Email,
  [FieldTypesEnum.DATE_PICKER]: DatePicker,
  [FieldTypesEnum.NATIONAL_ID]: NationalId,
  [FieldTypesEnum.FILE]: FileUpload,
  [FieldTypesEnum.TEXTBOX]: TextInput,
  [FieldTypesEnum.NUMBERBOX]: NumberInput,
  [FieldTypesEnum.DROPDOWN_LIST]: List,
  [FieldTypesEnum.RADIO_BUTTONS]: Radio,
  [FieldTypesEnum.ISK_NUMBERBOX]: CurrencyField,
  [FieldTypesEnum.CHECKBOX]: Checkbox,
  [FieldTypesEnum.PHONE_NUMBER]: PhoneNumber,
  [FieldTypesEnum.TIME_INPUT]: TimeInput,
  [FieldTypesEnum.PROPERTY_NUMBER]: PropertyNumber,
  [FieldTypesEnum.PAYMENT_QUANTITY]: PaymentQuantity,
  [FieldTypesEnum.ISK_SUMBOX]: CurrencySumField,
  [FieldTypesEnum.ASSETS]: Asset,
  [FieldTypesEnum.FAMILY]: Family,
}

export const Preview = ({
  data,
  screenOrSection,
  valueIndex = 0,
  dispatch,
}: Props) => {
  const methods = useForm()
  const { lang } = useLocale()
  const FieldComponent = data.fieldType
    ? (fieldComponents[
        data.fieldType as keyof typeof fieldComponents
      ] as ElementType)
    : undefined
  const fieldContent = FieldComponent ? (
    <FieldComponent
      item={data}
      valueIndex={valueIndex}
      lang={lang}
      dispatch={dispatch}
    />
  ) : null

  if (screenOrSection) {
    if (data.fieldType === FieldTypesEnum.APPLICANT) return fieldContent
    return <Box marginTop={4}>{fieldContent}</Box>
  }

  return (
    <FormProvider {...methods}>
      <Box padding={2} border="standard" borderRadius="large">
        {fieldContent}
      </Box>
    </FormProvider>
  )
}
