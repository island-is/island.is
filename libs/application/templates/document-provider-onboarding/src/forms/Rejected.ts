import {
  buildDescriptionField,
  buildForm,
  buildImageField,
  buildMultiField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  ApplicationTypes,
  Form,
  FormModes,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { OnThePhoneOutside } from '@island.is/application/assets/graphics'

export const Rejected: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: m.rejectedTitle,
  mode: FormModes.REJECTED,
  children: [
    buildMultiField({
      id: 'rejected',
      title: m.rejectedTitle,
      description: m.rejectedSubTitle,
      children: [
        buildDescriptionField({
          id: 'RejectionScreen',
          title: m.rejectedSubHeading,
          titleVariant: 'h3',
          description: (application: Application) =>
            (getValueViaPath(
              application.answers,
              'rejectionReason',
            ) as string) ?? '',
        }),
        buildImageField({
          id: 'ManOnBench',
          image: OnThePhoneOutside,
          imageWidth: ['full', 'full', '50%', '50%'],
          imagePosition: 'center',
        }),
      ],
    }),
  ],
})
