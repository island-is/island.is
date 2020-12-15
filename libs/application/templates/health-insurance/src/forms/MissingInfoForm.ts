import {
  buildCustomField,
  buildDividerField,
  buildFileUploadField,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
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
      name: 'Missing informaton',
      children: [
        buildMultiField({
          id: 'missingInfoFields',
          name: 'Missing information',
          description: '',
          children: [
            buildCustomField({
              id: 'description',
              name: 'Agent comments',
              component: 'AgentComment',
            }),
            buildDividerField({ name: 'Your answer', color: 'dark400' }),
            buildCustomField({
              id: 'missingInfo.date',
              name: '',
              component: 'HiddenDateField',
            }),
            buildTextField({
              id: 'missingInfo.remarks',
              name: m.additionalRemarks,
              placeholder: m.additionalRemarksPlaceholder,
              variant: 'textarea',
            }),
            buildFileUploadField({
              id: 'missingInfo.files',
              name: '',
              introduction: '',
            }),
            buildDividerField({ name: 'Previous answers', color: 'dark400' }),
            buildCustomField({
              id: 'submittedData',
              name: '',
              component: 'Review',
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
