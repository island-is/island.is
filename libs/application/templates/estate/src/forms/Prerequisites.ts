import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildKeyValueField,
  buildRadioField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { EstateTypes } from '../lib/constants'
import { m } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'selectEstate',
      title: '',
      children: [
        buildMultiField({
          id: 'estate',
          title: 'Ákvörðun um skipti bús',
          description:
            'Hægt er að fara fjórar leiðir við skipti á búi. Vinsamlega veldu þá leið sem þú og aðrir erfingjar viljið fara.',
          children: [
            buildKeyValueField({
              label: 'Nafn',
              value: 'Jóna Jónsdóttir',
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Kennitala',
              value: '190841-2409',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'gutter',
              title: '',
            }),
            buildKeyValueField({
              label: 'Lögheimili',
              value: 'lalallala',
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Dánardagur',
              value: '05.02.2022',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space1',
              space: 'gutter',
              title: '',
            }),
            buildRadioField({
              id: 'selectedEstate',
              title: '',
              width: 'full',
              options: [
                {
                  value: EstateTypes.noPropertyEstate,
                  label: EstateTypes.noPropertyEstate,
                  tooltip: 'Sjá nánar linkur hér',
                },
                {
                  value: EstateTypes.officialEstate,
                  label: EstateTypes.officialEstate,
                  tooltip: 'Sjá nánar linkur hér',
                },
                //{ value: 'Einkaskipti', label: 'Einkaskipti', tooltip: 'Sjá nánar linkur hér' },
                //{ value: 'Búsetuleyfi', label: 'Búsetuleyfi', tooltip: 'Sjá nánar linkur hér' },
              ],
            }),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
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
