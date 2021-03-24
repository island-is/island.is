export interface GetViewISLEinstaklingurDto {
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
  ISLEinstaklingur: ISLEinstaklingur
}

export interface ISLEinstaklingur {
  attributes: ISLEinstaklingurAttributes
  Kennitala: string
  Birtnafn: string
  Eiginnafn: string
  Millinafn: string
  Kenninafn: string
  Fulltnafn: string
  hju: string
  hjuskapur: string
  hjuundir: string
  HjuBreytt: string
  Samb: string
  Sambud: string
  Sambudbreytt: string
  HjuSamdags: string
  HjuSamBreytt: string
  MakiKt: string
  nafnmaka: string
  Sambudarmaki: string
  Sambudmaki: string
  Tru: string
  Trufelag: string
  TruBreytt: string
  Kyn: string
  Kynheiti: string
  KarlKona: string
  FaedSveit: string
  Faedingarstadur: string
  Faedingardagur: string
  Rikisfang: string
  RikisfangLand: string
  LoghHusk: string
  LoghHuskBreytt: string
  Logheimili: string
  LogheimiliSveitarfelag: string
  Postnr: string
  LogheimiliPostaritun: string
  Bannmerking: string
  BannmerkingBreytt: string
  AdsHusk: string
  AdsHuskBreytt: string
  Adsetur: string
  AdseturSveitarfelag: string
  AdseturPostaritun: string
  FjFjolsk: string
  Fjolsknr: string
  FjolsknrBreytt: string
  Foreldri1: string
  nafn1: string
  Afdrif1: string
  Foreldri2: string
  Nafn2: string
  Afdrif2: string
}

interface ISLEinstaklingurAttributes {
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
