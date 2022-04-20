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

export const witnessTwoConfirmation: Form = buildForm({
  id: 'witness2Confirmation',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'witness2',
      title: 'Inngangur',
      children: [
        buildMultiField({
          id: 'witness2',
          title: 'Hjúskaparvottar',
          description: 'Með samþykki á þessari umsókn ábyrgist þú að enginn lagatálmi sé á fyrirhuguðum hjúskap.',
          children: [
            buildCheckboxField({
              id: 'witness2Approve',
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
          id: 'done2',
          title: 'Umsókn móttekin',
          description: 'Hjónaefnin hafa fengið þína vottun á hjónabandið og bíða nú samþykkis frá Sýslumanni.',
          children: [],
        }),
      ],
    }),
  ]
})
