import { Pass, PassTemplate } from '../../gen/schema'

export interface VerifyPassResult {
  valid: boolean
  data?: string
  name?: string
  nationalId?: string
  photo?: string
  error?: PkPassVerifyError
}

export interface VerifyPassResponse {
  valid: boolean
  data?: {
    updateStatusOnPassWithDynamicBarcode: Pass
  }
  errors?: {
    message: string
    path: string
  }[]
}

export interface ListPassesResponse {
  data?: {
    passes?: ListPassesDTO
  }
}

export interface PassTemplatesDTO {
  data: Array<PassTemplate>
}

export interface ListPassesDTO {
  data: Array<Pass>
}

export interface ListTemplatesResponse {
  data?: PassTemplate[]
  message?: string
  status?: number
}
export interface PassTemplateDTO {
  passTemplate: {
    id: string
    name: string
  }
}

export interface UpsertPkPassResponse {
  data: {
    upsertPass: Pass
  }
  message?: string
  status?: number
}
export interface PkPassVerifyError {
  /**
   * HTTP status code from the service.
   * Needed while `status` was always the same, use `serviceError.status` for
   * error reported by API.
   */
  statusCode: number
  serviceError?: PkPassServiceErrorResponse
}

export interface PkPassServiceErrorResponse {
  message?: string
  status?: PkPassServiceVerifyPassStatusCode
  data?: unknown
}

export type PkPassServiceVerifyPassStatusCode =
  /** License OK */
  | 1
  /** License expired */
  | 2
  /** No license info found */
  | 3
  /** Request contains some field errors */
  | 4
  /** Unknown error */
  | 99
