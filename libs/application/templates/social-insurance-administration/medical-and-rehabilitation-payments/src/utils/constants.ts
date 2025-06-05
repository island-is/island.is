import { MessageDescriptor } from 'react-intl'
import { medicalAndRehabilitationPaymentsFormMessage } from '../lib/messages'

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

export const selfAssessmentOptions = [
  {
    label:
      medicalAndRehabilitationPaymentsFormMessage.selfAssessment
        .noDifficultyOption,
    value: '0',
  },
  {
    label:
      medicalAndRehabilitationPaymentsFormMessage.selfAssessment
        .minorDifficultyOption,
    value: '1',
  },
  {
    label:
      medicalAndRehabilitationPaymentsFormMessage.selfAssessment
        .moderateDifficultyOption,
    value: '2',
  },
  {
    label:
      medicalAndRehabilitationPaymentsFormMessage.selfAssessment
        .majorDifficultyOption,
    value: '3',
  },
  {
    label:
      medicalAndRehabilitationPaymentsFormMessage.selfAssessment
        .completeInabilityOption,
    value: '4',
  },
  {
    label:
      medicalAndRehabilitationPaymentsFormMessage.selfAssessment.noAnswerOption,
    value: '5',
  },
]
