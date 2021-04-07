import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildCheckboxField,
  buildCustomField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildFileUploadField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const ApplicationForm: Form = buildForm({
  id: 'ApplicationDraft',
  title: m.constituencySection.title,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'signatures',
      title: m.gatherSignatures.title,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.gatherSignatures.title,
          children: [
            buildCustomField({
              id: 'signatures',
              title: m.gatherSignatures.title,
              component: 'Signatures',
            }),

            buildCheckboxField({
              id: 'includePapers',
              title: '',
              strong: true,
              options: [
                {
                  value: 'yes',
                  label: m.recommendations.includePapers,
                },
              ],
              defaultValue: '',
            }),
            buildCustomField({
              id: 'fileUploadDisclaimer',
              title: m.recommendations.title,
              component: 'FileUploadDisclaimer',
            }),
            buildFileUploadField({
              condition: (answer) => answer.includePapers !== undefined,
              id: 'documents',
              title: '',
              introduction: '',
              maxSize: 10000000,
              uploadAccept: '.xlsx',
              uploadHeader: m.recommendations.fileUploadHeader,
              uploadDescription: m.recommendations.uploadDescription,
              uploadButtonLabel: m.recommendations.uploadButtonLabel,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSection',
      title: m.overviewSection.title,
      children: [
        buildMultiField({
          id: 'overviewSubmit',
          title: m.overviewSection.title,
          description: m.overviewSection.description,
          children: [
            buildCustomField({
              id: 'review',
              title: '',
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'submit',
              title: '',
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.overviewSection.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'conclusion',
          title: m.conclusion.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
