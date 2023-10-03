import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { Passport } from '../lib/constants'
import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'PassportApplicationComplete',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      id: 'done',
      title: m.applicationComplete,
      description: (application: Application) => ({
        ...m.applicationCompleteDescriptionText,
        values: {
          name: (
            application.answers as {
              passportName?: string
            }
          )?.passportName,
        },
      }),
      children: [
        buildDescriptionField({
          id: 'nextStepsDescription',
          title: m.applicationCompleteNextSteps,
          titleVariant: 'h3',
          description: (application: Application) =>
            (application.answers.passport as Passport)?.userPassport !== ''
              ? m.applicationCompleteNextStepsDescriptionPersonalApplication
              : m.applicationCompleteNextStepsDescription,
        }),
      ],
    }),
  ],
})
