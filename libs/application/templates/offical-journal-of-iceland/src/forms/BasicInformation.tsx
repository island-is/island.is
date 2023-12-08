import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
export const BasicInformation: Form = buildForm({
  id: 'OfficalJournalOfIcelandBasicInformation',
  title: 'Skilyrði', // page title
  mode: FormModes.NOT_STARTED,
  children: [
    buildSection({
      id: 'ExternalData',
      title: m.prerequisitesSectionTitle,
      children: [],
    }),
    buildSection({
      id: 'BasicInformation',
      title: m.basicInformationSectionTitle,
      children: [
        buildCustomField({
          id: 'basicInformation',
          title: '',
          component: 'BasicInformation',
        }),
      ],
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
