import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { ChildsPersonalInfo } from '../lib/constants'
import { m } from '../lib/messages'

export const WaitingForParentBConfirmation: Form = buildForm({
  id: 'PassportApplicationWaitingForParentB',
  title: '',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildMultiField({
      id: 'waitingForConfirmation',
      title: m.waitingForConfirmationTitle,
      description: (application: Application) => ({
        ...m.waitingForConfirmationDescription,
        values: {
          childsName: (
            application.answers.childsPersonalInfo as ChildsPersonalInfo
          )?.name,
          guardian2Name: (
            application.answers.childsPersonalInfo as ChildsPersonalInfo
          )?.guardian2.name,
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
          description: m.applicationCompleteNextStepsDescriptionParentA,
          space: 'smallGutter',
        }),
      ],
    }),
  ],
})
