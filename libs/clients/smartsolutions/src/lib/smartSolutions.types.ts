import { Pass, PassTemplate } from '../../gen/schema'

/** SERVICE RESPONSES */
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
    passes?: {
      data: Array<Pass>
    }
  }
  errors?: {
    message: string
    path: string
  }[]
}
export interface UpsertPassResponse {
  data: {
    upsertPass?: Pass
  }
  errors?: {
    message: string
    path: string
  }[]
}

export interface PassTemplatesResponse {
  data: {
    passTemplates?: {
      data: Array<PassTemplate>
    }
  }
  errors?: {
    message: string
    path: string
  }[]
}

/** RESULTS */

export type GeneratePassResult = ListPassResult | UpsertPassResult
export interface VerifyPassResult {
  type: 'verify'
  valid: boolean
  error?: ServiceError
}

export interface ListPassResult {
  type: 'list-passes'
  data?: Array<Pass> | 'No passes found'
  error?: ServiceError
}

export interface UpsertPassResult {
  type: 'upsert'
  data?: Pass
  error?: ServiceError
}

export interface ListTemplatesResult {
  type: 'list-templates'
  data?: Array<PassTemplate> | 'No templates found'
}

/** SERVICE ERRORS */

export interface ServiceErrorResponse {
  message?: string
  status?: VerifyPassServiceStatusCode
  data?: unknown
}

export interface ServiceError {
  /**
   * HTTP status code from the service.
   * Needed while `status` was always the same, use `serviceError.status` for
   * error reported by API.
   */
  statusCode: number
  serviceError?: ServiceErrorResponse
}

export type VerifyPassServiceStatusCode =
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
