import { FormSystemInput } from '@island.is/api/schema'
import { Box, DatePicker, Text } from '@island.is/island-ui/core'
import MessageWithLink from './components/MessageWithLink'
import Banknumber from './components/Banknumber'
import Email from './components/Email'
import NationalId from './components/NationalId'
import FileUpload from './components/FileUpload'
import TextInput from './components/TextInput'
import List from './components/List'
import Radio from './components/Radio'
import Currency from './components/Currency'
import CheckboxPreview from './components/CheckboxPreview'

interface Props {
  data: FormSystemInput
}

const Preview = ({ data }: Props) => {
  const { type } = data
  return (
    <Box padding={2} background="blue100">
      {type === 'Textalýsing' && <MessageWithLink data={data} />}
      {type === 'Bankareikningur' && (
        <Box>
          <Text variant="h5">{data?.name?.is}</Text>
          <Banknumber currentItem={data} />
        </Box>
      )}
      {type === 'Netfang' && <Email currentItem={data} />}
      {type === 'Dagssetningarval' && (
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
      {type === 'Kennitala' && <NationalId currentItem={data} />}
      {type === 'Skjal' && <FileUpload currentItem={data} />}
      {type === 'Textalínubox' ||
        (type === 'TextaInnsláttur' && <TextInput data={data} />)}
      {type === 'Fellilisti' && <List currentItem={data} />}
      {type === 'Valhnappar' && <Radio currentItem={data} />}
      {type === 'Krónutölubox' && <Currency currentItem={data} />}
      {type === 'Hakbox' && <CheckboxPreview currentItem={data} />}
    </Box>
  )
}

export default Preview
