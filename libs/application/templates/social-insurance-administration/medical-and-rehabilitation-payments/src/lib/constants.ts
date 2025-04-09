import { MessageDescriptor } from 'react-intl'
import { medicalAndRehabilitationPaymentsFormMessage } from './messages'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  studyConfirmation:
    medicalAndRehabilitationPaymentsFormMessage.overview.studyConfirmation,
  unionSickPay:
    medicalAndRehabilitationPaymentsFormMessage.overview.unionSickPay,
}

export enum AttachmentTypes {
  STUDY_CONFIRMATION = 'studyConfirmation',
  UNION_SICK_PAY = 'unionSickPay',
}

export type NotApplicable = typeof NOT_APPLICABLE
export const NOT_APPLICABLE = 'notApplicable'
