import { FormSystemField } from '@island.is/api/schema'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import {
  Banknumber,
  Checkbox,
  CurrencyField,
  Email,
  FileUpload,
  List,
  m,
  MessageWithLink,
  NationalId,
  PhoneNumber,
  PropertyNumber,
  Radio,
  TextInput,
  TimeInput,
} from '@island.is/form-system/ui'
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FormProvider, useForm } from 'react-hook-form'

interface Props {
  data: FormSystemField
  screenOrSection?: boolean
}

export const Preview = ({ data, screenOrSection }: Props) => {
  const type = data.fieldType
  const methods = useForm()
  const { formatMessage } = useLocale()
  return (
    <FormProvider {...methods}>
      <Box padding={2} border="standard" borderRadius="large">
        {!screenOrSection && (
          <Text variant="h5" marginBottom={4}>
            {formatMessage(m.previewField)}
          </Text>
        )}

        {type === FieldTypesEnum.MESSAGE && <MessageWithLink item={data} />}
        {type === FieldTypesEnum.BANK_ACCOUNT && (
          <div>
            <Text variant="h5">{data?.name?.is}</Text>
            <Banknumber item={data} />
          </div>
        )}
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
            />
          </Box>
        )}
        {type === FieldTypesEnum.NATIONAL_ID && <NationalId item={data} />}
        {type === FieldTypesEnum.FILE && <FileUpload item={data} />}
        {type === FieldTypesEnum.TEXTBOX && <TextInput item={data} />}
        {type === FieldTypesEnum.DROPDOWN_LIST && <List item={data} />}
        {type === FieldTypesEnum.RADIO_BUTTONS && <Radio item={data} />}
        {type === FieldTypesEnum.ISK_NUMBERBOX && <CurrencyField item={data} />}
        {type === FieldTypesEnum.CHECKBOX && <Checkbox item={data} />}
        {type === FieldTypesEnum.PHONE_NUMBER && <PhoneNumber item={data} />}
        {type === FieldTypesEnum.TIME_INPUT && <TimeInput item={data} />}
        {type === FieldTypesEnum.PROPERTY_NUMBER && (
          <PropertyNumber item={data} />
        )}
      </Box>
    </FormProvider>
  )
}
