import {
  buildForm,
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const ApprovedForm: Form = buildForm({
  id: 'ApprovedForm',
  mode: FormModes.APPROVED,
  children: [
    buildSection({
      id: 'approved.section',
      children: [
        buildDescriptionField({
          id: 'approved.description',
          title: 'Umsókn lokið',
          description:
            'Umsóknin hefur verið samþykkt og birt í Lögbirtingablaðinu.',
        }),
      ],
    }),
  ],
})
