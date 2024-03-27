import {
  Box,
  GridColumn as Column,
  Text,
  Input,
  DatePicker,
  Checkbox,
} from '@island.is/island-ui/core'
import Banknumber from './components/Banknumber'
import TimeSelect from './components/TimeSelect'
import Currency from './components/Currency'
import { MessageWithLinkButton } from './components/MessageWithLinkButton'
import Email from './components/Email'
import FileUpload from './components/FileUpload'
import PhoneInput from './components/PhoneInput'
import NumberInput from './components/NumberInput'
import List from './components/List'
import { IInputSettings, IInput } from '../../../../types/interfaces'
import NationalId from './components/NationalId'
import Radio from './components/Radio'
import UtilizationSummary from './components/UtilizationSummary/UtilizationSummary'
import PropertyNumber from './components/PropertyNumber/PropertyNumber'

type Props = {
  data: IInput
  isLarge?: boolean
  inputSettings?: IInputSettings
}

export default function Preview({ data, isLarge }: Props) {
  const { inputSettings } = data
  const title = (title: string) => <Text variant="h5">{title}</Text>
  return (
    <>
      <Box
        padding={2}
        style={{
          width: '100%',
          height: '100%',
        }}
        background={'blue100'}
      >
        {/* Bankanumer */}
        {data.type === 'Bankareikningur' && (
          <Box>
            {title(data.name.is)}
            <Banknumber />
          </Box>
        )}
        {/* Dagsetning */}
        {data.type === 'Dagssetningarval' && (
          <Box marginTop={2}>
            <Column offset="3/12" span="6/12">
              <DatePicker
                label={data.name.is}
                placeholderText="Veldu dagsetningu"
              />
            </Column>
          </Box>
        )}
        {/* Kennitala */}
        {data.type === 'Kennitala' && <NationalId />}
        {/* Hakbox */}
        {data.type === 'Hakbox' && <Checkbox label={data.name.is} />}
        {/* Textalinubox */}
        {data.type === 'Textalínubox' && (
          <Input
            label={data.name.is}
            name="text"
            size={inputSettings.size}
            textarea={isLarge}
          />
        )}
        {data.type === 'Klukkuinnsláttur' && (
          <Column span="10/10">
            <TimeSelect />
          </Column>
        )}
        {data.type === 'Krónutölubox' && (
          <Box>
            <Column span="10/10">
              <Currency label={data.name.is} />
            </Column>
          </Box>
        )}
        {data.type === 'Heimagistingarnúmer' && (
          <Box>
            <UtilizationSummary />
          </Box>
        )}
        {data.type === 'Textalýsing' && (
          <MessageWithLinkButton data={data} settings={inputSettings} />
        )}
        {data.type === 'Netfang' && <Email />}
        {data.type === 'Skjal' && <FileUpload currentItem={data as IInput} />}
        {data.type === 'Símanúmer' && (
          <PhoneInput currentItem={data as IInput} />
        )}
        {data.type === 'Tölustafir' && (
          <NumberInput currentItem={data as IInput} />
        )}
        {data.type === 'Fellilisti' && <List currentItem={data as IInput} />}
        {data.type === 'Valhnappar' && <Radio />}
        {data.type === 'Fasteignanúmer' && (
          <PropertyNumber currentItem={data as IInput} />
        )}
      </Box>
    </>
  )
}
