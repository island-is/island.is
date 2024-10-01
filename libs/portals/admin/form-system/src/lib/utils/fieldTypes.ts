import { Option } from '@island.is/island-ui/core'
//TODO: use the enum from the schema
/* eslint-disable @typescript-eslint/naming-convention */
enum FieldTypes {
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

export const getFieldTypeValue = (type: string) => {
  return FieldTypes[type as keyof typeof FieldTypes] || FieldTypes.Default
}

export const getFieldTypeKey = (value: string) => {
  return (
    Object.keys(FieldTypes).find(
      (key) => FieldTypes[key as keyof typeof FieldTypes] === value,
    ) || ''
  )
}

export const fieldTypesSelectObject = (): readonly Option<string>[] => {
  const fieldTypes = Object.keys(FieldTypes).map((key) => ({
    label: FieldTypes[key as keyof typeof FieldTypes],
    value: key,
  }))
  return fieldTypes
}
