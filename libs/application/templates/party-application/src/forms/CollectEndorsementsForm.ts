import {
  buildForm,
  buildMultiField,
  buildCheckboxField,
  buildCustomField,
  buildSection,
  buildSubmitField,
  buildFileUploadField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const CollectEndorsementsForm: Form = buildForm({
  id: 'CollectEndorsement',
  title: m.constituencySection.title,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'endorsementSection',
      title: m.endorsementList.title,
      children: [
        buildMultiField({
          id: 'endorsements',
          title: m.endorsementList.title,
          children: [
            buildCustomField({
              id: 'endorsements',
              title: m.endorsementList.title,
              component: 'EndorsementList',
            }),
            buildCheckboxField({
              id: 'includePapers',
              title: '',
              strong: true,
              options: [
                {
                  value: 'yes',
                  label: m.collectEndorsements.includePapers,
                },
              ],
              defaultValue: '',
            }),
            buildCustomField({
              id: 'fileUploadDisclaimer',
              title: m.collectEndorsements.title,
              component: 'FileUploadDisclaimer',
            }),
            buildFileUploadField({
              condition: (answer) => answer.includePapers !== undefined,
              id: 'documents',
              title: '',
              introduction: '',
              maxSize: 10000000,
              uploadAccept: '.xlsx',
              uploadHeader: m.collectEndorsements.fileUploadHeader,
              uploadDescription: m.collectEndorsements.uploadDescription,
              uploadButtonLabel: m.collectEndorsements.uploadButtonLabel,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'endorsementSectionSubmittion',
      title: m.endorsementListSubmission.title,
      children: [
        buildMultiField({
          id: 'endorsements',
          title: m.endorsementListSubmission.title,
          children: [
            buildCustomField({
              id: 'endorsements',
              title: m.endorsementListSubmission.title,
              component: 'EndorsementListSubmission',
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
          id: 'applicationApproved',
          title: m.applicationApproved.title,
          component: 'PartyApplicationApproved',
        }),
      ],
    }),
  ],
})
