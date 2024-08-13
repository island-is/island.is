import { FormSystemInput } from '@island.is/api/schema'
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
// eslint-disable-next-line @nx/enforce-module-boundaries
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
} from '@island.is/form-system/ui'

interface Props {
  data: FormSystemInput
}

export const Preview = ({ data }: Props) => {
  const { type } = data
  return (
    <Box padding={2} background="blue100">
      {type === 'Message' && <MessageWithLink item={data} />}
      {type === 'Bank_account' && (
        <div>
          <Text variant="h5">{data?.name?.is}</Text>
          <Banknumber item={data} />
        </div>
      )}
      {type === 'Email' && <Email item={data} />}
      {type === 'Date_picker' && (
        <Box marginTop={2} width="half">
          <DatePicker
            label={
              data?.name?.is === '' || !data?.name?.is
                ? 'Dagssetning'
                : data?.name?.is
            }
            placeholderText="Veldu dagsetningu"
          />
        </Box>
      )}
      {type === 'National_id' && <NationalId item={data} />}
      {type === 'Document' && <FileUpload item={data} />}
      {type === 'Textalínubox' ||
        (type === 'Textbox' && <TextInput item={data} />)}
      {type === 'Dropdown_list' && <List item={data} />}
      {type === 'Radio_buttons' && <Radio item={data} />}
      {type === 'ISK_numberbox' && <CurrencyField item={data} />}
      {type === 'Checkbox' && <Checkbox item={data} />}
      {type === 'Phone_number' && <PhoneNumber item={data} />}
      {type === 'Time_input' && <TimeInput item={data} />}
      {type === 'Property_number' && <PropertyNumber item={data} />}
      {type === 'Homestay_overview' && <HomestayOverview />}
    </Box>
  )
}
