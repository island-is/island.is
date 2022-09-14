import { Pass, PassTemplate } from '../../gen/schema'

export interface PkPassServiceErrorResponse {
  message?: string
  status?: number
  data?: unknown
}
export interface ListPassesResponse {
  data: {
    passes: {
      data: Array<Pass>
    }
  }
}

export interface VerifyPassResponse {
  data: {
    pass: Pass
  }
  errors: {
    message: string
    path: string
  }[]
}

export interface PassTemplatesDTO {
  passTemplates: Array<PassTemplate>
}

export interface ListPassesDTO {
  passes: Array<Pass>
}

export interface ListTemplatesResponse {
  data?: {
    passTemplates?: PassTemplate[]
  }
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
  data?: {
    upsertPass?: Pass
  }
  message?: string
  status?: number
}
