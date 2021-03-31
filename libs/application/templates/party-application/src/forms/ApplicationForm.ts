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
