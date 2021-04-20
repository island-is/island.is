import {
  buildForm,
  buildDescriptionField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const ExampleForm: Form = buildForm({
  id: 'ExampleFormDraft',
  title: 'Umsókn um fjármögnun',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildDescriptionField({
          id: 'overview',
          title: 'Takk fyrir að sækja um',
          description:
            'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
        }),
      ],
    }),
    buildSubmitField({
      id: 'submit',
      placement: 'footer',
      title: 'Senda inn umsókn',
      actions: [{ event: 'SUBMIT', name: 'Senda inn umsókn', type: 'primary' }],
    }),
  ],
})
