import { Signature } from './signature.dto'

export interface FailedNationalIds {
  nationalId: string
  reason?: string
}

export interface BulkUpload {
  success: Signature[]
  failed: FailedNationalIds[]
}
