import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { isApplicationForCondition } from '../lib/utils'
import { B_RENEW, B_TEMP } from '../shared'

export const declined: Form = buildForm({
  id: 'declined',
  title: m.applicationDenied,
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'rejected',
      component: 'Declined',
      title: m.applicationDenied,
      condition: isApplicationForCondition(B_TEMP),
    }),
    buildCustomField({
      id: 'rejected',
      component: 'Blocked',
      title: m.applicationBlocked,
      condition: isApplicationForCondition(B_RENEW),
    }),
  ],
})
