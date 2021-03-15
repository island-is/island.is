import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildCheckboxField,
  buildCustomField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildExternalDataProvider,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const ApplicationForm: Form = buildForm({
  id: 'ApplicationDraft',
  title: 'Meðmælendalisti',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'termsAndConditions',
      title: 'Skilmálar',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Skilmálar',
          subTitle: 'Eftirfarandi gildir um söfnun meðmælenda',
          description:
            'Eingöngu Þjóðskrá Íslands og yfirkjörstjórnir hafa aðgang  að söfnun meðmælanna ásamt þeim stjórnmálaflokki sem stofnar viðkomandi söfnun. Óheimilt er að dreifa meðmælunum eða þeim upplýsingum sem þar koma fram. Hér er hægt að skila framboðum til yfirkjörstjórna og gera frambjóðendum kleift að undirrita yfirlýsingu sína um framboð rafrænt.',
          dataProviders: [],
        }),
      ],
    }),
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
      ],
    }),
    buildSection({
      id: 'overview',
      title: 'Safna meðmælum',
      children: [
        buildCustomField({
          id: 'overviewComponent',
          title: 'Yfirlit meðmælendalista',
          component: 'Overview',
        }),
      ],
    }),

    buildSection({
      id: 'partyName',
      title: 'Nafn',
      children: [
        buildMultiField({
          title: '',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Hefja söfnun',
              actions: [
                { event: 'SUBMIT', name: 'Hefja söfnun', type: 'primary' },
              ],
            }),
            buildTextField({
              id: 'partyName',
              title: m.partyName,
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
