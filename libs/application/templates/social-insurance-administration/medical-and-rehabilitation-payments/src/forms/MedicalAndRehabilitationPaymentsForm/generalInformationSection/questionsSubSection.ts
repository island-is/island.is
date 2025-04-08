import {
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { getApplicationAnswers } from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

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
          id: 'questions.isSelfEmployedDate.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsSelfEmployedDate,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            const { isSelfEmployed } = getApplicationAnswers(answers)
            return isSelfEmployed === YES
          },
        }),
        buildDateField({
          id: 'questions.isSelfEmployedDate',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => {
            const { isSelfEmployed } = getApplicationAnswers(answers)
            return isSelfEmployed === YES
          },
        }),
        buildRadioField({
          id: 'questions.isWorkingPartTime',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsWorkingPartTime,
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
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsStudyingFileUpload,
          space: 4,
          titleVariant: 'h4',
          condition: (answers) => {
            const { isStudying } = getApplicationAnswers(answers)
            return isStudying === YES
          },
        }),
        buildFileUploadField({
          id: 'questions.isStudyingFileUpload',
          ...fileUploadSharedProps,
          condition: (answers) => {
            const { isStudying } = getApplicationAnswers(answers)
            return isStudying === YES
          },
        }),
      ],
    }),
  ],
})
