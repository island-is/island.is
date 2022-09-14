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
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'overview',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overview',
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
              id: 'space',
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
                  name: 'Senda inn tilkynningu',
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
