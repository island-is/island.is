import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  buildDescriptionField,
  buildCheckboxField,
  buildSection,
  buildMultiField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  DefaultEvents,
  buildTextField,
  Application,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const witnessOneConfirmation: Form = buildForm({
  id: 'witnessConfirmation',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'witness',
      title: 'Inngangur',
      children: [
        buildMultiField({
          id: 'witness',
          title: 'Hjúskaparvottar',
          description: 'Með samþykki á þessari umsókn ábyrgist þú að enginn lagatálmi sé á fyrirhuguðum hjúskap.',
          children: [
            buildCheckboxField({
              id: 'witnessApprove',
              title: '',
              options: [
                { value: 'approve', label: 'Ég samþykki umsókn' },
                { value: 'notApprove', label: 'Ég samþykki ekki umsókn' },
              ],
              defaultValue: ''
            }),
            buildSubmitField({
              id: 'witness2SubmitApplication',
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
          ]
        })
      ]
    }),
    buildSection({
      id: 'witness2ConfirmationDone',
      title: 'Umsókn móttekin',
      children: [
        buildMultiField({
          id: 'done',
          title: 'Umsókn móttekin',
          description: 'Hjónaefnin hafa fengið þína vottun á hjónabandið og bíða nú samþykkis frá Sýslumanni.',
          children: [],
        }),
      ],
    }),
  ]
})
