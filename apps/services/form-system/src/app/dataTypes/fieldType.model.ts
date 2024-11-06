import { FieldTypesEnum } from '../enums/fieldTypes'
import { FieldSettings } from './fieldSettings/fieldSettings.model'
import { LanguageType } from './languageType.model'

class FieldType {
  id!: string
  type!: string
  name!: LanguageType
  description!: LanguageType
  isCommon!: boolean
  fieldSettings?: FieldSettings
}

export const FieldTypes: FieldType[] = [
  {
    id: 'db7ef634-3bec-4051-8370-e13315a7885e',
    type: FieldTypesEnum.TEXTBOX,
    name: { is: 'Textainnsláttur', en: 'Textbox' },
    description: { is: 'Notandi slær inn texta', en: 'User enters text' },
    isCommon: true,
  },
  {
    id: '2bd485da-08a3-4554-8ffc-f6632e6e5a84',
    type: FieldTypesEnum.NUMBERBOX,
    name: { is: 'Tölustafir', en: 'Numbers' },
    description: {
      is: 'Notandi slær inn tölustafi',
      en: 'User enters numbers',
    },
    isCommon: true,
  },
  {
    id: '59a38f6d-f369-4adc-8af6-9df91370073b',
    type: FieldTypesEnum.MESSAGE,
    name: { is: 'Skilaboð', en: 'Message' },
    description: {
      is: 'Skilaboð sem birtast í texta',
      en: 'Message that appears as text',
    },
    isCommon: true,
  },
  {
    id: '25a339fb-2d16-4d7f-97c5-b9fe990e7b06',
    type: FieldTypesEnum.CHECKBOX,
    name: { is: 'Hakbox', en: 'Checkbox' },
    description: { is: 'Já/nei val', en: 'Yes/no options' },
    isCommon: true,
  },
  {
    id: '29b23a4b-f94b-406b-b169-d4254fac1c56',
    type: FieldTypesEnum.DATE_PICKER,
    name: { is: 'Dagssetning', en: 'Date picker' },
    description: {
      is: 'Notandi velur dagssetningu úr dagatali',
      en: 'User chooses date from calendar',
    },
    isCommon: true,
  },
  {
    id: '9c68695e-8205-41a9-a84f-7c741ac09c05',
    type: FieldTypesEnum.DROPDOWN_LIST,
    name: { is: 'Fellilisti', en: 'Dropdown list' },
    description: {
      is: 'Notandi velur eitt gildi af nokkrum möguleikum úr lista',
      en: 'User chooses a single value from a dropdown list of options',
    },
    isCommon: true,
  },
  {
    id: '75cbc28a-c13f-4f75-bd06-26dbb37ebdde',
    type: FieldTypesEnum.RADIO_BUTTONS,
    name: { is: 'Valhnappar', en: 'Radio buttons' },
    description: {
      is: 'Notandi velur eitt gildi af nokkrum möguleikum',
      en: 'User chooses a single value from several options',
    },
    isCommon: true,
  },
  {
    id: '81e61315-ce40-4619-b33a-b5a6a5019a77',
    type: FieldTypesEnum.HOMESTAY_NUMBER,
    name: { is: 'Heimagistingarnúmer', en: 'Homestay number' },
    description: {
      is: 'Notandi slær inn heimagistingarnúmer sitt',
      en: 'User enters their homestay number',
    },
    isCommon: true,
  },
  {
    id: 'bac7d3f2-9614-4173-8e60-1e9d07f24510',
    type: FieldTypesEnum.HOMESTAY_OVERVIEW,
    name: { is: 'Heimagistingaryfirlit', en: 'Homestay overview' },
    description: {
      is: 'Notandi fyllir út nýtingaryfirlit fyrir almanaksár',
      en: 'Users fills out their homestay overview for the calendar year',
    },
    isCommon: true,
  },
  {
    id: '15a57466-0be3-451d-988d-5b807fea3459',
    type: FieldTypesEnum.PROPERTY_NUMBER,
    name: { is: 'Fasteignanúmer', en: 'Property number' },
    description: {
      is: 'Notandi velur fasteign úr lista eða slær inn fasteignanúmer',
      en: 'User chooses property from a list or enters their property number',
    },
    isCommon: true,
  },
  {
    id: '80bbf10c-0598-46a8-baea-1db4933a54da',
    type: FieldTypesEnum.BANK_ACCOUNT,
    name: { is: 'Bankareikningsnúmer', en: 'Bank account' },
    description: {
      is: 'Notandi slær inn bankareikningsnúmer sitt',
      en: 'User enters their bank account',
    },
    isCommon: true,
  },
  {
    id: '80cecd52-798d-424f-96b7-8b0a50bc70ba',
    type: FieldTypesEnum.NATIONAL_ID,
    name: { is: 'Kennitala', en: 'National Id' },
    description: {
      is: 'Notandi slær inn kennitölu sína',
      en: 'User enters their national Id',
    },
    isCommon: true,
  },
  {
    id: '44b1c9b1-5a59-4c5f-b631-bc9695a91469',
    type: FieldTypesEnum.PAYER,
    name: { is: 'Greiðandi', en: 'Payer' },
    description: {
      is: 'Notandi slær inn kennitölu greiðanda',
      en: 'User enters the national Id of the payer',
    },
    isCommon: true,
  },
  {
    id: '2261d835-6be8-40b5-a5d9-ca39a2ba9150',
    type: FieldTypesEnum.ISK_NUMBERBOX,
    name: { is: 'Krónutala', en: 'ISK number box' },
    description: {
      is: 'Notandi slær inn krónutölu',
      en: 'User enters ISK number',
    },
    isCommon: true,
  },
  {
    id: '8bcfe82c-9819-45a7-9172-f00301f5a0d9',
    type: FieldTypesEnum.ISK_SUMBOX,
    name: { is: 'Krónutölusamtala', en: 'ISK sum box' },
    description: {
      is: 'Kerfið reiknar út samtölu krónutalna',
      en: 'The system calculates the sum of ISK number boxes',
    },
    isCommon: true,
  },
  {
    id: '0ca1d057-99e2-46d4-b12a-e07af79e52d5',
    type: FieldTypesEnum.EMAIL,
    name: { is: 'Netfang', en: 'Email' },
    description: { is: 'Notandi slær inn netfang', en: 'User enters email' },
    isCommon: true,
  },
  {
    id: '5786bc16-b531-406e-83fe-511c4c39464e',
    type: FieldTypesEnum.PHONE_NUMBER,
    name: { is: 'Símanúmer', en: 'Phone number' },
    description: {
      is: 'Notandi slær inn símanúmer',
      en: 'User enters phone number',
    },
    isCommon: true,
  },
  {
    id: 'ae7486cb-c434-48ce-8e8e-3f79e890ac46',
    type: FieldTypesEnum.TIME_INPUT,
    name: { is: 'Tími', en: 'time' },
    description: {
      is: 'Notandi velur/slær inn tíma',
      en: 'User chooses/enters time',
    },
    isCommon: true,
  },
  {
    id: '7cbbe78f-cd5f-4fb9-a77c-86af2bf986b1',
    type: FieldTypesEnum.DOCUMENT,
    name: { is: 'Skjal', en: 'Document' },
    description: {
      is: 'Notandi hleður upp skjali/skjölum',
      en: 'User uploads file/s',
    },
    isCommon: true,
  },
  {
    id: 'c1e82fc0-e609-4503-87bd-37379e4f5d54',
    type: FieldTypesEnum.PAYMENT,
    name: { is: 'Greiðsla', en: 'Payment' },
    description: { is: 'Greiðsla', en: 'Payment' },
    isCommon: true,
  },
  {
    id: '49599a07-4d06-4ad4-9927-b55eab2dd97d',
    type: FieldTypesEnum.NATIONAL_ID_ESTATE,
    name: { is: 'Kennitala dánarbús', en: 'National Id estate' },
    description: {
      is: 'Notandi slær inn kennitölu sem við flettum upp í gagnagrunni látinna',
      en: 'User enters national Id that we look up in database of deceaced',
    },
    isCommon: false,
  },
  {
    id: 'ad67a9c3-f5d9-47eb-bcf9-dd34becf4b76',
    type: FieldTypesEnum.NATIONAL_ID_ALL,
    name: { is: 'Kennitala allt', en: 'National Id all' },
    description: {
      is: 'Notandi slær inn kennitölu sem við flettum upp í öllum gagnagrunnum',
      en: 'User enters national Id that we look up in all databases',
    },
    isCommon: false,
  },
]
