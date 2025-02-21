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
import Logo from '../assets/Logo'

export const Approved: Form = buildForm({
  id: 'GrindavikHousingBuyoutApproved',
  title: m.application.general.name,
  mode: FormModes.APPROVED,
  logo: Logo,
  children: [
    buildSection({
      id: 'applicationApproved',
      title: m.approved.sectionTitle,
      children: [
        buildMultiField({
          id: 'applicationApprovedMultiField',
          title: m.approved.sectionTitle,
          children: [
            buildDescriptionField({
              id: 'applicationApprovedIntro',
              marginBottom: 3,
              description: m.approved.text,
            }),
            buildMessageWithLinkButtonField({
              id: 'applicationApprovedLink',
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
