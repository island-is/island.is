import {
  buildForm,
  buildMultiField,
  buildCheckboxField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const ConstituencyForm: Form = buildForm({
  id: 'ApplicationDraft',
  title: 'Kjördæmi',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'constituency',
      title: 'Velja kjördæmi',
      children: [

        buildCheckboxField({
          id: 'constituencies',
          title: 'Veldu kjördæmi fyrir Demókrataflokkinn (Q)',
          width: 'half',
          large: true,
          options: [
            { value: 'northEast', label: 'Norðausturkjördæmi' },
            { value: 'rvkNorth', label: 'Reykjavíkurkjördæmi norður' },
            { value: 'south', label: 'Suðurkjördæmi' },
            { value: 'northWest', label: 'Norðvesturkjördæmi' },
            { value: 'rvkSouth', label: 'Reykjavíkurkjördæmi suður' },
            { value: 'southWest', label: 'Suðvesturkjördæmi' },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          title: 'Hefja umsókn fyrir x kjördæmi',
          placement: 'footer',
          actions: [{ event: 'SUBMIT', name: 'Hefja söfnun', type: 'primary' }],
        }),
        buildCustomField({
          id: 'overviewComponent',
          title: 'Yfirlit meðmælendalista',
          component: 'Overview',
        }),
      ],
    }),
  ],
})
