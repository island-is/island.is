export interface GetViewISLBorninMinDto {
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
  ISLBorninMin: ISLBorninMin[]
}

export interface ISLBorninMin {
  attributes: ISLBorninMinAttributes
  Barn: string
  FulltNafn: string
  BirtNafn?: string
  Millinafn?: string
  Kenninafn?: string
  Kyn?: string
  Kynheiti?: string
  Faedingardagur?: string
  Foreldri1?: string
  NafnForeldri1?: string
  Foreldri2?: string
  NafnForeldri2?: string
  Forsja1?: string
  NafnForsja1?: string
  Forsjatxt1?: string
  Forsja2?: string
  NafnForsja2?: string
  Forsjatxt2?: string
  Faedingarstadur?: string
  Trufelag?: string
  Rikisfang?: string
  Logheimili?: string
  Sveitarfelag?: string
  Postaritun?: string
  Eiginnafn?: string
}

interface ISLBorninMinAttributes {
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
