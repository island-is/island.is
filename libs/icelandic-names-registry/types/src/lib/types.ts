export enum NameType {
  ST = 'ST',
  DR = 'DR',
  MI = 'MI',
  KH = 'KH',
  RST = 'RST',
  RDR = 'RDR',
  RKH = 'RKH',
}

export enum StatusType {
  ST = 'Haf',
  DR = 'Sam',
  OAF = 'Óaf',
}

export interface IcelandicNamesRegistryOptions {
  backendUrl: string
}

export const ICELANDIC_NAMES_REGISTRY_OPTIONS =
  'ICELANDIC_NAMES_REGISTRY_OPTIONS'

export type IcelandicName = {
  id: number
  icelandicName: string
  type: NameType | null
  status: StatusType | null
  visible: boolean | null
  description: string | null
  verdict: string | null
  url: string | null
  created: Date
  modified: Date
}
