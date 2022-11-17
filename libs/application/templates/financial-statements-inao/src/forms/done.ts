import {
  buildForm,
  buildSection,
  buildMultiField,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: '',
      children: [
        buildMultiField({
          id: 'conclusion',
          title: m.received,
          children: [
            buildCustomField({
              id: 'overview',
              component: 'Success',
              title: m.applicationAccept,
            }),
            buildCustomField({
              id: 'signature',
              component: 'Success',
              title: (application) => {
                const answers = application.answers
                const externalData = application.externalData
                console.log(externalData)

                const email = getValueViaPath(answers, 'about.email')
                const userType = getValueViaPath(
                  externalData,
                  'getUserType.data.value',
                )

                console.log({ email, userType })
                return m.applicationAccept
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
