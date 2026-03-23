import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { getApplicationExternalData } from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const selfAssessmentQuestionsOneSubSection = buildSubSection({
  id: 'selfAssessmentQuestionsOneSubSection',
  tabTitle:
    medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
  children: [
    buildMultiField({
      id: 'selfAssessmentQuestionsOne',
      title:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment.sectionTitle,
      description:
        medicalAndRehabilitationPaymentsFormMessage.selfAssessment
          .sectionDescription,
      children: [
        buildRadioField({
          id: 'selfAssessmentQuestionsOne.hadAssistance',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .hadAssistance,
          options: getYesNoOptions(),
          required: true,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'selfAssessmentQuestionsOne.educationLevelDescriptionField',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .educationLevelDescription,
          titleVariant: 'h4',
          space: 4,
        }),
        buildSelectField({
          id: 'selfAssessmentQuestionsOne.educationalLevel',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .levelOfEducationTitle,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .levelOfEducationPlaceholder,
          options: (application: Application) => {
            const { educationLevels } = getApplicationExternalData(
              application.externalData,
            )

            return educationLevels.map(({ code, description }) => ({
              value: code,
              label: description,
            }))
          },
        }),
      ],
    }),
  ],
})
