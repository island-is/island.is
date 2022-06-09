import {
  Application,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { SubmitResponse } from '../lib/constants'
import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'PassportApplicationComplete',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    buildMultiField({
      id: 'done',
      title: m.applicationComplete,
      description: m.applicationCompleteDescription,
      children: [
        buildKeyValueField({
          label: m.applicationCompleteNumber,
          value: (application: Application) => {
            console.log(application)
            return (application.externalData.submitPassportApplication
              ?.data as SubmitResponse)?.orderId
          },
        }),
        buildDividerField({ title: ' ' }),
        buildDescriptionField({
          id: 'nextStepsDescription',
          title: m.applicationCompleteNextSteps,
          titleVariant: 'h3',
          description: m.applicationCompleteNextStepsDescription,
        }),
      ],
    }),
  ],
})
