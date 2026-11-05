import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  Action,
  ApplicationState,
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
import { Dispatch, ElementType, useEffect, useReducer } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PreviewApplicant } from '../PreviewStepOrGroup/components/PreviewSections'
import { updatePreviewFields } from '../PreviewStepOrGroup/previewState'

interface Props {
  data: FormSystemField
  screenOrSection?: boolean
  valueIndex?: number
  dispatch?: Dispatch<Action>
  state?: Pick<ApplicationState, 'currentScreen'>
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

const updateSingleFieldPreview = (
  fields: FormSystemField[],
  action: Action,
): FormSystemField[] =>
  action.type === 'SYNC_PREVIEW_CONFIGURATION'
    ? [{ ...action.payload.data, values: fields[0].values }]
    : updatePreviewFields(fields, action)

export const Preview = ({
  data,
  screenOrSection,
  valueIndex = 0,
  dispatch,
  state,
}: Props) => {
  const methods = useForm()
  const { lang } = useLocale()
  const [previewFields, previewDispatch] = useReducer(
    updateSingleFieldPreview,
    [data],
  )
  useEffect(() => {
    if (!dispatch) {
      previewDispatch({
        type: 'SYNC_PREVIEW_CONFIGURATION',
        payload: { data },
      })
    }
  }, [data, dispatch])
  const previewItem = dispatch ? data : previewFields[0]
  const FieldComponent = data.fieldType
    ? (fieldComponents[
        data.fieldType as keyof typeof fieldComponents
      ] as ElementType)
    : undefined
  const fieldContent = FieldComponent ? (
    <FieldComponent
      item={previewItem}
      valueIndex={valueIndex}
      lang={lang}
      dispatch={dispatch ?? previewDispatch}
      state={state}
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
