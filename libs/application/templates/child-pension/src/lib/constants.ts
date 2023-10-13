import { DefaultEvents } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { childPensionFormMessage } from './messages'

export const YES = 'yes'
export const NO = 'no'
export const IS = 'IS'
export const MAX_MONTHS_RESIDENCE_HISTORY = -36
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

export enum CPEvents {
  ADDITIONALDOCUMENTSREQUIRED = 'ADDITIONALDOCUMENTSREQUIRED',
  INREVIEW = 'INREVIEW',
  PENDING = 'PENDING',
  DISMISSED = 'DISMISSED',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  // | { type: 'ADDITIONALDOCUMENTSREQUIRED' } // Ex: TR ask for more documents
  | { type: CPEvents.ADDITIONALDOCUMENTSREQUIRED } // Ex: TR ask for more documents
  | { type: CPEvents.INREVIEW } // Ex: TR's employee start review application
  | { type: CPEvents.PENDING }
  | { type: CPEvents.DISMISSED }

export enum Roles {
  APPLICANT = 'applicant',
  ORGINISATION_REVIEWER = 'tryggingastofnun',
}

export enum States {
  PREREQUESITES = 'prerequesites',
  DRAFT = 'draft',
  DONE = 'done',

  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted', // NYSKRAD = 91
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview', // I_VINNSLU = 562

  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired', // I_BID_GOGN_VANTAR = 1617

  PENDING = 'pending', // I_BID = 561
  DISMISSED = 'dismissed', // VISAD_FRA = 1637

  REJECTED = 'rejected', // SYNJAD = 1281
  APPROVED = 'approved', // AFGREIDD = 563
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
  VALIDATE_SELECTED_CHILDREN = 'period',
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
