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
              id: 'overviewComponent',
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
      id: 'partyName',
      title: 'Nafn',
      children: [
        buildMultiField({
          title: '',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Hefja söfnun',
              actions: [
                { event: 'SUBMIT', name: 'Hefja söfnun', type: 'primary' },
              ],
            }),
            buildTextField({
              id: 'partyName',
              title: m.partyName,
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
