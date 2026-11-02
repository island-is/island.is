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
  firstPeriodStart?: string | null
  paid: boolean
  rightsCodePeriod?: string | null
  // No longer returned by VMST; only present on mocked/legacy external data.
  days?: string | null
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
   * Stable identity of the child within the children list; the value the
   * select-child screen stores in `selectedChild`. See `getChildKey`.
   */
  key?: string
  /**
   * The VMST application id of the applicant's leave for this child. Selecting
   * the child then starts a change application for that leave instead of a new
   * first-time application.
   */
  vmstApplicationId?: string
  /**
   * The applicant's unfinished island.is application for this child. The child
   * cannot be selected for another application until that one ends; the
   * select-child screen links to it instead.
   */
  inProgressApplicationId?: string
  // True when that unfinished application is itself a change.
  inProgressIsChange?: boolean
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

/**
 * Something the applicant already has for a child: a leave VMST holds (both
 * flags false, `applicationId` is the VMST application id) or an unfinished
 * island.is application (`applicationId` is that application's id).
 */
export interface ExistingChildApplication {
  expectedDateOfBirth: string
  applicationId: string
  adoptionDate?: string
  dateOfBirth?: string
  // True when the application is itself a change already in flight.
  isChangeInProgress: boolean
  // True when the application is an unfinished application that is not a change.
  isApplicationInProgress?: boolean
}

/**
 * Durable link between a child and the applicant's VMST parental-leave record,
 * keyed by `childKey = vmst:<vmstApplicationId>`. Links VMST momentarily omits
 * are kept, and a link's `childKey` never changes once assigned, so the child it
 * identifies survives due-date revisions and the birth.
 */
export interface ChildApplicationLink {
  childKey: string
  vmstApplicationId: string
  applicationFundId?: string
  expectedDateOfBirth?: string
  dateOfBirth?: string
  adoptionDate?: string
}

export interface PregnancyStatus {
  hasActivePregnancy: boolean
  expectedDateOfBirth: string
  // A made-up pregnancy in development. It is never an unborn child already
  // applied for under an earlier due date.
  isSimulated?: boolean
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
