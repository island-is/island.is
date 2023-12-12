import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
export const BasicInformation: Form = buildForm({
  id: 'OfficalJournalOfIcelandBasicInformation',
  title: 'Stjórnartíðindi',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
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
        buildMultiField({
          id: 'basicInformation',
          title: '',
          space: 2,
          children: [
            buildCustomField({
              id: 'basicInformation',
              title: '',
              component: 'BasicInformation',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.continue,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.continue,
                  type: 'primary',
                },
              ],
            }),
          ],
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
