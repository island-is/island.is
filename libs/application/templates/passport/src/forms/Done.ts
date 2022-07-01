import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { SubmitResponse } from '../lib/constants'
import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'PassportApplicationComplete',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildMultiField({
      id: 'done',
      title: m.applicationComplete,
      description: m.applicationCompleteDescription,
      children: [
        buildDescriptionField({
          id: 'applicationNr',
          title: m.applicationCompleteNumber,
          titleVariant: 'h3',
          description: (application: Application) =>
            (application.externalData.submitPassportApplication
              ?.data as SubmitResponse)?.orderId,
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'nextStepsDescription',
          title: m.applicationCompleteNextSteps,
          titleVariant: 'h3',
          description: m.applicationCompleteNextStepsDescription,
          space: 'containerGutter',
        }),
      ],
    }),
  ],
})
