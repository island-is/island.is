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

export interface VerifyPassResponse {
  data: {
    pass: PassDTO
  }
  errors: {
    message: string
    path: string
  }[]
}

export interface DynamicBarcodeDataInput {
  dynamicBarcodeData: {
    code: string
    //iso8601
    date: string
  }
}

export enum PkPassStatus {
  Expired = 'EXPIRED',
  Unclaimed = 'UNCLAIMED',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Voided = 'VOIDED',
  DeleteInProcess = 'DELETE_IN_PROCESS',
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
  expirationDate: string
  expirationTime: string
  alreadyPaid: boolean
  passTemplate: PassTemplateDTO
  id: string
  status: PkPassStatus
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
