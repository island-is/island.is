import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { ChildsPersonalInfo, Passport, PersonalInfo } from '../lib/constants'
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
          name:
            (application.answers.childsPersonalInfo as ChildsPersonalInfo)
              ?.name ??
            (application.answers.personalInfo as PersonalInfo)?.name,
        },
      }),
      children: [
        buildDescriptionField({
          id: 'nextStepsTitle',
          title: m.applicationCompleteNextSteps,
          titleVariant: 'h3',
          description: '',
          marginBottom: 1,
        }),
        buildDescriptionField({
          id: 'nextStepsDescription',
          title: '',
          description: (application: Application) =>
            (application.answers.passport as Passport)?.userPassport !== ''
              ? m.applicationCompleteNextStepsDescriptionPersonalApplication
              : m.applicationCompleteNextStepsDescription,
        }),
      ],
    }),
  ],
})
