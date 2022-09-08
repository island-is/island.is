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
export interface ListPassesResponse {
  data: {
    passes: {
      data: Array<PassDTO>
    }
  }
}

export interface PassTemplatesDTO {
  passTemplates: Array<PassTemplateDTO>
}

export interface PassDTO {
  distributionUrl: string
  deliveryPageUrl: string
  distributionQRCode: string
  whenCreated: string
  whenModified: string
  passTemplate: PassTemplateDTO
  id: string
  status: string
  inputFieldValues: {
    passInputField: {
      identifier: string
    }
    value: string
  }
}

export interface ListPassesDTO {
  passes: Array<PassDTO>
}

export interface PassTemplatesResponse {
  data?: {
    passTemplates?: {
      data?: PassTemplateDTO[]
    }
  }
}

export interface PassTemplateDTO {
  passTemplate: {
    id: string
    name: string
  }
}

export interface UpsertPkPassResponse {
  data?: {
    upsertPass?: PassDTO
  }
  message?: string
  status?: number
}
