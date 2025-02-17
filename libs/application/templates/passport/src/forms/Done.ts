import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { Passport } from '../lib/constants'
import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'PassportApplicationComplete',
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      id: 'done',
      title: m.applicationComplete,
      description: (application: Application) => ({
        ...m.applicationCompleteDescriptionText,
        values: {
          name:
            getValueViaPath(application.answers, 'childsPersonalInfo.name') ??
            getValueViaPath(application.answers, 'personalInfo.name'),
        },
      }),
      children: [
        buildDescriptionField({
          id: 'nextStepsTitle',
          title: m.applicationCompleteNextSteps,
          titleVariant: 'h3',
          marginBottom: 1,
        }),
        buildDescriptionField({
          id: 'nextStepsDescription',
          description: (application: Application) =>
            (application.answers.passport as Passport)?.userPassport !== ''
              ? m.applicationCompleteNextStepsDescriptionPersonalApplication
              : m.applicationCompleteNextStepsDescription,
        }),
      ],
    }),
  ],
})
