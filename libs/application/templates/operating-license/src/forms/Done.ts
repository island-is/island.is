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

import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'OperatingLicenseApplicationComplete',
  title: '',
  mode: FormModes.APPROVED,
  children: [
    buildMultiField({
      id: 'done',
      title: m.applicationComplete,
      description: m.applicationCompleteDescription,
      children: [
     
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
