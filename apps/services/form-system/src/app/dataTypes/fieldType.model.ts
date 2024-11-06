import { FieldTypesEnum } from '../enums/fieldTypes'
import { ValueDto } from '../modules/values/models/dto/value.dto'
import { Value } from '../modules/values/models/value.model'
import { FieldSettings } from './fieldSettings/fieldSettings.model'
import { LanguageType } from './languageType.model'
import { ValueType } from './valueTypes/valueType.model'

export class FieldType {
  type!: string
  id!: string
  name!: LanguageType
  description!: LanguageType
  isCommon!: boolean
  fieldSettings?: FieldSettings
  values?: ValueDto[]
}

export const FieldTypes: FieldType[] = [
  {
    id: 'b6a7e297-22fd-4426-a4e1-04a11a2e8914',
    type: FieldTypesEnum.TEXTBOX,
    name: { is: 'Textainnsláttur', en: 'Textbox' },
    description: { is: 'Notandi slær inn texta', en: 'User enters text' },
    isCommon: true,
  },
  {
    id: 'd6c292c7-4e7c-44a6-bb7e-b956122598b0',
    type: FieldTypesEnum.NUMBERBOX,
    name: { is: 'Tölustafir', en: 'Numbers' },
    description: {
      is: 'Notandi slær inn tölustafi',
      en: 'User enters numbers',
    },
    isCommon: true,
  },
  {
    id: 'ff7f8580-0419-4f07-9551-fc407d6fb796',
    type: FieldTypesEnum.MESSAGE,
    name: { is: 'Skilaboð', en: 'Message' },
    description: {
      is: 'Skilaboð sem birtast í texta',
      en: 'Message that appears as text',
    },
    isCommon: true,
  },
  {
    id: 'f806a35b-12c9-4d24-8845-024f77e077f7',
    type: FieldTypesEnum.CHECKBOX,
    name: { is: 'Hakbox', en: 'Checkbox' },
    description: { is: 'Já/nei val', en: 'Yes/no options' },
    isCommon: true,
  },
  {
    id: '1955db2d-c1e3-42ed-b6c5-a668c6136e38',
    type: FieldTypesEnum.DATE_PICKER,
    name: { is: 'Dagssetning', en: 'Date picker' },
    description: {
      is: 'Notandi velur dagssetningu úr dagatali',
      en: 'User chooses date from calendar',
    },
    isCommon: true,
  },
  {
    id: '720fb3a3-6a85-456e-8173-b5913e219dc5',
    type: FieldTypesEnum.DROPDOWN_LIST,
    name: { is: 'Fellilisti', en: 'Dropdown list' },
    description: {
      is: 'Notandi velur eitt gildi af nokkrum möguleikum úr lista',
      en: 'User chooses a single value from a dropdown list of options',
    },
    isCommon: true,
  },
  {
    id: 'eee2840d-a26f-4e9b-a21b-e4478c09e546',
    type: FieldTypesEnum.RADIO_BUTTONS,
    name: { is: 'Valhnappar', en: 'Radio buttons' },
    description: {
      is: 'Notandi velur eitt gildi af nokkrum möguleikum',
      en: 'User chooses a single value from several options',
    },
    isCommon: true,
  },
  {
    id: 'cd73ebb6-6573-490a-9bd1-1e693a9229eb',
    type: FieldTypesEnum.HOMESTAY_NUMBER,
    name: { is: 'Heimagistingarnúmer', en: 'Homestay number' },
    description: {
      is: 'Notandi slær inn heimagistingarnúmer sitt',
      en: 'User enters their homestay number',
    },
    isCommon: true,
  },
  {
    id: 'ac3fa8a0-9258-49d1-aff2-1dacf31538f0',
    type: FieldTypesEnum.HOMESTAY_OVERVIEW,
    name: { is: 'Heimagistingaryfirlit', en: 'Homestay overview' },
    description: {
      is: 'Notandi fyllir út nýtingaryfirlit fyrir almanaksár',
      en: 'Users fills out their homestay overview for the calendar year',
    },
    isCommon: true,
  },
  {
    id: '16603815-3db5-4aec-9bc7-56c1207bb79f',
    type: FieldTypesEnum.PROPERTY_NUMBER,
    name: { is: 'Fasteignanúmer', en: 'Property number' },
    description: {
      is: 'Notandi velur fasteign úr lista eða slær inn fasteignanúmer',
      en: 'User chooses property from a list or enters their property number',
    },
    isCommon: true,
  },
  {
    id: 'dc50f154-0dfa-4597-80b8-6f3d9ebc36b1',
    type: FieldTypesEnum.BANK_ACCOUNT,
    name: { is: 'Bankareikningsnúmer', en: 'Bank account' },
    description: {
      is: 'Notandi slær inn bankareikningsnúmer sitt',
      en: 'User enters their bank account',
    },
    isCommon: true,
  },
  {
    id: '6a616adc-80ab-47c1-8037-1d9a8dc68a5c',
    type: FieldTypesEnum.NATIONAL_ID,
    name: { is: 'Kennitala', en: 'National Id' },
    description: {
      is: 'Notandi slær inn kennitölu sína',
      en: 'User enters their national Id',
    },
    isCommon: true,
  },
  {
    id: '94819d53-69b6-464b-abda-3bb6299d2511',
    type: FieldTypesEnum.PAYER,
    name: { is: 'Greiðandi', en: 'Payer' },
    description: {
      is: 'Notandi slær inn kennitölu greiðanda',
      en: 'User enters the national Id of the payer',
    },
    isCommon: true,
  },
  {
    id: '6df647aa-27c8-48b1-8ac9-05e8b4251892',
    type: FieldTypesEnum.ISK_NUMBERBOX,
    name: { is: 'Krónutala', en: 'ISK number box' },
    description: {
      is: 'Notandi slær inn krónutölu',
      en: 'User enters ISK number',
    },
    isCommon: true,
  },
  {
    id: 'f1d14fe1-9e70-4ab2-8f95-8a06a9cf9f48',
    type: FieldTypesEnum.ISK_SUMBOX,
    name: { is: 'Krónutölusamtala', en: 'ISK sum box' },
    description: {
      is: 'Kerfið reiknar út samtölu krónutalna',
      en: 'The system calculates the sum of ISK number boxes',
    },
    isCommon: true,
  },
  {
    id: '0e104698-4e58-4874-97a2-a8fd8d3ab7c4',
    type: FieldTypesEnum.EMAIL,
    name: { is: 'Netfang', en: 'Email' },
    description: { is: 'Notandi slær inn netfang', en: 'User enters email' },
    isCommon: true,
  },
  {
    id: '1f56b93b-8290-4409-8fe0-1b297338e672',
    type: FieldTypesEnum.PHONE_NUMBER,
    name: { is: 'Símanúmer', en: 'Phone number' },
    description: {
      is: 'Notandi slær inn símanúmer',
      en: 'User enters phone number',
    },
    isCommon: true,
  },
  {
    id: '83f6f77d-1ca7-4f99-8806-05cec59a48e4',
    type: FieldTypesEnum.TIME_INPUT,
    name: { is: 'Tími', en: 'time' },
    description: {
      is: 'Notandi velur/slær inn tíma',
      en: 'User chooses/enters time',
    },
    isCommon: true,
  },
  {
    id: 'cdd63941-ff33-49d1-8b23-0293e413a281',
    type: FieldTypesEnum.CANDITATE,
    name: { is: 'Frambjóðandi', en: 'Candidate' },
    description: {
      is: 'Frambjóðandi í kosningum',
      en: 'Candidate in an election',
    },
    isCommon: false,
  },
  {
    id: 'd4143c45-6d45-4052-93c6-42d46572a874',
    type: FieldTypesEnum.DOCUMENT,
    name: { is: 'Skjal', en: 'Document' },
    description: {
      is: 'Notandi hleður upp skjali/skjölum',
      en: 'User uploads file/s',
    },
    isCommon: true,
  },
  {
    id: '0420775e-ab81-47fc-85af-6c40be3844ac',
    type: FieldTypesEnum.PAYMENT,
    name: { is: 'Greiðsla', en: 'Payment' },
    description: { is: 'Greiðsla', en: 'Payment' },
    isCommon: true,
  },
  {
    id: '15a57466-0be3-451d-988d-5b807fea3459',
    type: FieldTypesEnum.NATIONAL_ID_ESTATE,
    name: { is: 'Kennitala dánarbús', en: 'National Id estate' },
    description: {
      is: 'Notandi slær inn kennitölu sem við flettum upp í gagnagrunni látinna',
      en: 'User enters national Id that we look up in database of deceaced',
    },
    isCommon: false,
  },
  {
    id: '7cbbe78f-cd5f-4fb9-a77c-86af2bf986b1',
    type: FieldTypesEnum.NATIONAL_ID_ALL,
    name: { is: 'Kennitala allt', en: 'National Id all' },
    description: {
      is: 'Notandi slær inn kennitölu sem við flettum upp í öllum gagnagrunnum',
      en: 'User enters national Id that we look up in all databases',
    },
    isCommon: false,
  },
]
