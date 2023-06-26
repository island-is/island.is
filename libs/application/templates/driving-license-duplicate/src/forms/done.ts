import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'DrivingLicenseDuplicateApplicationComplete',
  title: 'Umsókn staðfest',
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      id: 'done',
      title: 'Umsókn staðfest',
      children: [
        buildCustomField(
          {
            id: 'congratulationsAlert',
            title: '',
            component: 'Alert',
          },
          {
            title: m.congratulationsTitle,
            type: 'success',
            message: m.congratulationsTitleSuccess,
          },
        ),
        buildDescriptionField({
          id: 'nextStepsDescription',
          title: m.congratulationsNextStepsTitle,
          titleVariant: 'h3',
          description: m.congratulationsNextStepsDescription,
          space: 'containerGutter',
        }),
      ],
    }),
  ],
})
