import {
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'

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
            buildKeyValueField({
              label: m.name,
              value: 'Jóna Jónsdóttir',
              width: 'half',
            }),
            buildKeyValueField({
              label: m.nationalId,
              value: '190841-2409',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.deathDate,
              value: '05.02.2022',
              width: 'half',
            }),
            buildKeyValueField({
              label: m.address,
              value: 'Bolholt 6, 105 Reykjavík',
              width: 'half',
            }),
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
