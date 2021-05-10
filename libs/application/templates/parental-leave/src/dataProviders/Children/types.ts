export type ChildInformation =
  | {
      expectedDateOfBirth: string
      parentalRelation: 'secondary'
      primaryParentNationalRegistryId: string
    }
  | {
      expectedDateOfBirth: string
      parentalRelation: 'primary'
    }

export interface ExistingChildApplication {
  expectedDateOfBirth: string
  applicationId: string
}

export interface PregnancyStatus {
  hasActivePregnancy: boolean
  expectedDateOfBirth: string
}

export interface ChildrenAndExistingApplications {
  children: ChildInformation[]
  existingApplications: ExistingChildApplication[]
}
