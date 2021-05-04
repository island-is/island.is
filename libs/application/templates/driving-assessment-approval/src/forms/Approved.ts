import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildDescriptionField({
      id: 'approved',
      title: 'Móttekið',
      description: 'Við höfum móttekið akstursmatið og sent tölvupóst á xxx@yyy.zz til að láta vita.',
    }),
  ],
})
