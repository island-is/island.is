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
          id: 'selfAssessment.hadAssistance',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .hadAssistance,
          options: getYesNoOptions(),
          required: true,
          width: 'half',
        }),
        buildDescriptionField({
          id: 'selfAssessment.highestLevelOfEducationDescriptionField',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .highestlevelOfEducationDescription,
          titleVariant: 'h4',
          space: 4,
        }),
        buildSelectField({
          id: 'selfAssessment.educationalLevel',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .levelOfEducationTitle,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .levelOfEducationPlaceholder,
          required: true,
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
