export type IcelandicName = {
  id: number
  icelandic_name: string
  type: string
  status: string
  visible: boolean
  description: string
  url: string
  created: Date
  modified: Date
}

export enum EnumNameType {
  ST = 'ST',
  DR = 'DR',
  MI = 'MI',
  RST = 'RST',
  RDR = 'RDR',
}

export enum EnumStatusType {
  ST = 'Haf',
  DR = 'Sam',
  OAF = 'Óaf',
}

export type NameType = 'ST' | 'DR' | 'MI' | 'RST' | 'RDR'
export type StatusType = 'Haf' | 'Sam' | 'Óaf'
