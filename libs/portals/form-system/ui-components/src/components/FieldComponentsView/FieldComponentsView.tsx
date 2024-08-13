import { FormSystemInput } from '@island.is/api/schema'
import { Box } from '@island.is/island-ui/core'
import { Banknumber, Checkbox, CurrencyField, DatePicker, Email, FileUpload, HomestayOverview, List, MessageWithLink, NationalId, PhoneNumber, PropertyNumber, Radio, TextInput, TimeInput } from '../field-components'

interface Props {
  data: FormSystemInput
}

export const FieldComponentsView = ({ data }: Props) => {
  const { type } = data

  const renderComponent = () => {
    switch (type) {
      case 'Message':
        return <MessageWithLink item={data} />
      case 'Bank_account':
        return <Banknumber item={data} />
      case 'Email':
        return <Email item={data} />
      case 'Date_picker':
        return <DatePicker name={data?.name?.is ?? ''} />
      case 'National_id':
        return <NationalId item={data} />
      case 'Document':
        return <FileUpload item={data} />
      case 'Textalínubox':
      case 'Textbox':
        return <TextInput item={data} />
      case 'Dropdown_list':
        return <List item={data} />
      case 'Radio_buttons':
        return <Radio item={data} />
      case 'ISK_numberbox':
        return <CurrencyField item={data} />
      case 'Checkbox':
        return <Checkbox item={data} />
      case 'Phone_number':
        return <PhoneNumber item={data} />
      case 'Time_input':
        return <TimeInput item={data} />
      case 'Property_number':
        return <PropertyNumber item={data} />
      case 'Homestay_overview':
        return <HomestayOverview />
      default:
        return null
    }
  }

  return (
    <Box
      padding={2}
      background="blue100"
    >
      {renderComponent()}
    </Box>
  )
}
