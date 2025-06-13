import {
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import {
  shouldShowCalculatedRemunerationDate,
  shouldShowIsStudyingFileUpload,
} from '../../../utils/conditionUtils'

export const questionsSubSection = buildSubSection({
  id: 'questionsSubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .questionsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'questions',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .questionsSubSectionTitle,
      children: [
        buildRadioField({
          id: 'questions.isSelfEmployed',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsSelfEmployed,
          description:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsSelfEmployedDescription,
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildDescriptionField({
          id: 'questions.calculatedRemunerationDate.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsCalculatedRemunerationDate,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => shouldShowCalculatedRemunerationDate(answers),
        }),
        buildDateField({
          id: 'questions.calculatedRemunerationDate',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => shouldShowCalculatedRemunerationDate(answers),
        }),
        buildRadioField({
          id: 'questions.isPartTimeEmployed',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsPartTimeEmployed,
          space: 4,
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildRadioField({
          id: 'questions.isStudying',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsStudying,
          space: 4,
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildDescriptionField({
          id: 'questions.isStudyingFileUpload.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.shared
              .uploadConfirmationDocument,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => shouldShowIsStudyingFileUpload(answers),
        }),
        buildFileUploadField({
          id: 'questions.isStudyingFileUpload',
          ...fileUploadSharedProps,
          condition: (answers) => shouldShowIsStudyingFileUpload(answers),
        }),
      ],
    }),
  ],
})
