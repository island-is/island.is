export interface GetViewSveitarfelagDto {
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
  Sveitarfelag: Sveitarfelag
}

export interface Sveitarfelag {
  attributes: SveitarfelagAttributes
  _x0031_: string
  SvfNr: null
  PostNr: null
  _x0032_: string
  Sokn: string
  _x0033_: string
  Nafn: string
  _x0034_: string
  _x0035_: string
  NafnThgf: null
}

export interface SveitarfelagAttributes {
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
