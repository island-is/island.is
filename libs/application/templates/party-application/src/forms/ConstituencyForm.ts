import {
  buildForm,
  buildSection,
  buildSubmitField,
  buildCustomField,
  Form,
  FormModes,
  buildRadioField,
  buildMultiField,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const ConstituencyForm: Form = buildForm({
  id: 'ApplicationDraft',
  title: 'Framboð',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'constituency',
      title: 'Velja kjördæmi',
      children: [
        buildMultiField({
          id: 'information',
          title: 'Upplýsingar',
          description:
            'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplisýngar hafi verið gefnar upp.',
          children: [
            buildCustomField({
              id: 'applicantOverview',
              title: '',
              component: 'Applicant',
            }),
            buildRadioField({
              id: 'constituencies',
              title: 'Veldu kjördæmi',
              width: 'half',
              largeButtons: true,
              options: [
                { value: 'Norðausturkjördæmi', label: 'Norðausturkjördæmi' },
                {
                  value: 'Reykjavíkurkjördæmi norður',
                  label: 'Reykjavíkurkjördæmi norður',
                },
                { value: 'Suðurkjördæmi', label: 'Suðurkjördæmi' },
                { value: 'Norðvesturkjördæmi', label: 'Norðvesturkjördæmi' },
                {
                  value: 'Reykjavíkurkjördæmi suður',
                  label: 'Reykjavíkurkjördæmi suður',
                },
                { value: 'Suðvesturkjördæmi', label: 'Suðvesturkjördæmi' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: 'Staðfesta',
      children: [
        buildMultiField({
          id: 'residenceChangeOverview',
          title: '',
          children: [
            buildCustomField({
              id: 'residenceChangeReview',
              title: 'm.contract.general.pageTitle',
              component: 'SubmitConfirmation',
            }),
            buildSubmitField({
              id: 'submit',
              title: '',
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: 'Hefja söfnun', type: 'primary' },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'overviewComponent',
          title: 'Yfirlit hér verður söfnunarlisti',
          component: 'Overview',
        }),
      ],
    }),
  ],
})
