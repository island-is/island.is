import {
  buildCustomField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application } from '@island.is/application/types'

export const sectionGuarantor = buildMultiField({
  condition: (_formValue, _externalData, user) => {
    return Boolean(user?.profile?.actor)
  },
  children: [
    buildDescriptionField({
      id: 'guarantor.title',
      title: m.guarantor,
      description: m.guarantorDescription,
    }),
    buildCustomField({
      component: 'Guarantor',
      id: 'guarantor',
      title: m.guarantor,
    }),
  ],
  title: '',
})
