import {
  buildAsyncSelectField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

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
        buildAsyncSelectField({
          id: 'selfAssessment.highestLevelOfEducation',
          title:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .levelOfEducationTitle,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.selfAssessment
              .levelOfEducationPlaceholder,
          required: true,
          loadOptions: async () => {
            return [
              // TODO: Here we need to get the data from the API
              {
                label: 'TBD',
                value: 'TBD',
              },
              {
                label: 'Hef lokið grunnskólaprófi eða minna',
                value: 'Hef lokið grunnskólaprófi eða minna',
              },
              {
                label:
                  'Hef lokið stúdentsprófi, iðnnámi eða starfsnámi í framhaldsskóla',
                value:
                  'Hef lokið stúdentsprófi, iðnnámi eða starfsnámi í framhaldsskóla',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
