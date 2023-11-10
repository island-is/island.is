import {
  buildCustomField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'doneScreen',
      title: '',
      children: [
        buildMultiField({
          id: 'doneScreen',
          title: m.listSigned,
          description: m.listSignedDescription,
          children: [
            buildCustomField({
              id: 'listSigned',
              title: '',
              component: 'ListSigned',
            }),
            buildMessageWithLinkButtonField({
              id: 'done.goToServicePortal',
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
