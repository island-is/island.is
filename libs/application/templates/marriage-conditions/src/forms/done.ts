import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'congrats',
      component: 'Congratulations',
      title: 'Umsókn send áfram á þinn maka',
      description:
        'Umsókn þín um könnun hjónavígsluskilyrða hefur nú verið send á þinn maka.',
    }),
  ],
})
