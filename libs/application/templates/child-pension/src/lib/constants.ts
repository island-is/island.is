import { DefaultEvents } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { childPensionFormMessage } from './messages'

export const YES = 'yes'
export const NO = 'no'

export const MAX_MONTHS_BACKWARD = -24
export const MAX_MONTHS_FORWARD = 6

export const MONTHS = [
  { value: 'January', label: childPensionFormMessage.period.january },
  { value: 'February', label: childPensionFormMessage.period.february },
  { value: 'March', label: childPensionFormMessage.period.march },
  { value: 'April', label: childPensionFormMessage.period.april },
  { value: 'May', label: childPensionFormMessage.period.may },
  { value: 'June', label: childPensionFormMessage.period.june },
  { value: 'July', label: childPensionFormMessage.period.july },
  { value: 'August', label: childPensionFormMessage.period.august },
  {
    value: 'September',
    label: childPensionFormMessage.period.september,
  },
  { value: 'October', label: childPensionFormMessage.period.october },
  { value: 'November', label: childPensionFormMessage.period.november },
  { value: 'December', label: childPensionFormMessage.period.desember },
]

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUESITES = 'prerequesites',
  DRAFT = 'draft',
  DONE = 'done',
  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted',
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview',
  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

// TODO: Skoða enska þýðingu betur
export enum ChildPensionReason {
  PARENT_HAS_PENSION_OR_DISABILITY_ALLOWANCE = 'parentHasPensionOrDisabilityAllowance', // Innskráð foreldri er lífeyrisþegi eða með örorkustyrk
  PARENT_IS_DEAD = 'parentIsDead', // Foreldri er látið
  CHILD_IS_FATHERLESS = 'childIsFatherless', // Barn er ófeðrað
  PARENTS_PENITENTIARY = 'parentsPenitentiary', // Refsivist foreldris
}

export enum AnswerValidationConstants {
  VALIDATE_LATEST_CHILD = 'registerChildRepeater',
  VALIDATE_SELECTED_CHILDREN_IN_CUSTODY_REASON = 'chooseChildren.selectedChildrenInCustody',
  FILEUPLOAD = 'fileUpload',
}

export const FILE_SIZE_LIMIT = 5000000 // 5MB

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  maintenance: childPensionFormMessage.fileUpload.maintenanceTitle,
  notLivesWithApplicant:
    childPensionFormMessage.fileUpload.notLivesWithApplicantTitle,
  additionalDocuments: childPensionFormMessage.fileUpload.additionalFileTitle,
}
