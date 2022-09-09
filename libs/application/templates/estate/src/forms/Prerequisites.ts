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
import { EstateRegistrant } from '@island.is/clients/syslumenn'

function isEstateRegistrant(
  data: string | number | boolean | object | undefined,
): data is { estate: EstateRegistrant } {
  return (
    (data as { estate: EstateRegistrant }).estate.nameOfDeceased !== undefined
  )
}

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
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateRegistrant(data) ? data.estate.nameOfDeceased : 'Bingo',
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Kennitala',
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateRegistrant(data)
                  ? data.estate.nationalIdOfDeceased
                  : 'Bango',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'gutter',
              title: '',
            }),
            buildKeyValueField({
              label: 'Lögheimili',
              value: 'La la Land 123', // TODO: address this with API about getting lögheimili
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Dánardagur',
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateRegistrant(data)
                  ? data.estate.dateOfDeath.toString()
                  : 'Dánardagur ekki skráður',
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
