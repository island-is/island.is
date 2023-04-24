import {
  buildForm,
  buildMultiField,
  buildAlertMessageField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { Form, FormModes } from '@island.is/application/types'

export const Done: Form = buildForm({
  id: 'Done',
  title: m.doneTitle.defaultMessage,
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      title: 'Umsókn móttekin',
      children: [
        buildAlertMessageField({
          id: 'done',
          title: 'Umsókn móttekin',
          message:
            'Umsókn þín um að gerast leiðbeinandi nemanda hefur verið móttekin.',
          alertType: 'success',
        }),
      ],
    }),
  ],
})
