import { MessageDescriptor } from 'react-intl'
import { medicalAndRehabilitationPaymentsFormMessage } from './messages'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  studyConfirmation:
    medicalAndRehabilitationPaymentsFormMessage.overview.studyConfirmation,
  unionSickPayConfirmation:
    medicalAndRehabilitationPaymentsFormMessage.overview
      .unionSickPayConfirmation,
}

export enum AttachmentTypes {
  STUDY_CONFIRMATION = 'studyConfirmation',
  UNION_SICK_PAY_CONFIRMATION = 'unionSickPayConfirmation',
}

export type NotApplicable = typeof NOT_APPLICABLE
export const NOT_APPLICABLE = 'notApplicable'
