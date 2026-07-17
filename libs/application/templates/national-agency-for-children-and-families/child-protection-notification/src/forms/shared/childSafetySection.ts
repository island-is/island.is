import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildScaleField,
  buildSection,
} from '@island.is/application/core'
import { childSafetyMessages } from '../../lib/messages'
import { isUnborn, showEmergencyWarning } from '../../utils/conditionUtils'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'

export const childSafetySection = buildSection({
  id: 'childSafetySection',
  title: childSafetyMessages.shared.sectionTitle,
  children: [
    buildMultiField({
      id: 'childSafety',
      title: childSafetyMessages.shared.sectionTitle,
      description: childSafetyMessages.shared.description,
      children: [
        buildDescriptionField({
          id: 'childSafety.question',
          title: ({ answers }) =>
            isUnborn(answers)
              ? childSafetyMessages.unborn.sliderQuestion
              : childSafetyMessages.shared.sliderQuestion,
          titleVariant: 'h4',
          doesNotRequireAnswer: true,
          space: 2,
        }),
        buildAlertMessageField({
          id: 'childSafety.urgencyDescription',
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (answers) => {
            const { childSafetyUrgencyLevel } = getApplicationAnswers(answers)
            return (
              childSafetyUrgencyLevel !== null &&
              childSafetyUrgencyLevel !== undefined
            )
          },
          title: ({ answers, externalData }) => {
            const { childSafetyUrgencyLevel } = getApplicationAnswers(answers)
            const { urgencyAssessments } =
              getApplicationExternalData(externalData)
            return (
              urgencyAssessments.find((a) => a.value === childSafetyUrgencyLevel)
                ?.label ?? ''
            )
          },
          message: ({ answers, externalData }) => {
            const { childSafetyUrgencyLevel } = getApplicationAnswers(answers)
            const { urgencyAssessments } =
              getApplicationExternalData(externalData)
            return (
              urgencyAssessments.find((a) => a.value === childSafetyUrgencyLevel)
                ?.description ?? ''
            )
          },
        }),
        buildScaleField({
          id: 'childSafetyUrgencyLevel',
          min: 0,
          max: ({ externalData }) => {
            const { urgencyAssessments } =
              getApplicationExternalData(externalData)
            return urgencyAssessments.length > 0
              ? Number(urgencyAssessments[urgencyAssessments.length - 1].value)
              : 0
          },
          minLabel: ({ externalData }) => {
            const { urgencyAssessments } =
              getApplicationExternalData(externalData)
            return urgencyAssessments[0]?.label ?? ''
          },
          maxLabel: ({ externalData }) => {
            const { urgencyAssessments } =
              getApplicationExternalData(externalData)
            return (
              urgencyAssessments[urgencyAssessments.length - 1]?.label ?? ''
            )
          },
          step: 1,
          required: true,
          marginTop: 2,
          marginBottom: 2,
        }),
        buildAlertMessageField({
          id: 'childSafety.emergencyWarning',
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: showEmergencyWarning,
          message: childSafetyMessages.shared.warningText,
        }),
      ],
    }),
  ],
})
