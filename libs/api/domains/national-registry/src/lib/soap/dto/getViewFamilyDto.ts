export interface GetViewFamilyDto {
  message: string
  table: Table
  success: boolean
}

export interface Table {
  schema: Schema
  diffgram: Diffgram
}

export interface Diffgram {
  DocumentElement: DocumentElement
}

export interface DocumentElement {
  Fjolskyldan: Fjolskyldan[]
}

export interface Fjolskyldan {
  attributes: FjolskyldanAttributes
  Nafn: string
  Kennitala: string
  KynKodi: string
  Kyn: string
  FjolskNr: string
  Hjusk: string
  Hjuskapur: string
  LoghHusk: string
  Husheiti: string
  Husnumer: string
  Pnr: string
  Svfnr: string
  Sveitarfelag: string
  AdsHusk: null
  Adsetur: null
  AdseturPnr: null
  AdseturSvfnr: null
  AdseturSveitarfelag: null
}

export interface FjolskyldanAttributes {
  'diffgr:id': string
  'msdata:rowOrder': string
  'diffgr:hasChanges': string
}

export interface Schema {
  attributes: SchemaAttributes
  element: SchemaElement
}

export interface SchemaAttributes {
  id: string
}

export interface SchemaElement {
  attributes: PurpleAttributes
  complexType: PurpleComplexType
}

export interface PurpleAttributes {
  name: string
  'msdata:IsDataSet': string
  'msdata:MainDataTable': string
  'msdata:UseCurrentLocale': string
}

export interface PurpleComplexType {
  choice: Choice
}

export interface Choice {
  attributes: ChoiceAttributes
  element: ChoiceElement
}

export interface ChoiceAttributes {
  minOccurs: string
  maxOccurs: string
}

export interface ChoiceElement {
  attributes: FluffyAttributes
  complexType: FluffyComplexType
}

export interface FluffyAttributes {
  name: string
}

export interface FluffyComplexType {
  sequence: Sequence
}

export interface Sequence {
  element: ElementElement[]
}

export interface ElementElement {
  attributes: TentacledAttributes
}

export interface TentacledAttributes {
  name: string
  'msprop:ColumnId': string
  type: Type
  minOccurs: string
}

export enum Type {
  XsString = 'xs:string',
}
