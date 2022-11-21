import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { SubmitResponse } from '../lib/constants'
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
          id: 'applicationNr',
          title: m.congratulationsApplicationNumber,
          titleVariant: 'h3',
          description: (application: Application) =>
            (application.externalData.submitApplication?.data as SubmitResponse)
              ?.orderId,
          space: 'gutter',
        }),
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
