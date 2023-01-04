import type { DistributiveOmit } from '@island.is/shared/types'

import { ParentalRelations } from '../../constants'

interface BaseChildInformation {
  expectedDateOfBirth: string
  hasRights: boolean
  remainingDays: number
  /**
   * Will be a negative number if other parent requested to use your days
   * Will be a positive number if other parent requested to transfer days to you
   * Will be undefined if transferal was not requested
   */
  transferredDays?: number
  multipleBirthsDays?: number
}

export type ChildInformation =
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.secondary
      primaryParentNationalRegistryId: string
    })
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.primary
    })

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
