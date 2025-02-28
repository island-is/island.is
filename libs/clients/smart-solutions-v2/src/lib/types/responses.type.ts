import { Pass, PassTemplate } from '../..'

export interface VerifyPassData {
  valid: boolean
  pass?: Pass
}

export interface RevokePassData {
  success: boolean
}

export interface GetPassResponseData {
  pass: Pass
}

export interface VerifyPassResponseData {
  updateStatusOnPassWithDynamicBarcode?: Pass
}

export interface UpsertPassResponseData {
  upsertPass: Pass
}

export interface UpdatePassResponseData {
  updatePass: Pass
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
    data: Array<Pass>
  }
}
