import {
  buildCustomField,
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

export const ReviewApplication: Form = buildForm({
  id: 'HealthInsuranceDraft',
  name: m.formTitle,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'approveSection',
      name: 'Approve form',
      children: [
        buildMultiField({
          id: 'missingInfoFields',
          name: 'Approve application for mocking',
          description: '',
          children: [
            buildTextField({
              id: 'agentComments',
              name: m.additionalRemarks,
              variant: 'textarea',
              placeholder: m.additionalRemarksPlaceholder,
            }),
            buildSubmitField({
              id: 'approval',
              placement: 'screen',
              name: 'Do you approve this application?',
              actions: [
                {
                  event: 'MISSING_INFO',
                  name: 'Missing information',
                  type: 'subtle',
                },
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
