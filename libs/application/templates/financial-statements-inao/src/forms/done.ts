import { Application } from '@island.is/application/types'

import {
  buildForm,
  buildSection,
  buildMultiField,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { getCurrentUserType } from '../lib/utils/helpers'
import { FSIUSERTYPE } from '../types'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'conclusionSection',
      children: [
        buildMultiField({
          id: 'conclusion',
          title: (application: Application) => {
            const answers = application.answers
            const externalData = application.externalData
            const userType = getCurrentUserType(answers, externalData)
            return userType === FSIUSERTYPE.INDIVIDUAL
              ? m.infoReceived
              : m.received
          },
          children: [
            buildCustomField({
              id: 'overview',
              component: 'Success',
              title: m.applicationAccept,
            }),
          ],
        }),
      ],
    }),
  ],
})
