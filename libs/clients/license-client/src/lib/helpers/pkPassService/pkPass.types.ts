import { ClientConfigType } from '../../factories/config.types'
import { PassData } from '../../licenseClient.type'

export interface PkPassModuleOptions {
  config: ClientConfigType
}

export interface VerifyPkPassDataInput {
  code: string
  date: string
}

export interface VerifyPassData {
  valid: boolean
  pass?: PassData
}
