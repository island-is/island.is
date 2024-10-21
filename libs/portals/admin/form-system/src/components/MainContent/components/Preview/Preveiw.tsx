import { FormSystemField, FormSystemFieldDtoFieldTypeEnum } from '@island.is/api/schema'
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
  HomestayOverview,
  m
} from '@island.is/form-system/ui'
import { useIntl } from 'react-intl'


interface Props {
  data: FormSystemField
}

export const Preview = ({ data }: Props) => {
  const { fieldType: type } = data
  const { formatMessage } = useIntl()
  return (
    <Box padding={2} background="blue100">
      {type === FormSystemFieldDtoFieldTypeEnum.Message && <MessageWithLink item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.BankAccount && (
        <div>
          <Text variant="h5">{data?.name?.is}</Text>
          <Banknumber item={data} />
        </div>
      )}
      {type === FormSystemFieldDtoFieldTypeEnum.Email && <Email item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.DatePicker && (
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
      {type === FormSystemFieldDtoFieldTypeEnum.NationalId && <NationalId item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.Document && <FileUpload item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.Textbox && <TextInput item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.DropdownList && <List item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.RadioButtons && <Radio item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.IskNumberbox && <CurrencyField item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.Checkbox && <Checkbox item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.PhoneNumber && <PhoneNumber item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.TimeInput && <TimeInput item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.PropertyNumber && <PropertyNumber item={data} />}
      {type === FormSystemFieldDtoFieldTypeEnum.HomestayOverview && <HomestayOverview />}
    </Box>
  )
}
