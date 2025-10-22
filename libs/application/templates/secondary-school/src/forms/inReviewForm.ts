import {
  buildCustomField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../lib/messages'
import { MmsLogo } from '@island.is/application/assets/institution-logos'

export const InReview: Form = buildForm({
  id: 'InReviewForm',
  logo: MmsLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: '',
      tabTitle: conclusion.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'conclusionMultiField',
          title: conclusion.overview.pageTitle,
          children: [
            buildCustomField({
              component: 'Overview',
              id: 'conclusion',
              description: '',
            }),
            buildMessageWithLinkButtonField({
              id: 'conclusionBottomLink',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
              marginBottom: [4, 4, 12],
            }),
          ],
        }),
      ],
    }),
  ],
})
