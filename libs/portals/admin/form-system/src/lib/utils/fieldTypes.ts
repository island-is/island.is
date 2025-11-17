import { FieldTypesEnum } from '@island.is/form-system/enums'
import { Option } from '@island.is/island-ui/core'

/* eslint-disable @typescript-eslint/naming-convention */
enum FieldTypes {
  BANK_ACCOUNT = 'Bankareikningur',
  DATE_PICKER = 'Dagsetningarval',
  DROPDOWN_LIST = 'Fellilisti',
  PAYER = 'Greiðandi',
  PAYMENT = 'Greiðsla',
  CHECKBOX = 'Hakbox',
  HOMESTAY_NUMBER = 'Heimagistingarnúmer',
  NATIONAL_ID = 'Kennitala',
  NATIONAL_ID_ALL = 'Kennitala (allt)',
  NATIONAL_ID_ESTATE = 'Kennitala (dánarbú)',
  TIME_INPUT = 'Klúkkuinnsláttur',
  ISK_NUMBERBOX = 'Krónutölubox',
  ISK_SUMBOX = 'Krónutölusumma',
  EMAIL = 'Netfang',
  PROPERTY_NUMBER = 'Fasteignanúmer',
  PHONE_NUMBER = 'Símanúmer',
  FILE = 'Skjal',
  MESSAGE = 'Skilaboð',
  TEXTBOX = 'Textabox',
  NUMBERBOX = 'Tölubox',
  RADIO_BUTTONS = 'Valhnappar',
  APPLICANT = 'Umsækjandi',
}

export const getFieldTypeValue = (type: string) => {
  return FieldTypes[type as keyof typeof FieldTypes]
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
    value: FieldTypesEnum[key as keyof typeof FieldTypes],
  }))
  return fieldTypes
}
