import { Pass, PassTemplate } from '../../gen/schema'

export interface PkPassServiceErrorResponse {
  message?: string
  status?: number
  data?: unknown
}

export interface VerifyPassResponse {
  valid: boolean
  data?: {
    updateStatusOnPassWithDynamicBarcode: Pass
  }
  error?: {
    message?: string
    data?: string
  }
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
  data: Pass
  message?: string
  status?: number
}
