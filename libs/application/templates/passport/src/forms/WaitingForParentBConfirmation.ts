import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const WaitingForParentBConfirmation: Form = buildForm({
  id: 'PassportApplicationWaitingForParentB',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildMultiField({
      id: 'waitingForConfirmation',
      title: m.waitingForConfirmationTitle,
      description: (application: Application) => ({
        ...m.waitingForConfirmationDescription,
        values: {
          childsName: getValueViaPath(
            application.answers,
            'childsPersonalInfo.name',
          ) as string,
          guardian2Name: getValueViaPath(
            application.answers,
            'childsPersonalInfo.guardian2.name',
          ) as string,
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
          description: m.applicationCompleteNextStepsDescriptionParentA,
          space: 'smallGutter',
        }),
      ],
    }),
  ],
})
