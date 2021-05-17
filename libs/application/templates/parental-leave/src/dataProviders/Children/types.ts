import { DistributiveOmit } from '@island.is/shared/types'

export type ChildInformation =
  | {
      expectedDateOfBirth: string
      parentalRelation: 'secondary'
      primaryParentNationalRegistryId: string
      hasRights: boolean
      remainingDays: number
    }
  | {
      expectedDateOfBirth: string
      parentalRelation: 'primary'
      hasRights: boolean
      remainingDays: number
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

// Has rights and remaining rights is calculated at the end
// of the data provider. This is to be able to use
// the same type until the end when we calculate the missing fields

export type ChildInformationWithoutRights = DistributiveOmit<
  ChildInformation,
  'hasRights' | 'remainingDays'
>

export type ChildrenWithoutRightsAndExistingApplications = Pick<
  ChildrenAndExistingApplications,
  'existingApplications'
> & {
  children: ChildInformationWithoutRights[]
}
