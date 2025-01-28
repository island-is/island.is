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
import { Logo } from '../assets/Logo'

export const InReview: Form = buildForm({
  id: 'InReviewForm',
  title: '',
  logo: Logo,
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
              title: '',
              description: '',
            }),
            buildMessageWithLinkButtonField({
              id: 'conclusionBottomLink',
              title: '',
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
