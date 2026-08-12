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
  title: childSafetyMessages.sectionTitle,
  children: [
    buildMultiField({
      id: 'childSafety',
      title: childSafetyMessages.sectionTitle,
      description: childSafetyMessages.description,
      children: [
        buildDescriptionField({
          id: 'childSafety.question',
          title: ({ answers }) =>
            isUnborn(answers)
              ? childSafetyMessages.sliderQuestionUnborn
              : childSafetyMessages.sliderQuestion,
          titleVariant: 'h4',
          doesNotRequireAnswer: true,
          space: 2,
        }),
        buildAlertMessageField({
          id: 'childSafety.urgencyDescription',
          alertType: 'info',
          doesNotRequireAnswer: true,
          marginBottom: 0,
          condition: (answers) => {
            const { childSafetyUrgencyLevel } = getApplicationAnswers(answers)
            return (
              childSafetyUrgencyLevel !== null &&
              childSafetyUrgencyLevel !== undefined
            )
          },
          title: ({ answers, externalData }) => {
            const { childSafetyUrgencyLevel } = getApplicationAnswers(answers)
            const { childSafetyLevels } =
              getApplicationExternalData(externalData)
            return (
              childSafetyLevels.find((a) => a.value === childSafetyUrgencyLevel)
                ?.label ?? ''
            )
          },
          message: ({ answers, externalData }) => {
            const { childSafetyUrgencyLevel } = getApplicationAnswers(answers)
            const { childSafetyLevels } =
              getApplicationExternalData(externalData)
            return (
              childSafetyLevels.find((a) => a.value === childSafetyUrgencyLevel)
                ?.description ?? ''
            )
          },
        }),
        buildScaleField({
          id: 'childSafetyUrgencyLevel',
          min: 0,
          max: ({ externalData }) => {
            const { childSafetyLevels } =
              getApplicationExternalData(externalData)
            return childSafetyLevels.length > 0
              ? Number(childSafetyLevels[childSafetyLevels.length - 1].value)
              : 0
          },
          minLabel: ({ externalData }) => {
            const { childSafetyLevels } =
              getApplicationExternalData(externalData)
            return childSafetyLevels[0]?.label ?? ''
          },
          maxLabel: ({ externalData }) => {
            const { childSafetyLevels } =
              getApplicationExternalData(externalData)
            return childSafetyLevels[childSafetyLevels.length - 1]?.label ?? ''
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
          marginTop: 0,
          condition: showEmergencyWarning,
          message: childSafetyMessages.warningText,
        }),
      ],
    }),
  ],
})
