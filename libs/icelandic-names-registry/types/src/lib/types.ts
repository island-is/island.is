export type IcelandicName = {
  id: number
  icelandicName: string
  type: string | null
  status: string | null
  visible: boolean | null
  description: string | null
  url: string | null
  created: Date | null
  modified: Date | null
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

export interface IcelandicNamesRegistryOptions {
  backendUrl: string
}

export const ICELANDIC_NAMES_REGISTRY_OPTIONS =
  'ICELANDIC_NAMES_REGISTRY_OPTIONS'
