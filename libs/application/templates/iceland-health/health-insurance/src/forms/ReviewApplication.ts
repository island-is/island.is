import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages/messages'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'

export const ReviewApplication: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
  logo: IcelandHealthLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'approveSection',
      title: 'Approve form',
      children: [
        buildMultiField({
          id: 'missingInfoFields',
          title: 'Approve application for mocking',
          description: '',
          children: [
            buildTextField({
              id: 'agentComments[0]',
              title: m.additionalRemarks,
              variant: 'textarea',
              placeholder: m.additionalRemarksPlaceholder,
            }),
            buildSubmitField({
              id: 'approval',
              placement: 'screen',
              title: 'Do you approve this application?',
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
        buildDescriptionField({
          id: 'successfulSubmission',
          title: m.successfulSubmissionTitle,
          description: (application) => ({
            ...m.successfulSubmissionMessage,
            values: { applicationNumber: application.id },
          }),
        }),
      ],
    }),
  ],
})
