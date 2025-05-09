import {
  buildForm,
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const RejectedForm: Form = buildForm({
  id: 'RejectedForm',
  mode: FormModes.REJECTED,
  children: [
    buildSection({
      id: 'rejected.section',
      children: [
        buildDescriptionField({
          id: 'rejected.description',
          title: 'Umsókn hafnað',
          description:
            'Umsókninni hefur verið hafnað, fyrir frekari upplýsingar hafðu samband við Lögbirting.',
        }),
      ],
    }),
  ],
})
