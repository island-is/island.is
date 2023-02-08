import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'
export const InReviewAdditionalDocumentsRequired: Form = buildForm({
  id: 'ParentalLeaveInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'reviewUpload',
      title: parentalLeaveFormMessages.attachmentScreen.title,
      children: [
        buildCustomField({
          id: 'additionalDocumentsRequired',
          title: parentalLeaveFormMessages.attachmentScreen.title,
          component: 'InReviewSteps',
        }),
      ],
    }),
  ],
})
