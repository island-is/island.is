import {
  buildForm,
  buildMultiField,
  buildSection,
  buildDescriptionField,
  buildMessageWithLinkButtonField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'

export const Rejected: Form = buildForm({
  id: 'GrindavikHousingBuyoutRejected',
  title: m.application.general.name,
  mode: FormModes.REJECTED,
  children: [
    buildSection({
      id: 'applicationRejected',
      title: m.rejected.sectionTitle,
      children: [
        buildMultiField({
          id: 'applicationRejectedMultiField',
          title: m.rejected.sectionTitle,
          children: [
            buildDescriptionField({
              id: 'applicationRejectedIntro',
              marginBottom: 3,
              title: '',
              description: m.rejected.text,
            }),
            buildMessageWithLinkButtonField({
              id: 'applicationRejectedLink',
              title: '',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
            }),
          ],
        }),
      ],
    }),
  ],
})
