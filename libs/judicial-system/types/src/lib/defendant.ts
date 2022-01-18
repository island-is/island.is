export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Defendant {
  id: string
  created: string
  modified: string
  caseId: string
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
}

export interface CreateDefendant {
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
}

export interface UpdateDefendant {
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
}

export interface DeleteDefendantResponse {
  deleted: boolean
}
