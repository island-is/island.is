import {
  buildCheckboxField,
  buildDividerField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const ReviewApplication: Form = buildForm({
  id: 'Collect signatures',
  title: 'Safna undirskriftum',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [
        buildMultiField({
          id: 'about',
          title: '',
          children: [
            buildDescriptionField({
              id: 'final',
              title: 'Safna meðmælum',
              description: 'Þú getur nú farið að taka á móti meðmælum',
            }),
            buildSubmitField({
              id: 'approvedByReviewer',
              placement: 'footer',
              title: 'Senda inn umsókn',
              actions: [
                { event: 'APPROVE', name: 'Senda inn umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Umsókn móttekin',
          description: 'Umsókn hefur verið mótekin',
        }),
      ],
    }),
  ],
})
