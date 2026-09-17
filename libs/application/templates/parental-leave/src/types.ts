import type { DistributiveOmit } from '@island.is/shared/types'
import { MessageDescriptor } from 'react-intl'
import { ParentalRelations } from './constants'
import { YesOrNo } from '@island.is/application/core'

export interface MultipleBirths {
  hasMultipleBirths: YesOrNo
  multipleBirths?: number
}

export interface RequestRightsObj {
  isRequestingRights: YesOrNo
  requestDays: number
}

export interface GiveRightsObj {
  isGivingRights: YesOrNo
  requestDays: number
}

export interface PersonInformation {
  fullName: string
  genderCode: string
  children: {
    nationalId: string
    fullName: string
    otherParent: {
      nationalId: string
    }
  }[]
  spouse?: {
    nationalId?: string
    name?: string
  }
}

export interface Files {
  name: string
  key: string
}

export interface Attachments {
  attachments: Files[]
  label: MessageDescriptor
}

export interface FileUpload {
  selfEmployedFile?: Files[]
  studentFile?: Files[]
  benefitsFile?: Files[]
  singleParent?: Files[]
  parentWithoutBirthParent?: Files[]
  permanentFosterCare?: Files[]
  adoption?: Files[]
  employmentTerminationCertificateFile?: Files[]
  file?: Files[]
  changeEmployerFile?: Files[]
}

export interface VMSTPeriod {
  from: string
  to: string
  ratio: string
  firstPeriodStart: string
  paid: boolean
  rightsCodePeriod: string
  days: string
  approved: boolean
}

export interface VMSTOtherParent {
  otherParentId: string | null
  otherParentName: string | null
}

export interface Period {
  startDate: string
  endDate: string
  ratio: string
  firstPeriodStart?: string
  useLength?: YesOrNo
  daysToUse?: string
  rawIndex?: number
  rightCodePeriod?: string
  paid?: boolean
  approved?: boolean
  months?: number
  endDateAdjustLength?: string[]
}

export interface Payment {
  date: string
  taxAmount: number
  pensionAmount: number
  estimatedAmount: number
  privatePensionAmount: number
  unionAmount: number
  estimatePayment: number
  period: {
    from: string
    to: string
    ratio: number
    approved: boolean
    paid: boolean
  }
}

export interface Payments {
  bank: string
  pensionFund: string
  privatePensionFund: string
  privatePensionFundPercentage: string
  union: string
}

export interface OtherParentObj {
  chooseOtherParent: string
  otherParentName?: string
  otherParentId: string
}

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
  adoptionDate?: string
  dateOfBirth?: string
  /**
   * Set when the applicant already has an application for this child. Selecting
   * the child then starts a change application seeded from that one instead of a
   * new first-time application.
   */
  existingApplicationId?: string
  // False when that existing application has not been forwarded to VMST yet; a
  // change flow would fail, so the select-child screen opens it in place.
  existingApplicationHasFundId?: boolean
  // True when the existing application is itself a change already in flight;
  // the select-child screen opens it in place instead of spawning another change.
  existingApplicationIsChangeInProgress?: boolean
}

export type ChildInformation =
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.secondary
      primaryParentNationalRegistryId: string
      primaryParentGenderCode?: string
      primaryParentTypeOfApplication?: string
    })
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.primary
    })

export interface ExistingChildApplication {
  expectedDateOfBirth: string
  applicationId: string
  adoptionDate?: string
  // False when the application has not been forwarded to VMST yet; a change
  // flow would fail on submit, so the select-child screen opens it in place.
  hasApplicationFundId: boolean
  // True when the application is itself a change already in flight.
  isChangeInProgress: boolean
}

/**
 * Durable link between an island.is child selection and a VMST parental-leave
 * record. Keyed by `childKey`, which is anchored to a stable identifier that
 * survives DOB revisions and post-birth transitions:
 *   - `vmst:<vmstApplicationId>` once VMST has acknowledged the record
 *   - `dob:<yyyy-mm-dd>` or `adoption:<yyyy-mm-dd>` as a bootstrap key
 * Once a link has a `vmstApplicationId`, its `childKey` never changes.
 */
export interface ChildApplicationLink {
  childKey: string
  vmstApplicationId: string
  applicationFundId?: string
  expectedDateOfBirth?: string
  dateOfBirth?: string
  adoptionDate?: string
}

/**
 * The application a `change` / `residenceGrant` application descends from, as
 * returned by the `getPreviousApplication` template api. `answers` holds only the
 * carried-over answer groups and doubles as the baseline the change form diffs
 * against.
 */
export interface PreviousApplication {
  applicationId: string
  vmstApplicationId: string
  applicationFundId: string
  /**
   * The child the predecessor was for. Identified by date rather than by the
   * `selectedChild` index, because the new application builds its own children
   * list and the same index can point at a different child.
   */
  selectedChild: {
    expectedDateOfBirth: string
    adoptionDate?: string
  } | null
  answers: Record<string, unknown>
}

export interface PregnancyStatus {
  hasActivePregnancy: boolean
  expectedDateOfBirth: string
}

// Has rights and remaining rights is calculated at the end
// of the data provider. This is to be able to use
// the same type until the end when we calculate the missing fields

export type ChildInformationWithoutRights = DistributiveOmit<
  ChildInformation,
  'hasRights' | 'remainingDays'
>

export interface PregnancyStatusAndRightsResults {
  children: ChildInformation
  remainingDays: number
  hasRights: boolean
  hasActivePregnancy: boolean
}

export interface EmployerRow {
  email: string
  phoneNumber?: string
  ratio: string
  isApproved?: boolean
  reviewerNationalRegistryId?: string
  companyNationalRegistryId?: string
  stillEmployed?: YesOrNo
}

export type SelectOption = {
  label: string
  value: string
}

export interface FormattedPeriod {
  actualDob?: boolean
  startDate: string
  endDate: string
  ratio: string
  duration: string
  title: string
  color?: string
  canDelete?: boolean
  rawIndex: number
  paid?: boolean
}
