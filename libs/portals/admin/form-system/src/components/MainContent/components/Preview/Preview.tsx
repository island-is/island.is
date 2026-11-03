import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  Banknumber,
  Checkbox,
  CurrencyField,
  CurrencySumField,
  Email,
  FileUpload,
  List,
  m,
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
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import addDays from 'date-fns/addDays'
import max from 'date-fns/max'
import min from 'date-fns/min'
import parseISO from 'date-fns/parseISO'
import startOfDay from 'date-fns/startOfDay'
import { FormProvider, useForm } from 'react-hook-form'

interface Props {
  data: FormSystemField
  screenOrSection?: boolean
}

export const Preview = ({ data, screenOrSection }: Props) => {
  const type = data.fieldType
  const methods = useForm()
  const { formatMessage } = useLocale()
  const today = startOfDay(new Date())
  const settings = data.fieldSettings
  const fixedMinDate = settings?.minDate
    ? parseISO(settings.minDate)
    : undefined
  const fixedMaxDate = settings?.maxDate
    ? parseISO(settings.maxDate)
    : undefined
  const minDate =
    settings?.minDateDaysFromToday != null
      ? addDays(today, settings.minDateDaysFromToday)
      : fixedMinDate ?? new Date(1970, 0)
  const maxDate =
    settings?.maxDateDaysFromToday != null
      ? addDays(today, settings.maxDateDaysFromToday)
      : fixedMaxDate

  const fieldContent = (
    <>
      {type === FieldTypesEnum.MESSAGE && <MessageWithLink item={data} />}
      {type === FieldTypesEnum.BANK_ACCOUNT && <Banknumber item={data} />}
      {type === FieldTypesEnum.EMAIL && <Email item={data} />}
      {type === FieldTypesEnum.DATE_PICKER && (
        <Box marginTop={2} width="half">
          <DatePicker
            label={
              data?.name?.is === '' || !data?.name?.is
                ? formatMessage(m.datePicker)
                : data?.name?.is
            }
            placeholderText={formatMessage(m.chooseDate)}
            minDate={fixedMinDate ? max([fixedMinDate, minDate]) : minDate}
            maxDate={
              fixedMaxDate && maxDate ? min([fixedMaxDate, maxDate]) : maxDate
            }
          />
        </Box>
      )}
      {type === FieldTypesEnum.NATIONAL_ID && <NationalId item={data} />}
      {type === FieldTypesEnum.FILE && <FileUpload item={data} />}
      {type === FieldTypesEnum.TEXTBOX && <TextInput item={data} />}
      {type === FieldTypesEnum.NUMBERBOX && <NumberInput item={data} />}
      {type === FieldTypesEnum.DROPDOWN_LIST && <List item={data} />}
      {type === FieldTypesEnum.RADIO_BUTTONS && <Radio item={data} />}
      {type === FieldTypesEnum.ISK_NUMBERBOX && <CurrencyField item={data} />}
      {type === FieldTypesEnum.CHECKBOX && <Checkbox item={data} />}
      {type === FieldTypesEnum.PHONE_NUMBER && <PhoneNumber item={data} />}
      {type === FieldTypesEnum.TIME_INPUT && <TimeInput item={data} />}
      {type === FieldTypesEnum.PROPERTY_NUMBER && (
        <PropertyNumber item={data} />
      )}
      {type === FieldTypesEnum.PAYMENT_QUANTITY && (
        <PaymentQuantity item={data} />
      )}
      {type === FieldTypesEnum.ISK_SUMBOX && <CurrencySumField item={data} />}
    </>
  )

  return (
    <FormProvider {...methods}>
      {screenOrSection ? (
        // End-user view: render the field exactly like form-system-web's Field
        <Box marginTop={4}>{fieldContent}</Box>
      ) : (
        <Box padding={2} border="standard" borderRadius="large">
          <Text variant="h5" marginBottom={4}>
            {formatMessage(m.previewField)}
          </Text>
          {fieldContent}
        </Box>
      )}
    </FormProvider>
  )
}
