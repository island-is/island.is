import { Signature } from './signature.dto'

export interface NationalIds {
  nationalId: string
  reason?: string
}

export interface BulkUpload {
  success: NationalIds[]
  failed: NationalIds[]
}
