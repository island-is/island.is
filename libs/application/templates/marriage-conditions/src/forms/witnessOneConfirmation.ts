import {
  buildForm,
  Form,
  FormModes,
  buildCheckboxField,
  buildSection,
  buildMultiField,
  buildSubmitField,
  DefaultEvents,
  buildDividerField,
} from '@island.is/application/core'
import { NO, YES } from '../lib/constants'
import { m } from '../lib/messages'

export const witnessOneConfirmation: Form = buildForm({
  id: 'witnessConfirmation',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'witness1',
      title: 'Inngangur',
      children: [
        buildMultiField({
          id: 'witness1',
          title: 'Svaramenn',
          description:
            'Með því að veita svaramannavottorð ábyrgist þú að enginn lagatálmi sé á fyrirhuguðum hjúskap þ. á m. að réttar persónuuplýsingar og upplýsingar um ríkisfang hjónaefna séu veittar. Réttar upplýsingar um hvort þau hafi áður stofnað til hjúskapar, hafi verið svipt lögræði. Hvort þau séu skyld í beinina legg eða eru systkin eða hvort annað þeirra hafi verið ættleitt af hinu.',
          children: [
            buildCheckboxField({
              id: 'witness1Approve',
              title: '',
              options: [
                { value: YES, label: 'Ég samþykki umsókn' },
                { value: NO, label: 'Ég samþykki ekki umsókn' },
              ],
              defaultValue: [YES],
            }),
            buildSubmitField({
              id: 'witness1SubmitApplication',
              title: '',
              placement: 'footer',
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
    buildSection({
      id: 'witness1ConfirmationDone',
      title: 'Umsókn móttekin',
      children: [
        buildMultiField({
          id: 'done',
          title: 'Umsókn móttekin',
          description:
            'Hjónaefnin hafa fengið þína vottun á hjónabandið og bíða nú samþykkis frá Sýslumanni.',
          children: [],
        }),
      ],
    }),
  ],
})
