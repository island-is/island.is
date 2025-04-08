import { MessageDescriptor } from 'react-intl'
import { medicalAndRehabilitationPaymentsFormMessage } from './messages'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  studyConfirmation:
    medicalAndRehabilitationPaymentsFormMessage.overview.studyConfirmation,
}

export enum AttachmentTypes {
  STUDY_CONFIRMATION = 'studyConfirmation',
}

export type NotApplicable = typeof NOT_APPLICABLE
export const NOT_APPLICABLE = 'notApplicable'
