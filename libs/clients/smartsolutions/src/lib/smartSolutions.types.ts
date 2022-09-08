import { Pass, PassTemplate } from '../../gen/schema'

export interface CreatePkPassDataInput {
  passTemplateId?: string
  inputFieldValues?: {
    identifier?: string
    value?: string
  }[]
  thumbnail?: {
    imageBase64String?: string
  }
}

export enum PkPassIssuer {
  VINNUEFTIRLITID = 'vinnueftirlitid',
  RIKISLOGREGLUSTJORI = 'rikislogreglustjori',
}

export interface CreatePkPassDTO {
  distributionUrl?: string
  deliveryPageUrl?: string
  destributionQRCode?: string
}

export interface PkPassServiceErrorResponse {
  message?: string
  status?: number
  data?: unknown
}
export interface PassTemplateDTO {
  id?: string
  name?: string
}

export interface ListPassesResponse {
  data: {
    passes: {
      data: Array<Pass>
    }
  }
}

export interface PassTemplatesDTO {
  passTemplates: Array<PassTemplate>
}

export interface ListPassesDTO {
  passes: Array<Pass>
}

export interface PassTemplatesResponse {
  data?: {
    passTemplates?: {
      data?: PassTemplate[]
    }
  }
}

export interface UpsertPkPassResponse {
  data?: {
    upsertPass?: Pass
  }
  message?: string
  status?: number
}
