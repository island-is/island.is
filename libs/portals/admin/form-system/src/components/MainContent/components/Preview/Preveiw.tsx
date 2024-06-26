import { FormSystemInput } from '@island.is/api/schema'
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
import { MessageWithLink } from './components/MessageWithLink'
import { Banknumber } from './components/Banknumber'
import { Email } from './components/Email'
import { NationalId } from './components/NationalId'
import { FileUpload } from './components/FileUpload'
import { TextInput } from './components/TextInput'
import { List } from './components/List'
import { Radio } from './components/Radio'
import { Currency } from './components/Currency'
import { CheckboxPreview } from './components/CheckboxPreview'

interface Props {
  data: FormSystemInput
}

export const Preview = ({ data }: Props) => {
  const { type } = data
  return (
    <Box padding={2} background="blue100">
      {type === 'Message' && <MessageWithLink data={data} />}
      {type === 'Bank_account' && (
        <div>
          <Text variant="h5">{data?.name?.is}</Text>
          <Banknumber currentItem={data} />
        </div>
      )}
      {type === 'Email' && <Email currentItem={data} />}
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
      {type === 'National_id' && <NationalId currentItem={data} />}
      {type === 'Document' && <FileUpload currentItem={data} />}
      {type === 'Textalínubox' ||
        (type === 'Textbox' && <TextInput data={data} />)}
      {type === 'Dropdown_list' && <List currentItem={data} />}
      {type === 'Radio_buttons' && <Radio currentItem={data} />}
      {type === 'ISK_numberbox' && <Currency currentItem={data} />}
      {type === 'Checkbox' && <CheckboxPreview currentItem={data} />}
    </Box>
  )
}
