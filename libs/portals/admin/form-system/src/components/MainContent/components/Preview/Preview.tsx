import { FormSystemField } from '@island.is/api/schema'
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
import {
  Banknumber,
  MessageWithLink,
  CurrencyField,
  Email,
  FileUpload,
  NationalId,
  PhoneNumber,
  PropertyNumber,
  Radio,
  TextInput,
  TimeInput,
  Checkbox,
  List,
  m,
} from '@island.is/form-system/ui'
import { FieldTypesEnum } from '@island.is/form-system/enums'
import { useIntl } from 'react-intl'
import { useForm, FormProvider } from 'react-hook-form'

interface Props {
  data: FormSystemField
}

export const Preview = ({ data }: Props) => {
  const type = data.fieldType
  const methods = useForm()
  const { formatMessage } = useIntl()
  return (
    <FormProvider {...methods}>
      <Box padding={2} background="blue100">
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
