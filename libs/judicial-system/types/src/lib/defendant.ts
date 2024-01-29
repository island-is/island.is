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
  noNationalId?: boolean
  nationalId?: string
  name?: string
  gender?: Gender
  address?: string
  citizenship?: string
  defenderName?: string
  defenderNationalId?: string
  defenderEmail?: string
  defenderPhoneNumber?: string
  defendantWaivesRightToCounsel: boolean
}

export interface DeleteDefendantResponse {
  deleted: boolean
}
