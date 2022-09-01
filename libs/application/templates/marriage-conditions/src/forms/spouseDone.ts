import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const done: Form = buildForm({
  id: 'spouse_done',
  title: 'Umsókn móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'congrats',
      component: 'NextSteps',
      title: 'Umsókn móttekin',
    }),
  ],
})
