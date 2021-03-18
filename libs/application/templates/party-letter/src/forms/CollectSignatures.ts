import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const ReviewApplication: Form = buildForm({
  id: 'Collect signatures',
  title: 'Safna undirskriftum',
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'intro',
      title: 'Safna meðmælum',
      children: [
        buildMultiField({
          id: 'about',
          title: '',
          children: [
            buildDescriptionField({
              id: 'final',
              title: 'Mæla með lista',
              description: 'Þú getur nú farið að taka á móti meðmælum',
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
