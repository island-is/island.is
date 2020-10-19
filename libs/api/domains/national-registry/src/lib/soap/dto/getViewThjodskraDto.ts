export interface GetViewThjodskraDto {
  message: string;
  table: Table;
  success: boolean;
}

export interface Table {
  schema: Schema;
  diffgram: Diffgram;
}

export interface Diffgram {
  DocumentElement: DocumentElement;
}

export interface DocumentElement {
  Thjodskra: Thjodskra;
}

export interface Thjodskra {
  attributes: ThjodskraAttributes;
  Kennitala: string;
  Fjolsknr: string;
  Nafn: string;
  Kyn: string;
  Hju: string;
  Tru: string;
  Sambud: null;
  Rikisfang: string;
  Faedsvfnr: string;
  FaedD: string;
  LoghHusk: string;
  MakiKt: string;
}

export interface ThjodskraAttributes {
  "diffgr:id": string;
  "msdata:rowOrder": string;
  "diffgr:hasChanges": string;
}

export interface Schema {
  attributes: SchemaAttributes;
  element: SchemaElement;
}

export interface SchemaAttributes {
  id: string;
}

export interface SchemaElement {
  attributes: PurpleAttributes;
  complexType: PurpleComplexType;
}

export interface PurpleAttributes {
  name: string;
  "msdata:IsDataSet": string;
  "msdata:MainDataTable": string;
  "msdata:UseCurrentLocale": string;
}

export interface PurpleComplexType {
  choice: Choice;
}

export interface Choice {
  attributes: ChoiceAttributes;
  element: ChoiceElement;
}

export interface ChoiceAttributes {
  minOccurs: string;
  maxOccurs: string;
}

export interface ChoiceElement {
  attributes: FluffyAttributes;
  complexType: FluffyComplexType;
}

export interface FluffyAttributes {
  name: string;
}

export interface FluffyComplexType {
  sequence: Sequence;
}

export interface Sequence {
  element: ElementElement[];
}

export interface ElementElement {
  attributes: TentacledAttributes;
}

export interface TentacledAttributes {
  name: string;
  "msprop:ColumnId": string;
  type: Type;
  minOccurs: string;
}

export enum Type {
  XsString = "xs:string",
}
