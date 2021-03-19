import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  buildSection,
  buildSubmitField,
  buildTextField,
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
      title: 'Samþykkja',
      children: [

        buildMultiField({
          id: 'about',
          title: 'Listabókstafs meðmælendalisti (Q)',
          children: [
            buildCustomField({
              id: 'disclaimer',
              title: '',
              component: 'SignatureDisclaimer',
            }),
            buildTextField({
              id: 'signature',
              title: 'Nafn',
              variant: 'text',
              placeholder: 'Nafn',
              backgroundColor: 'blue'
            }),

            buildSubmitField({
              id: 'sign',
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
