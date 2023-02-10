import {
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'

export const form: Form = buildForm({
  id: 'officialExchange',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'overviewOfficialExchange',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overviewOfficialExchange',
          title: m.overviewTitle,
          description: m.overviewSubtitleOfficialEstate,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'deceasedHeader',
              title: m.theDeceased,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'space0',
              title: '',
              space: 'gutter',
            }),
            ...deceasedInfoFields,
            buildSubmitField({
              id: 'officialExchange.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
