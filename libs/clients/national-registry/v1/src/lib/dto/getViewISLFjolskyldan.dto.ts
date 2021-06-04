export interface GetViewISLFjolskyldanDto {
  message: string
  table: Table
  success: boolean
}

interface Table {
  schema: Schema
  diffgram: Diffgram
}

interface Diffgram {
  DocumentElement: DocumentElement
}

interface DocumentElement {
  ISLFjolskyldan: ISLFjolskyldan[]
}

export interface ISLFjolskyldan {
  attributes: ISLFjolskyldanAttributes
  Kennitala: string
  Nafn: string
  Fjolsknr: string
  Kyn: string
  Kynheiti: string
  Faedingardagur: string
  MakiBarn: string
}

interface ISLFjolskyldanAttributes {
  'diffgr:id': string
  'msdata:rowOrder': string
  'diffgr:hasChanges': string
}

interface Schema {
  attributes: SchemaAttributes
  element: SchemaElement
}

interface SchemaAttributes {
  id: string
}

interface SchemaElement {
  attributes: PurpleAttributes
  complexType: PurpleComplexType
}

interface PurpleAttributes {
  name: string
  'msdata:IsDataSet': string
  'msdata:MainDataTable': string
  'msdata:UseCurrentLocale': string
}

interface PurpleComplexType {
  choice: Choice
}

interface Choice {
  attributes: ChoiceAttributes
  element: ChoiceElement
}

interface ChoiceAttributes {
  minOccurs: string
  maxOccurs: string
}

interface ChoiceElement {
  attributes: FluffyAttributes
  complexType: FluffyComplexType
}

interface FluffyAttributes {
  name: string
}

interface FluffyComplexType {
  sequence: Sequence
}

interface Sequence {
  element: ElementElement[]
}

interface ElementElement {
  attributes: TentacledAttributes
}

interface TentacledAttributes {
  name: string
  'msprop:ColumnId': string
  type: Type
  minOccurs: string
}

enum Type {
  XsString = 'xs:string',
}
