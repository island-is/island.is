import {
  buildCustomField,
  buildDividerField,
  buildFileUploadField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const MissingInfoForm: Form = buildForm({
  id: 'HealthInsuranceReview',
  name: m.formTitle,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'missingInfoSection',
      name: m.missingInfoSection,
      children: [
        buildMultiField({
          id: 'missingInfoFields',
          name: m.missingInfoSection,
          description: '',
          children: [
            buildCustomField({
              id: 'description',
              name: 'Agent comments',
              component: 'AgentComment',
            }),
            buildDividerField({
              name: m.missingInfoAnswersTitle,
              color: 'dark400',
            }),
            buildCustomField({
              id: 'missingInfo.date',
              name: '',
              component: 'HiddenDateField',
            }),
            buildCustomField({
              id: 'missingInfo.remarks',
              name: '',
              component: 'MissingInfoRemarks',
            }),
            buildFileUploadField({
              id: 'missingInfo[0].files',
              name: '',
              introduction: '',
            }),
            buildDividerField({
              name: m.previousAnswersTitle,
              color: 'dark400',
            }),
            buildCustomField({
              id: 'submittedData',
              name: '',
              component: 'Review',
            }),
            buildCustomField({
              id: 'confirmCorrectInfo',
              name: '',
              component: 'ConfirmCheckbox',
            }),
            buildSubmitField({
              id: 'submit',
              name: m.submitLabel,
              placement: 'footer',
              actions: [
                { event: 'REJECT', name: 'Back to inReview', type: 'subtle' },
                { event: 'SUBMIT', name: m.submitLabel, type: 'primary' },
              ],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'successfulSubmission',
          name: m.succesfulSubmissionTitle,
          introduction: m.succesfulSubmissionMessage,
        }),
      ],
    }),
  ],
})
