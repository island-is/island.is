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

export interface PassTemplatesResponse {
  data?: {
    passTemplates?: {
      data?: PassTemplateDTO[]
    }
  }
}

export interface UpsertPkPassResponse {
  data?: {
    upsertPass?: {
      distributionUrl?: string
      deliveryPageUrl?: string
      distributionQRCode?: string
    }
  }
}

export interface VerifyPkPassErrorResponse {
  message: string
  path: string[]
}

export interface PkPassVerifyError {
  /**
   * HTTP status code from the service.
   * Needed while `status` was always the same, use `serviceError.status` for
   * error reported by API.
   */
  statusCode: number
  serviceError?: VerifyPkPassErrorResponse
}

export interface VerifyPkPassResponse {
  valid: boolean
  error?: VerifyPkPassErrorResponse
  nationalId?: string
}

export interface PassFieldDTO {
  id?: string
  label?: string
  orderIndex?: number
  passInputField?: PassInputFieldDTO
  type?: 'HEADER' | 'PRIMARY' | 'SECONDARY' | 'AUXILIARY' | 'BACK'
  value?: string
  textAlignment?: 'LEFT' | 'CENTER' | 'RIGHT'
}

export interface PassInputFieldDTO {
  description?: string
  identifier?: string
}

export interface VerifyPassDataDTO {
  id?: string
  validFrom?: string
  expirationDate?: string
  expirationTime?: string
  status?: string
  whenCreated?: string
  whenModified?: string
  alreadyPaid?: string
}

export interface VerifyPassDataInputDTO {
  code?: string
  date?: string
}
