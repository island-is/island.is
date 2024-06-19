import { Option } from '@island.is/island-ui/core'
/* eslint-disable @typescript-eslint/naming-convention */
enum InputTypes {
  Bank_account = 'Bankareikningur',
  Date_picker = 'Dagsetningarval',
  Default = 'Default',
  Dropdown_list = 'Fellilisti',
  Payer = 'Greiðandi',
  Payment = 'Greiðsla',
  Checkbox = 'Hakbox',
  Homestay_number = 'Heimagistingarnúmer',
  Homestay_overview = 'Heimagistingaryfirlit',
  National_id = 'Kennitala',
  National_id_all = 'Kennitala (allt)',
  National_id_estate = 'Kennitala (dánarbú)',
  Time_input = 'Klúkkuinnsláttur',
  ISK_numberbox = 'Krónutölubox',
  ISK_sumbox = 'Krónutölusumma',
  Email = 'Netfang',
  Property_number = 'Fasteignanúmer',
  Phone_number = 'Símanúmer',
  Document = 'Skjal',
  Message = 'Textalýsing',
  Textbox = 'Textabox',
  Numberbox = 'Tölubox',
  Radio_buttons = 'Valhnappar',
}

export const getInputTypeValue = (type: string) => {
  return InputTypes[type as keyof typeof InputTypes] || InputTypes.Default
}

export const getInputTypeKey = (value: string) => {
  return (
    Object.keys(InputTypes).find(
      (key) => InputTypes[key as keyof typeof InputTypes] === value,
    ) || ''
  )
}

export const inputTypesSelectObject = (): readonly Option<string>[] => {
  const inputTypes = Object.keys(InputTypes).map((key) => ({
    label: InputTypes[key as keyof typeof InputTypes],
    value: key,
  }))
  return inputTypes
}
