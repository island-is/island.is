import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FieldTypesEnum } from '@island.is/form-system/shared'
import { FieldSettings } from '../fieldSettings/fieldSettings.model'
import { LanguageType } from '../languageType.model'
import { ValueDto } from '../../modules/applications/models/dto/value.dto'

export class FieldType {
  @ApiProperty()
  id!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @ApiProperty()
  isCommon!: boolean

  @ApiPropertyOptional({ type: FieldSettings })
  fieldSettings?: FieldSettings

  @ApiPropertyOptional({ type: [ValueDto] })
  values?: ValueDto[]
}

export const FieldTypes: FieldType[] = [
  {
    id: FieldTypesEnum.TEXTBOX,
    name: { is: 'Textainnsláttur', en: 'Textbox' },
    description: { is: 'Notandi slær inn texta', en: 'User enters text' },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.NUMBERBOX,
    name: { is: 'Tölustafir', en: 'Numbers' },
    description: {
      is: 'Notandi slær inn tölustafi',
      en: 'User enters numbers',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.MESSAGE,
    name: { is: 'Skilaboð', en: 'Message' },
    description: {
      is: 'Skilaboð sem birtast í texta',
      en: 'Message that appears as text',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.CHECKBOX,
    name: { is: 'Hakbox', en: 'Checkbox' },
    description: { is: 'Já/nei val', en: 'Yes/no options' },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.DATE_PICKER,
    name: { is: 'Dagsetning', en: 'Date picker' },
    description: {
      is: 'Notandi velur dagsetningu úr dagatali',
      en: 'User chooses date from calendar',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.DROPDOWN_LIST,
    name: { is: 'Fellilisti', en: 'Dropdown list' },
    description: {
      is: 'Notandi velur eitt gildi af nokkrum möguleikum úr lista',
      en: 'User chooses a single value from a dropdown list of options',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.RADIO_BUTTONS,
    name: { is: 'Valhnappar', en: 'Radio buttons' },
    description: {
      is: 'Notandi velur eitt gildi af nokkrum möguleikum',
      en: 'User chooses a single value from several options',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.HOMESTAY_NUMBER,
    name: { is: 'Heimagistingarnúmer', en: 'Homestay number' },
    description: {
      is: 'Notandi slær inn heimagistingarnúmer sitt',
      en: 'User enters their homestay number',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.HOMESTAY_OVERVIEW,
    name: { is: 'Heimagistingaryfirlit', en: 'Homestay overview' },
    description: {
      is: 'Notandi fyllir út nýtingaryfirlit fyrir almanaksár',
      en: 'Users fills out their homestay overview for the calendar year',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.PROPERTY_NUMBER,
    name: { is: 'Fasteignanúmer', en: 'Property number' },
    description: {
      is: 'Notandi velur fasteign úr lista eða slær inn fasteignanúmer',
      en: 'User chooses property from a list or enters their property number',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.BANK_ACCOUNT,
    name: { is: 'Bankareikningsnúmer', en: 'Bank account' },
    description: {
      is: 'Notandi slær inn bankareikningsnúmer sitt',
      en: 'User enters their bank account',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.NATIONAL_ID,
    name: { is: 'Kennitala', en: 'National Id' },
    description: {
      is: 'Notandi slær inn kennitölu sína',
      en: 'User enters their national Id',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.PAYER,
    name: { is: 'Greiðandi', en: 'Payer' },
    description: {
      is: 'Notandi slær inn kennitölu greiðanda',
      en: 'User enters the national Id of the payer',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.ISK_NUMBERBOX,
    name: { is: 'Krónutala', en: 'ISK number box' },
    description: {
      is: 'Notandi slær inn krónutölu',
      en: 'User enters ISK number',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.ISK_SUMBOX,
    name: { is: 'Krónutölusamtala', en: 'ISK sum box' },
    description: {
      is: 'Kerfið reiknar út samtölu krónutalna',
      en: 'The system calculates the sum of ISK number boxes',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.EMAIL,
    name: { is: 'Netfang', en: 'Email' },
    description: { is: 'Notandi slær inn netfang', en: 'User enters email' },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.PHONE_NUMBER,
    name: { is: 'Símanúmer', en: 'Phone number' },
    description: {
      is: 'Notandi slær inn símanúmer',
      en: 'User enters phone number',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.TIME_INPUT,
    name: { is: 'Tími', en: 'time' },
    description: {
      is: 'Notandi velur/slær inn tíma',
      en: 'User chooses/enters time',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.CANDIDATE,
    name: { is: 'Frambjóðandi', en: 'Candidate' },
    description: {
      is: 'Frambjóðandi í kosningum',
      en: 'Candidate in an election',
    },
    isCommon: false,
  },
  {
    id: FieldTypesEnum.FILE,
    name: { is: 'Skjal', en: 'Document' },
    description: {
      is: 'Notandi hleður upp skjali/skjölum',
      en: 'User uploads file/s',
    },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.PAYMENT,
    name: { is: 'Greiðsla', en: 'Payment' },
    description: { is: 'Greiðsla', en: 'Payment' },
    isCommon: true,
  },
  {
    id: FieldTypesEnum.NATIONAL_ID_ESTATE,
    name: { is: 'Kennitala dánarbús', en: 'National Id estate' },
    description: {
      is: 'Notandi slær inn kennitölu sem við flettum upp í gagnagrunni látinna',
      en: 'User enters national Id that we look up in database of deceaced',
    },
    isCommon: false,
  },
  {
    id: FieldTypesEnum.NATIONAL_ID_ALL,
    name: { is: 'Kennitala allt', en: 'National Id all' },
    description: {
      is: 'Notandi slær inn kennitölu sem við flettum upp í öllum gagnagrunnum',
      en: 'User enters national Id that we look up in all databases',
    },
    isCommon: false,
  },
]
