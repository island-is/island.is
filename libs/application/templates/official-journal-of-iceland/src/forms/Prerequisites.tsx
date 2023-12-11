import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
export const PrerequsitesForm: Form = buildForm({
  id: 'OfficalJournalOfIcelandPreRequsitesForm',
  title: 'Skilyrði', // page title
  mode: FormModes.NOT_STARTED,
  children: [
    buildSection({
      id: 'ExternalData',
      title: m.prerequisitesSectionTitle,
      children: [
        buildMultiField({
          id: 'prerequisites',
          title: '',
          children: [
            buildCustomField({
              id: 'prerequisites',
              title: '',
              component: 'Prerequisites',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'BasicInformation',
      title: m.basicInformationSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'AdditionsAndDocuments',
      title: m.additionsAndDocumentsSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'OriginalData',
      title: m.originalDataSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'PublicationPreferences',
      title: m.publicationPreferencesSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'Summary',
      title: m.summarySectionTitle,
      children: [],
    }),
  ],
})
