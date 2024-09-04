import { Pass, PassTemplate } from '../..'

export type PkPass = Partial<Pass>

export interface VerifyPassData {
  valid: boolean
  pass?: PkPass
}

export interface RevokePassData {
  success: boolean
}

export interface GetPassResponseData {
  pass: PkPass
}

export interface VerifyPassResponseData {
  updateStatusOnPassWithDynamicBarcode?: PkPass
}

export interface UpsertPassResponseData {
  upsertPass: PkPass
}

export interface UpdatePassResponseData {
  updatePass: PkPass
}

export interface ListTemplatesResponseData {
  passes?: {
    data: Array<PassTemplate>
  }
}

export interface VoidPassResponseData {
  voidUniquePass: boolean
}
export interface UnvoidPassResponseData {
  unvoidPass: boolean
}

export interface DeletePassResponseData {
  deleteUniquePass: boolean
}

export interface ListPassesResponseData {
  passes?: {
    data: Array<PkPass>
  }
}
